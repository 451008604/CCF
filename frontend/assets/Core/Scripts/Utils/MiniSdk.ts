/**
 * 小游戏SDK封装类，用于处理小游戏平台的API调用
 */
export class MiniSdk {
    // 平台对象引用，默认为微信小游戏API对象(wx)
    static platform = window["wx"];

    /**
     * 获取登录凭证code
     * @param timeout 超时时间，默认为5000毫秒
     * @returns Promise<string> 返回包含登录code的Promise
     */
    static getLoginCode(timeout = 5000) {
        return new Promise<string>((resolve, reject) => {
            // 检查平台是否可用
            if (!MiniSdk.platform) {
                resolve("");  // 平台不可用返回空字符串
                return;
            }

            // 调用微信登录接口
            MiniSdk.platform.login({
                timeout: timeout,  // 设置超时时间
                success: (res: { code: any; errMsg: any; }) => {
                    if (res.code) {
                        resolve(res.code);  // 成功获取code
                    } else {
                        reject(res.errMsg);  // 登录失败返回错误信息
                    }
                },
                // 注意：微信登录API没有fail回调，只有complete回调
            });
        });
    }

    /**
     * 创建用户信息授权按钮并获取用户信息
     * @returns Promise<{nickName: string, avatarUrl: string}> 返回包含用户昵称和头像的Promise
     */
    static createUserInfoButton() {
        return new Promise<{ nickName: string, avatarUrl: string; }>((resolve, reject) => {
            // 检查平台是否可用
            if (!MiniSdk.platform) {
                resolve({ avatarUrl: "", nickName: "" });  // 平台不可用返回空用户信息
                return;
            }

            let nickName = "", avatarUrl = "";

            // 检查用户授权状态
            MiniSdk.platform.getSetting({
                success(res: { authSetting: { [x: string]: boolean; }; }) {
                    // 检查用户是否已授权获取用户信息
                    if (res.authSetting['scope.userInfo'] === true) {
                        // 已授权，直接获取用户信息
                        MiniSdk.platform.getUserInfo({
                            success: (res: any) => {
                                const userInfo = res.userInfo;
                                nickName = userInfo.nickName;    // 获取昵称
                                avatarUrl = userInfo.avatarUrl;  // 获取头像URL
                                resolve({ nickName, avatarUrl });
                            },
                            fail: () => {
                                reject();  // 获取用户信息失败
                            }
                        });
                    } else {
                        // 未授权，创建授权按钮
                        const button = MiniSdk.platform.createUserInfoButton({
                            type: "image",  // 按钮类型为图片
                            image: "",      // 图片路径（可替换为实际图片路径）
                            style: {
                                left: 0,
                                top: 0,
                                // 设置按钮大小为全屏
                                width: MiniSdk.getWindowInfo().windowWidth,
                                height: MiniSdk.getWindowInfo().windowHeight,
                            },
                        });

                        // 设置按钮点击回调
                        button.onTap((res: { errMsg: string | string[]; rawData: any; }) => {
                            // 检查授权是否成功
                            if (res.errMsg.indexOf(':ok') > -1 && !!res.rawData) {
                                button.destroy();  // 销毁按钮
                                // 解析用户信息
                                const userInfo = JSON.parse(res.rawData);
                                nickName = userInfo["nickName"];
                                avatarUrl = userInfo["avatarUrl"];
                                resolve({ nickName, avatarUrl });
                            }
                        });
                    }
                },
                fail: () => {
                    reject();  // 获取授权设置失败
                }
            });
        });
    }

    /**
     * 获取窗口/屏幕信息
     * @returns 返回包含窗口信息的对象，如果平台不可用则返回undefined
     */
    static getWindowInfo() {
        // 检查平台是否可用
        if (!MiniSdk.platform) {
            return;
        }

        // 获取微信窗口信息
        const windowInfo = MiniSdk.platform.getWindowInfo();

        // 返回格式化后的窗口信息
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
