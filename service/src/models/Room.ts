import { server } from "..";
import { RoomModel, RoomStatus } from "../shared/global/data";
import { hall } from "./Hall";
import { User } from "./User";

export class Room implements RoomModel {

    roomId: string;
    users: { [key: string]: User; } = {};
    roomStatus!: RoomStatus;

    constructor(_roomId: string) {
        this.roomId = _roomId;
    }

    /**
     * 添加玩家到房间
     * @param user 用户对象
     */
    addUser(user: User) {
        this.users[user.userId] = user;

        server.broadcastMsg("RoomUpdate", { roomInfo: this.getRoomData() }, hall.getUserToConn(this.users));
    }

    /**
     * 从房间中删除玩家
     * @param userId 用户ID
     */
    delUser(userId: string) {
        delete this.users[userId];

        server.broadcastMsg("RoomUpdate", { roomInfo: this.getRoomData() }, hall.getUserToConn(this.users));
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
        let room: RoomModel = {
            roomId: "" + this.roomId,
            roomStatus: this.roomStatus,
            users: this.users
        };
        return room;
    }

}
