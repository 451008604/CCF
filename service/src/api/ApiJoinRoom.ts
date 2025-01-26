import { ApiCall, WsConnection } from "tsrpc";
import { ReqJoinRoom, ResJoinRoom } from "../shared/protocols/PtlJoinRoom";
import { hall } from "../models/Hall";
import { User } from "../models/User";

export default async function (call: ApiCall<ReqJoinRoom, ResJoinRoom>) {
    const user: User = { ...call.req.userInfo, conn: call.conn as WsConnection };
    if (!hall.joinRoom(call.req.roomId, user)) {
        hall.createRoom(user);
    }
    call.succ({});
}