import { WsConnection } from "tsrpc";
import { UserModel } from "../shared/global/data";

export class User implements UserModel {
    /**
     * 变化的积分
     */
    changeScore: number = 0;

    /**
     * 积分
     */
    score: string = "0.00";

    /**
     * 对局中的位置
     */
    pos: number = 0;

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

    /**
     * 选择的索引（0 or 1）
     */
    selectIdx: number = -1;

}