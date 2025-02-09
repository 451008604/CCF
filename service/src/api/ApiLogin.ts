import { ApiCall } from "tsrpc";
import { ReqLogin, ResLogin } from "../shared/protocols/PtlLogin";
import { redis } from "../database/redis";
import { UserModel } from "../shared/global/data";
import { User } from "../models/User";

export default async function (call: ApiCall<ReqLogin, ResLogin>) {
    // 查询玩家数据
    const client = await redis.client();
    const redisData = await client.get(call.req.userId);
    const playerData = (redisData ? JSON.parse(redisData) : new User()) as UserModel;
    call.succ({ userInfo: playerData });
}
