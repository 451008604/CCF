export enum RoomStatus {
    GAME_WAIT = 0, // 等待开始
    GAME_START, // 游戏进行中
    GAME_END // 游戏已结束
}

// 房间模型
export type RoomModel = {
    roomId: string; // 房间id
    roomStatus: RoomStatus; // 房间状态
    users: { [key: string]: UserModel; }; // 玩家列表
};

// 玩家模型
export type UserModel = {
    userId: string; // 玩家id
    token: string; // 用户会话标识
    userName: string; // 用户名
    headImg: string; // 头像
};
