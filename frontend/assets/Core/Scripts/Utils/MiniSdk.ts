import { sys } from "cc";

// 小游戏SDK
export class MiniSdk {
    private appid: string; // 应用id
    private platform: any; // 平台对象

    private constructor() {
        // 初始化平台对象
        if (sys.platform == sys.Platform.WECHAT_GAME) {
            this.platform = window["wx"]; // 微信小游戏
            this.appid = ""; // 微信小游戏
        }
    }
    static readonly instance: MiniSdk = new MiniSdk();


    // 获取appid
    getAppId(): string {
        return this.appid;
    }


    // 获取登录code
    getLoginCode(timeout = 5000) {
        let self = this;
        return new Promise<string>((resolve, reject) => {
            if (!self.platform) {
                resolve("");
                return;
            }
            self.platform.login({
                timeout: timeout,
                success: (res: { code: any; errMsg: any; }) => {
                    if (res.code) {
                        resolve(res.code);
                    } else {
                        reject(res.errMsg);
                    }
                },
            });
        });
    }

    createUserInfoButton() {
        let self = this;
        return new Promise<{ nickName: string, avatarUrl: string; }>((resolve, reject) => {
            let nickName = "", avatarUrl = "";
            if (!self.platform) {
                resolve({ nickName, avatarUrl });
                return;
            }
            self.platform.getSetting({
                success(res: { authSetting: { [x: string]: boolean; }; }) {
                    if (res.authSetting['scope.userInfo'] === true) {
                        self.platform.getUserInfo({
                            success: (res: any) => {
                                // 已经授权，直接获取用户信息
                                const userInfo = res.userInfo;
                                nickName = userInfo.nickName;
                                avatarUrl = userInfo.avatarUrl;
                                resolve({ nickName, avatarUrl });
                            },
                            fail: () => {
                                reject();
                            }
                        });
                    } else {
                        const button = self.platform.createUserInfoButton({
                            type: "image",
                            image: "",
                            style: {
                                left: 0,
                                top: 0,
                                width: self.getWindowInfo().windowWidth,
                                height: self.getWindowInfo().windowHeight,
                                // backgroundColor: "rgba(255, 255, 255, 0.5)",
                            },
                        });
                        button.onTap((res: { errMsg: string | string[]; rawData: any; }) => {
                            if (res.errMsg.indexOf(':ok') > -1 && !!res.rawData) {
                                button.destroy();
                                // 获取用户信息
                                const userInfo = JSON.parse(res.rawData);
                                nickName = userInfo["nickName"];
                                avatarUrl = userInfo["avatarUrl"];
                                resolve({ nickName, avatarUrl });
                            }
                        });
                    }
                },
                fail: () => {
                    reject();
                }
            });
        });
    }

    getWindowInfo() {
        if (!this.platform) {
            return;
        }
        const windowInfo = this.platform.getWindowInfo();
        return {
            pixelRatio: windowInfo.pixelRatio,  // 设备像素比
            safeArea: {  // 安全区域信息（避开刘海屏等区域）
                top: windowInfo.safeArea.top,
                bottom: windowInfo.safeArea.bottom,
                left: windowInfo.safeArea.left,
                right: windowInfo.safeArea.right,
                width: windowInfo.safeArea.width,
                height: windowInfo.safeArea.height,
            },
            screenHeight: windowInfo.screenHeight,    // 屏幕高度
            screenTop: windowInfo.screenTop,         // 屏幕上边界
            screenWidth: windowInfo.screenWidth,     // 屏幕宽度
            statusBarHeight: windowInfo.statusBarHeight,  // 状态栏高度
            windowHeight: windowInfo.windowHeight,   // 窗口高度
            windowWidth: windowInfo.windowWidth,     // 窗口宽度
        };
    }
}
