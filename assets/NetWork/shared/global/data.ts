export enum RoomStatus {
    GAME_WAIT = 0, // 等待开始
    GAME_START, // 游戏进行中
    GAME_END, // 游戏已结束
    GAME_DISMISS // 房间解散
}

// 房间模型
export type RoomModel = {
    roomId: string; // 房间id
    roomStatus: RoomStatus; // 房间状态
    round: number; // 轮次
    currentUserId: string; // 当前操作的玩家
    users: { [key: string]: UserModel; }; // 玩家列表
};

// 玩家模型
export type UserModel = {
    userId: string; // 玩家id
    token: string; // 用户会话标识
    userName: string; // 用户名
    headImg: string; // 头像
    selectIdx: number; // 选择的索引（0 or 1）
    pos: number; // 对局中的位置
    score: string; // 积分
    changeScore: number; // 变化的积分
};
