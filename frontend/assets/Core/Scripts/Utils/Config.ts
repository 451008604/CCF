import { sys } from "cc";

export class Config {

    private constructor() { }
    static readonly instance: Config = new Config();

    /**
     * 获取服务器地址
     * @returns {string} 服务器地址
     */
    getServerAddress(): string {
        return "http://127.0.0.1";
    }
}
