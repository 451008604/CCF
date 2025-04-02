import { RoomModel, RoomStatus, UserModel } from "../NetWork/shared/global/data";

/**
 * 数据管理器
 * 包含大厅模型、房间模型和用户自身模型
 */
export var DataManager: {
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
        users: {},
        round: 0,
        currentUserId: "",
        lastUserId: "",
        peopleNum: 0
    },
    /**
     * 用户自身模型
     * 包含用户ID、会话标识、用户名和头像
     */
    selfModel: {
        userId: "",
        token: "",
        userName: "",
        headImg: "",
        selectIdx: -1,
        pos: 0,
        score: 0,
        changeScore: 0,
        gold: 0
    },
};
