import { WsClient } from 'tsrpc-browser';
import { ServiceType, serviceProto } from '../../../NetWork/shared/protocols/serviceProto';
import { FrameEnumEventMsgID } from '../FrameEnum';

/**
 * 网络管理器
 */
export class NetWorkMgr {
    private constructor() { }
    static readonly instance: NetWorkMgr = new NetWorkMgr();

    private _client: WsClient<ServiceType>;
    private _onConnected: (client: WsClient<ServiceType>) => void;
    /**
     * 获取 WebSocket Client 对象
     * @returns WebSocket Client 对象
     */
    async client(): Promise<WsClient<ServiceType>> {
        if (this._client && this._client.isConnected) {
            return this._client;
        }

        // 未建立连接时，重新发送连接请求
        this._client = new WsClient(serviceProto, {
            server: "ws://localhost:3000",
            json: true,
            heartbeat: { interval: 5000, timeout: 5000 }
        });
        var res = await this._client.connect();
        if (res.isSucc) {
            app.log.info("服务连接成功");
        } else {
            app.log.err("服务连接失败", res.errMsg);
        }

        // 响应错误拦截器
        this._client.flows.preApiReturnFlow.push(res => {
            if (!res.return.isSucc && res.return.err.code != "TIMEOUT" && res.return.err.code != "LOST_CONN") {
                app.log.err("请求错误", res);
            }
            return res;
        });
        // 连接断开拦截器
        this._client.flows.postDisconnectFlow.push(res => {
            app.log.err("服务连接断开", res);

            // 断开连接时取消监听所有消息通知
            this._client.unlistenMsgAll(/.*?/);
            return res;
        });

        // 对所有的服务器通知挂载监听
        serviceProto.services.forEach((value) => {
            if (value.type == 'msg') {
                this._client.listenMsg(RegExp(value.name), res => { app.event.send(FrameEnumEventMsgID.NetWorkNotify, value.name, res); });
            }
        });

        // 执行连接成功时的钩子函数
        this._onConnected(this._client);
        return this._client;
    }

    onConnected(callBack: (client: WsClient<ServiceType>) => void) {
        this._onConnected = callBack;
    }
}

