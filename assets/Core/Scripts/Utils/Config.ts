import { sys } from "cc";

export class Config {
    private appid: string; // 应用id

    private constructor() {
        // 初始化应用id
        if (sys.platform == sys.Platform.WECHAT_GAME) {
            this.appid = ""; // 微信小游戏
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
    getServerAddress(): string {
        return "https://821boxgame.sxycykj.net/api/app/clientAPI";
    }
}
