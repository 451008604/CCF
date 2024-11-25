import { ApiCall } from "tsrpc";
import { ReqAttack, ResAttack } from "../shared/protocols/PtlAttack";
import { hall } from "../models/Hall";
import { DataManager } from "../shared/global/data";

export default async function (call: ApiCall<ReqAttack, ResAttack>) {
    let room = hall.userExistRoomByUserToken(call.req.selfToken);
    if (!room) {
        call.error("不在房间内");
        return;
    }

    var selfUser = { ...DataManager.selfModel };
    for (const user of room.getUsersList()) {
        if (user.Token == call.req.selfToken) {
            selfUser = user;
        }
    }

    room.broadcastAttack(selfUser);
}