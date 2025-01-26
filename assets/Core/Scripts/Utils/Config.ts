import { sys } from "cc";

export class Config {
    private appid: string; // 应用id

    private constructor() {
        // 初始化应用id
        if (sys.platform == sys.Platform.WECHAT_GAME) {
            this.appid = "wx1d5e0e6c11246a06"; // 微信小游戏
        }
    }
    static readonly instance: Config = new Config();

    // 获取appid
    getAppId(): string {
        return this.appid;
    }

    /**
     * 获取服务器地址
     * @returns {string} 服务器地址
     */
    getServerAddress() {
        return "https://mathboomcms.sxycykj.net/api/app/clientAPI";
    }
}
