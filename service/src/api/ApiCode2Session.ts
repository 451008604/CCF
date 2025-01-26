import { ApiCall } from "tsrpc";
import { ReqCode2Session, ResCode2Session } from "../shared/protocols/PtlCode2Session";
import { SysConfig } from "../models/Config";
import axios from "axios";

export default async function (call: ApiCall<ReqCode2Session, ResCode2Session>) {
    // 微信小游戏code2session
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${SysConfig.appId}&secret=${SysConfig.appSecret}&js_code=${call.req.jsCode}&grant_type=authorization_code`;
    const response = await axios.get(url);
    if (response.data.errcode) {
        call.error(response.data.errmsg);
    } else {
        call.succ({ openid: response.data.openid });
    }
}