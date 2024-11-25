// 房间模型
export interface IRoomModel {
    Users: IUserModel[]; // 玩家列表
}

// 玩家模型
export interface IUserModel {
    /**连接Id */
    ConnId: string;
    /**用户标识 */
    Token: string;
    /**用户名 */
    UserName: string;
    /**附加数据 */
    OtherData: string;
}

// ================================== 全局数据 ==================================

export var DataManager: {
    roomModel: IRoomModel;
    selfModel: IUserModel;
} = {
    roomModel: {
        Users: [],
    },
    selfModel: {
        ConnId: "",
        Token: "",
        UserName: "",
        OtherData: ""
    }
};
