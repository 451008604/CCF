import { WsClient } from 'tsrpc-browser';
import { ServiceType, serviceProto } from '../../../NetWork/shared/protocols/serviceProto';
import { FrameEnumEventMsgID } from '../FrameEnum';
import { ApiLoginReq } from 'db://assets/NetWork/Login';

/**
 * 网络管理器
 */
export class NetWorkMgr {
    private constructor() { }
    static readonly instance: NetWorkMgr = new NetWorkMgr();

    private _client: WsClient<ServiceType>;
    private _serverConfig = { address: "124.220.169.246", wsProto: "ws", wsPort: "3010", httpProto: "http", httpPort: "3011" };
    // private _serverConfig = { address: "127.0.0.1", wsProto: "ws", wsPort: "3010", httpProto: "http", httpPort: "3011" };

    /**
     * 获取 WebSocket 服务器地址
     * @returns WebSocket 服务器地址
     */
    get serverWsAddress() {
        return this._serverConfig.wsProto + "://" + this._serverConfig.address + ":" + this._serverConfig.wsPort;
    }

    /**
     * 获取 HTTP 服务器地址
     * @returns HTTP 服务器地址
     */
    get serverHttpAddress() {
        return this._serverConfig.httpProto + "://" + this._serverConfig.address + ":" + this._serverConfig.httpPort;
    }

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
            server: this.serverWsAddress,
            json: true,
            heartbeat: { interval: 5000, timeout: 5000 }
        });
        var res = await this._client.connect();
        res.isSucc ? app.log.info("服务连接成功") : app.log.err("服务连接失败", res.errMsg);
        if (!res.isSucc) return;

        // 发送请求拦截器
        this._client.flows.preCallApiFlow.push(res => {
            app.log.info("send      ->", res.apiName, res.req);
            return res;
        });

        // 返回响应拦截器
        this._client.flows.preApiReturnFlow.push(res => {
            if (!res.return.isSucc && res.return.err.code != "TIMEOUT" && res.return.err.code != "LOST_CONN") {
                app.log.err("请求错误", res);
            } else {
                app.log.info("receive   ->", res.apiName, res.return);
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
                this._client.listenMsg(RegExp(value.name), res => { app.log.info(value.name + "       ->", res); app.event.send(FrameEnumEventMsgID.NetWorkNotify, value.name, res); });
            }
        });

        // 自动重新登录
        await ApiLoginReq(this._client);
        return this._client;
    }

    /**
     * 发送HTTP请求
     * @param _url 请求的URL
     * @param _data 请求的数据
     * @param _method 请求的方法，默认为"POST"
     * @returns 返回一个Promise对象，成功时解析为响应数据，失败时拒绝并返回错误
     */
    request(_url: string, _data?: {}, _method: string = "POST") {
        return new Promise<any>((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(_method, _url, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4) {
                    return;
                }
                if (xhr.status == 200) {
                    // 请求成功
                    resolve(xhr.response);
                } else {
                    // 请求失败
                    reject();
                }
            };
            // 构造请求体
            let requestBody = JSON.stringify(_data);
            // 发送请求
            xhr.send(requestBody);
        });
    }
}
