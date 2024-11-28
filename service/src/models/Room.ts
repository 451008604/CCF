import { IRoomModel, IUserModel, DataManager } from "../shared/global/data";
import { server } from "..";
import { hall } from "./Hall";

export class Room {

    roomId: string;
    private users: Map<string, IUserModel> = new Map();

    constructor(_roomId: string) {
        this.roomId = _roomId;
    }

    // 添加玩家
    addUser(user: IUserModel, connId: string) {
        user.ConnId = connId;
        this.users.set(user.Token, user);

        server.broadcastMsg("RoomUpdate", { roomInfo: this.getRoomData() }, hall.getUserToConn(this.getUsersList()));
    }

    // 删除玩家
    delUser(token: string) {
        this.users.delete(token);

        let roomInfo = this.getRoomData();

        server.broadcastMsg("RoomUpdate", { roomInfo: roomInfo }, hall.getUserToConn(this.getUsersList()));

        // 对局结束删除房间
        hall.delRoom(this.roomId);
    }

    // 清空所有玩家
    clearUser() {
        this.users = new Map();
    }

    // 是否存在
    hasUser(token: string) {
        return this.users.has(token);
    }

    // 根据连接Id查询玩家是否此房间内
    hasUserByConnId(connId: string) {
        for (const user of this.users.values()) {
            if (user.ConnId == connId) {
                return user;
            }
        }
        return null;
    }

    // 玩家数量
    getUserNums() {
        return this.users.size;
    }

    getBookID() {
        for (const user of this.users.values()) {
            if (user.OtherData == "") {
                continue;
            }
            let bookID = JSON.parse(user.OtherData)?.["bookID"];
            return bookID ? Number(bookID) : 0;
        }
        return 0;
    }

    // 获取玩家列表
    getUsersList() {
        let arr = [];
        for (const user of this.users.values()) {
            arr.push(user);
        }
        return arr;
    }

    // 获取房间数据
    getRoomData() {
        let room: IRoomModel = { ...DataManager.roomModel };
        room.Users = this.getUsersList();

        return room;
    }

}
