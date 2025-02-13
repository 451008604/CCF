import { WsClient } from "tsrpc-browser";
import { ServiceType } from "./shared/protocols/serviceProto";
import { sys } from "cc";
import { FrameEnumEventMsgID } from "../Core/Scripts/FrameEnum";
import { DataManager } from "../Model/DataManager";
import { Json } from "../Core/Scripts/Utils/Json";

/**
 * 登录请求
 */
export async function ApiLoginReq(client: WsClient<ServiceType>) {
    // 获取登录openid
    // const code = await app.miniSdk.getLoginCode();
    // const resCode2Session = await client.callApi("Code2Session", { jsCode: code });
    // if (!resCode2Session.isSucc) {
    //     !sys.isBrowser && app.ui.showTips("openid获取失败");
    // } else {
    //     DataManager.selfModel.userId = resCode2Session.res.openid;
    // }

    // 获取设备唯一标识
    const deviceId = app.storage.getText("deviceId") || sys.platform.toString() + Date.now().toString();
    app.storage.setData('deviceId', deviceId);

    const userInfo = Json.parse(await app.network.request(app.config.getServerAddress() + "/userLogin", { username: deviceId, pwd: deviceId }));
    if (!userInfo) {
        app.ui.showTips("登录失败");
        return;
    }

    if (userInfo["code"] != 1000) {
        // 登录失败时进行注册并重新登录
        await app.network.request(app.config.getServerAddress() + "/userRegister", { username: deviceId, pwd: deviceId, nickname: "玩家" + deviceId.substring(deviceId.length - 5) });
        return ApiLoginReq(client);
    }

    DataManager.selfModel.userId = "" + userInfo["data"]["id"];
    DataManager.selfModel.userName = userInfo["data"]["nickname"];
    DataManager.selfModel.headImg = userInfo["data"]["img"] || "";
    DataManager.selfModel.score = userInfo["data"]["score"];
    DataManager.selfModel.token = Date.now().toString();

    // 请求登录
    // const resLogin = await client.callApi("Login", { userId: DataManager.selfModel.userId });
    // if (resLogin.isSucc && resLogin.res.userInfo) {
    //     DataManager.selfModel = resLogin.res.userInfo;
    // }

    // 发送登录成功通知
    app.event.send(FrameEnumEventMsgID.UserDataChange);
    app.log.info("玩家当前数据", DataManager.selfModel);
}
