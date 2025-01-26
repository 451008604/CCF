import { WsConnection } from "tsrpc";
import { UserModel } from "../shared/global/data";

export class User implements UserModel {
    /**
     * 用户的连接对象
     */
    conn!: WsConnection;

    /**
     * 用户ID
     */
    userId: string = "";

    /**
     * 用户的token
     */
    token: string = "";

    /**
     * 用户名
     */
    userName: string = "";

    /**
     * 用户头像
     */
    headImg: string = "";

}