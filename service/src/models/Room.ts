import { webSocketServer } from "..";
import { RoomModel, RoomStatus } from "../shared/global/data";
import { hall } from "./Hall";
import { User } from "./User";

export class Room implements RoomModel {

    constructor(_roomId: string) {
        this.roomId = _roomId;
        this.resultReward = Math.floor(Math.random() + 0.5);
    }

    resultReward: number = -1;
    roomId: string;
    users: { [key: string]: User; } = {};
    roomStatus: RoomStatus = RoomStatus.GAME_WAIT;
    round: number = 0;
    currentUserId: string = "";

    /**
     * 添加玩家到房间
     * @param user 用户对象
    */
    addUser(user: User) {
        // 生成一个包含所有位置的数组
        let positions = Array.from({ length: Object.keys(this.users).length + 1 }, (_, i) => i);
        // 遍历当前房间中的用户，移除已占用的位置
        for (const user of Object.values(this.users)) {
            positions = positions.filter(pos => pos !== user.pos);
        }
        // 获取缺少的最小位置
        let minPos = positions[0];
        user.pos = minPos;
        this.users[user.userId] = user;

        if (Object.values(this.users).length == 2) {
            this.roomStatus = RoomStatus.GAME_START;

            for (const user of Object.values(this.users)) {
                if (user.pos === this.round) {
                    this.currentUserId = user.userId;
                    break;
                }
            }
        }

        webSocketServer.broadcastMsg("RoomUpdate", { roomInfo: this.getRoomData() }, hall.getUserToConn(this.users));
    }

    /**
     * 从房间中删除玩家
     * @param userId 用户ID
    */
    delUser(userId: string) {
        delete this.users[userId];

        webSocketServer.broadcastMsg("RoomUpdate", { roomInfo: this.getRoomData() }, hall.getUserToConn(this.users));
    }

    /**
     * 清空房间内所有玩家
    */
    clearUser() {
        for (const user of Object.values(this.users)) {
            this.delUser(user.userId);
        }
    }

    /**
     * 获取下一个操作的用户ID
     * @returns 下一个操作的用户ID，如果没有找到则返回空字符串
     */
    nextUserId(): string {
        // 获取当前操作的用户
        const currentUser = this.users[this.currentUserId];
        if (!currentUser) {
            return "";
        }

        // 获取当前用户的位置
        const currentPos = currentUser.pos;
        // 获取所有用户的位置并排序
        const userPositions = Object.values(this.users).map(user => user.pos).sort((a, b) => a - b);

        // 获取下一个用户的位置索引
        let nextPosIndex = userPositions.indexOf(currentPos) + 1;
        if (nextPosIndex >= userPositions.length) {
            nextPosIndex = 0;
        }

        // 获取下一个用户的位置
        const nextPos = userPositions[nextPosIndex];
        // 查找并返回下一个用户的ID
        for (const user of Object.values(this.users)) {
            if (user.pos === nextPos) {
                return user.userId;
            }
        }

        return "";
    }

    /**
     * 检查房间中是否存在指定用户
     * @param userId 用户ID
     * @returns 如果用户存在，返回用户对象；否则返回undefined
     */
    hasUser(userId: string) {
        return this.users[userId];
    }

    /**
     * 根据连接ID检查玩家是否在此房间内
     * @param connId 连接ID
     * @returns 如果玩家存在，返回用户对象；否则返回undefined
     */
    hasUserByConnId(connId: string) {
        for (const user of Object.values(this.users)) {
            if (user.conn?.id == connId) {
                return user;
            }
        }
        return;
    }

    /**
     * 获取房间的详细数据
     * @returns 返回房间的RoomModel对象
     */
    getRoomData() {
        // let room: RoomModel = {
        //     roomId: "" + this.roomId,
        //     roomStatus: this.roomStatus,
        //     users: this.users,
        //     round: 0,
        //     currentUserId: ""
        // };
        return Object.create(this) as Room;
    }

}
