import { Room } from "./Room";
import { IRoomModel, IUserModel } from "../shared/global/data";
import { server } from "..";
import { WsConnection } from "tsrpc";

class Hall {

    private rooms: Map<string, Room> = new Map();

    constructor() { }

    // 加入房间
    joinRoom(roomId: string, user: IUserModel, connId: string) {
        let room = this.rooms.get(roomId);

        // 房间存在且人员未满
        if (room && room.getUserNums() < 2) {
            // 已在房间内
            if (room.hasUser(user.Token)) {
                return room;
            }

            // 加入房间
            room.addUser(user, connId);
            return room;
        }

        // 新建房间
        room = new Room(roomId);
        room.addUser(user, connId);
        this.rooms.set(roomId, room);
        return room;
    }

    // 删除房间
    delRoom(roomId: string) {
        let room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        // 清空所有玩家
        room.clearUser();
        // 删除房间
        this.rooms.delete(roomId);

        console.log("剩余房间数量", this.rooms.size);
    }

    // 根据连接Id获取玩家所在房间
    userRoomByConnId(connId: string) {
        for (const roomId of this.rooms.keys()) {
            let room = this.rooms.get(roomId)!;
            let user = room.hasUserByConnId(connId);
            if (user) {
                return { roomId, room, user };
            }
        }
        return null;
    }

    // 根据连接Id退出玩家所在房间
    userQuitRoomByConnId(connId: string) {
        let info = this.userRoomByConnId(connId);
        if (info) {
            info.room.delUser(info.user.Token);
            if (info.room.getUserNums() == 0) {
                this.delRoom(info.roomId);
            }
        }
    }

    // 根据用户token获取玩家所在房间
    userExistRoomByUserToken(token: string) {
        for (const room of this.rooms.values()) {
            if (room.hasUser(token)) {
                return room;
            }
        }
        return null;
    }

    // 获取等待中的房间
    getWaitingRoom(bookID: number) {
        let roomId = "";
        this.rooms.forEach((element, k) => {
            if (element.getUserNums() < 2 && element.getBookID() == bookID) {
                roomId = k;
                return;
            }
        });
        return roomId;
    }

    // 获取用户连接
    getUserToConn(users: IUserModel[]) {
        let conns: WsConnection[] = [];
        users.forEach(user => {
            for (const conn of server.connections.values()) {
                if (conn.id == user.ConnId) {
                    conns.push(conn);
                    break;
                }
            }
        });

        return conns;
    }
}

export var hall = new Hall();
