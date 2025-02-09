import { WsClient } from "tsrpc-browser";
import { ServiceType } from "./shared/protocols/serviceProto";
import { sys } from "cc";
import { FrameEnumEventMsgID } from "../Core/Scripts/FrameEnum";
import { DataManager } from "../Model/DataManager";

/**
 * 登录请求
 */
export async function ApiLoginReq(client: WsClient<ServiceType>) {
    // 获取登录openid
    const code = await app.miniSdk.getLoginCode();
    const resCode2Session = await client.callApi("Code2Session", { jsCode: code });
    if (!resCode2Session.isSucc) {
        !sys.isBrowser && app.ui.showTips("openid获取失败");
    } else {
        DataManager.selfModel.userId = resCode2Session.res.openid;
    }

    // 请求登录
    const resLogin = await client.callApi("Login", { userId: DataManager.selfModel.userId });
    if (resLogin.isSucc && resLogin.res.userInfo) {
        DataManager.selfModel = resLogin.res.userInfo;
    }

    if (!DataManager.selfModel.token) {
        const timestamp = Date.now().toString();
        DataManager.selfModel.token = timestamp;
        DataManager.selfModel.userId = timestamp.substring(timestamp.length - 5);
        DataManager.selfModel.userName = "玩家" + DataManager.selfModel.userId;
    }
    // 发送登录成功通知
    app.event.send(FrameEnumEventMsgID.UserDataChange);
    app.log.info("玩家当前数据", DataManager.selfModel);
}
