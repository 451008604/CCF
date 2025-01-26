import { RoomModel, RoomStatus, UserModel } from "../NetWork/shared/global/data";

/**
 * 数据管理器
 * 包含大厅模型、房间模型和用户自身模型
 */
export var DataManager: {
    hallModel: any;
    roomModel: RoomModel;
    selfModel: UserModel;
} = {
    /**
     * 房间模型
     * 包含房间ID、房间状态和用户列表
     */
    roomModel: {
        roomId: "",
        roomStatus: RoomStatus.GAME_WAIT,
        users: {}
    },
    /**
     * 用户自身模型
     * 包含用户ID、会话标识、用户名和头像
     */
    selfModel: {
        userId: "",
        token: "",
        userName: "",
        headImg: ""
    },
    /**
     * 大厅模型
     * 目前未定义
     */
    hallModel: undefined,
};