import { WsClient } from 'tsrpc-browser';
import { MsgAttack } from './protocols/MsgAttack';
import { MsgRoomUpdate } from './protocols/MsgRoomUpdate';
import { ReqAttack, ResAttack } from './protocols/PtlAttack';
import { ReqLogin, ResLogin } from './protocols/PtlLogin';
import { ServiceType, serviceProto } from './protocols/serviceProto';

export class Service {

    private static _instance: Service;
    static get instance() {
        if (!this._instance) {
            this._instance = new Service();
        }
        return this._instance;
    }

    private _client: WsClient<ServiceType>;
    async client(): Promise<WsClient<ServiceType>> {
        if (this._client && this._client.isConnected) {
            return this._client;
        }

        // 未建立连接时，重新发送连接请求
        this._client = new WsClient(serviceProto, {
            server: "ws://127.0.0.1:3000",
            json: true,
            heartbeat: { interval: 5000, timeout: 5000 }
        });
        var res = await this._client.connect();
        if (res.isSucc) {
            console.log("连接成功");
        } else {
            console.log(res.errMsg);
        }

        // 响应错误拦截器
        this._client.flows.preApiReturnFlow.push(res => {
            if (!res.return.isSucc &&
                res.return.err.code != "TIMEOUT" &&
                res.return.err.code != "LOST_CONN") {
                console.log("请求错误", res.apiName, res.req, res.return.err);
            }
            return res;
        });
        // 连接断开拦截器
        this._client.flows.postDisconnectFlow.push(res => {
            console.log("连接断开");

            // 断开连接时取消监听所有消息通知
            this._client.unlistenMsgAll(/.*?/);
            return res;
        });

        // 监听推送消息
        this._client.listenMsg('Attack', res => { this.MsgHandlerOnAttack(res); });
        this._client.listenMsg('RoomUpdate', res => { this.MsgHandlerOnRoomUpdate(res); });
        return this._client;
    }

    // 攻击通知
    MsgHandlerOnAttack(res: MsgAttack) { console.log("MsgHandlerOnAttack", res); };
    // 房间信息更新通知
    MsgHandlerOnRoomUpdate(res: MsgRoomUpdate) { console.log("MsgHandlerOnRoomUpdate", res); };

    // 登录请求
    login(req: ReqLogin, callBack = (res: ResLogin) => { }) {
        let now = Date.now();
        if (!req.userInfo.Token) {
            req.userInfo.Token = "" + now;
        }
        if (!req.userInfo.UserName) {
            req.userInfo.UserName = '玩家_' + now.toString().slice(10);
        }

        this.logout();

        this.client().then((client) => {
            client.callApi('Login', req).then(res => {
                if (!res.isSucc) {
                    return;
                }
                callBack(res.res);
            });
        });
    }

    // 退出登录
    logout() {
        this._client?.disconnect();
    }

    // 攻击请求
    attact(req: ReqAttack, callBack = (res: ResAttack) => { }) {
        console.log("attact", req);
        this.client().then((client) => {
            client.callApi('Attack', req).then(res => {
                if (!res.isSucc) {
                    return;
                }
                callBack(res.res);
            });
        });
    }

}

