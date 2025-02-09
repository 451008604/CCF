import { ApiCall } from "tsrpc";
import { ReqUserSelect, ResUserSelect } from "../shared/protocols/PtlUserSelect";
import { hall } from "../models/Hall";
import { RoomStatus } from "../shared/global/data";
import { webSocketServer } from "..";

export default async function (call: ApiCall<ReqUserSelect, ResUserSelect>) {
    const info = hall.userRoomByConnId(call.conn.id);
    if (!info) {
        call.error("房间不存在");
        return;
    }
    if (info.room.roomStatus != RoomStatus.GAME_START) {
        call.error("房间状态错误");
        return;
    }

    if (info.user.userId != info.room.currentUserId) {
        call.error("未轮到你的回合");
        return;
    }

    info.user.selectIdx = call.req.idx;
    if (call.req.idx == info.room.resultReward) {
        // 选择正确
        info.room.round++;
        for (const user of Object.values(info.room.users)) {
            user.selectIdx = -1;
        }

        // 下家先手
        for (const user of Object.values(info.room.users)) {
            if (user.pos >= info.room.round) {
                info.room.currentUserId = user.userId;
                break;
            }
        }

        // 计算分数
        info.user.changeScore += 10;
    } else {
        // 选择错误
        info.room.currentUserId = info.room.nextUserId();
        info.user.changeScore -= 10;

        if (info.room.users[info.room.currentUserId].selectIdx != -1) {
            // 在场的所有玩家本轮已进行过选择
            info.room.round++;
            for (const user of Object.values(info.room.users)) {
                user.selectIdx = -1;
            }

            // 下家先手
            for (const user of Object.values(info.room.users)) {
                if (user.pos >= info.room.round) {
                    info.room.currentUserId = user.userId;
                    break;
                }
            }
        }
    }

    // 超过最大轮次时结束游戏
    if (info.room.round >= Object.values(info.room.users).length) {
        info.room.round = Object.values(info.room.users).length - 1;
        info.room.roomStatus = RoomStatus.GAME_END;
    }

    // 广播房间数据
    webSocketServer.broadcastMsg("RoomUpdate", { roomInfo: info.room.getRoomData() }, hall.getUserToConn(info.room.users));

    if (info.room.roomStatus == RoomStatus.GAME_END) {
        info.room.roomStatus = RoomStatus.GAME_DISMISS;
        info.room.clearUser();
    }
    call.succ({});
}
