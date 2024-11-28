import { WsClient } from "tsrpc-browser";
import { ReqLogin, ResLogin } from "./shared/protocols/PtlLogin";
import { ServiceType } from "./shared/protocols/serviceProto";

/**
 * 登录请求
 */
export function ApiLoginReq(client: WsClient<ServiceType>) {
    let req: ReqLogin = {
        userInfo: {
            ConnId: "",
            Token: "",
            UserName: "", 
            OtherData: ""
        }
    };
    let now = Date.now();
    if (!req.userInfo.Token) {
        req.userInfo.Token = "" + now;
    }
    if (!req.userInfo.UserName) {
        req.userInfo.UserName = '玩家_' + now.toString().slice(10);
    }

    client.callApi('Login', req).then(res => {
        if (!res.isSucc) {
            return;
        }
        console.log(res);
    });
}
