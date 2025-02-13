import { Room } from "./Room";
import { WsConnection } from "tsrpc";
import { RoomStatus } from "../shared/global/data";
import { User } from "./User";
import { webSocketServer } from "..";

class Hall {

    rooms: Map<string, Room> = new Map();

    /**
     * 创建新房间
     * @param roomId 房间ID，如果未提供则使用当前时间戳作为ID
     * @param user 创建房间的用户对象
     * @returns 返回新创建的房间对象
     */
    createRoom(roomId: string, user: User) {
        let room = new Room(roomId || Date.now().toString());
        room.addUser(user);
        this.rooms.set(room.roomId, room);
        return room;
    }

    /**
     * 加入房间
     * @param roomId 房间ID
     * @param user 用户对象
     * @returns 加入的房间对象
     */
    joinRoom(roomId: string, user: User) {
        let room = this.rooms.get(roomId);
        if (!room) {
            return;
        }

        // 已在房间内
        if (room.hasUser(user.userId)) {
            webSocketServer.broadcastMsg("RoomUpdate", { roomInfo: room.getRoomData() }, hall.getUserToConn(room.users));
            return room;
        }
        // 房间存在且人员未满
        if (room.roomStatus == RoomStatus.GAME_WAIT) {
            // 加入房间
            room.addUser(user);
            return room;
        }
        return;
    }

    /**
     * 删除房间
     * @param roomId 房间ID
     */
    deleteRoom(roomId: string) {
        let room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        // 清空所有玩家
        room.clearUser();
        // 删除房间
        this.rooms.delete(roomId);
    }

    /**
     * 根据连接Id获取玩家所在房间
     * @param connId 连接ID
     * @returns 包含房间和用户对象的对象
     */
    userRoomByConnId(connId: string) {
        for (const room of this.rooms.values()) {
            let user = room.hasUserByConnId(connId);
            if (user) {
                return { room, user };
            }
        }
    }

    /**
     * 根据连接ID退出玩家所在的房间。
     * @param connId 连接ID
     */
    userQuitRoomByConnId(connId: string) {
        let info = this.userRoomByConnId(connId);
        if (info) {
            info.room.delUser(info.user.userId);
            if (Object.values(info.room.users).length == 0) {
                this.deleteRoom(info.room.roomId);
            }
        }
    }

    /**
     * 根据用户的ID获取玩家所在的房间。
     * @param userId 用户的ID
     * @returns 如果找到，返回房间对象；否则返回undefined。
     */
    userExistRoomByUserToken(userId: string) {
        for (const room of this.rooms.values()) {
            if (room.hasUser(userId)) {
                return room;
            }
        }
        return;
    }

    /**
     * 获取所有处于等待状态的房间。
     * @returns 返回一个包含所有等待中房间的数组。
     */
    getWaitingRooms() {
        let rooms: Room[] = [];
        for (const room of this.rooms.values()) {
            if (room.roomStatus == RoomStatus.GAME_WAIT) {
                rooms.push(room);
            }
        }
        return rooms;
    }

    /**
     * 获取用户的连接对象。
     * @param users 用户的Map集合
     * @returns 返回一个包含所有用户连接的数组。
     */
    getUserToConn(users: { [key: string]: User; }) {
        let conns: WsConnection[] = [];
        for (const user of Object.values(users)) {
            for (const conn of webSocketServer.connections.values()) {
                if (conn.id == user.conn?.id) {
                    conns.push(conn);
                    break;
                }
            }
        }
        return conns;
    }
}

export var hall = new Hall();
