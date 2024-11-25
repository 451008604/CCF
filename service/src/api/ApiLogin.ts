import { ApiCall } from "tsrpc";
import { hall } from "../models/Hall";
import { ReqLogin, ResLogin } from "../shared/protocols/PtlLogin";
import { server } from "..";

export default async function (call: ApiCall<ReqLogin, ResLogin>) {
    let info = hall.userRoomByConnId(call.conn.id);
    if (info) {
        // 已在房间内时，直接返回房间信息
        let roomData = info.room.getRoomData();
        server.broadcastMsg("RoomUpdate", { roomInfo: roomData }, hall.getUserToConn(roomData.Users));
        return;
    }

    let bookID = 0;
    if (call.req.userInfo.OtherData != "") {
        bookID = JSON.parse(call.req.userInfo.OtherData)?.["bookID"];
    }
    let roomId = hall.getWaitingRoom(bookID ? bookID : 0);
    if (roomId == "") {
        // 没有等待加入的房间时新创建一个房间
        roomId = new Date().getTime().toString();
    }
    hall.joinRoom(roomId, call.req.userInfo, call.conn.id);
}
