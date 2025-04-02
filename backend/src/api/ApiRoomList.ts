import { ApiCall } from "tsrpc";
import { ReqRoomList, ResRoomList } from "../shared/protocols/PtlRoomList";
import { hall } from "../models/Hall";

export default async function (call: ApiCall<ReqRoomList, ResRoomList>) {
    let rooms = hall.getWaitingRooms();
    call.succ({ roomList: rooms });
}