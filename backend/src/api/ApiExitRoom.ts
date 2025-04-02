import { ApiCall } from "tsrpc";
import { ReqExitRoom, ResExitRoom } from "../shared/protocols/PtlExitRoom";
import { hall } from "../models/Hall";

export default async function (call: ApiCall<ReqExitRoom, ResExitRoom>) {
    hall.userQuitRoomByConnId(call.conn.id);
    call.succ({});
}