import * as path from "path";
import { HttpConnection, HttpServer, WsServer } from "tsrpc";
import { serviceProto } from './shared/protocols/serviceProto';
import { hall } from "./models/Hall";
import { readFileSync } from "fs";
import { access, readFile } from "fs/promises";

// ssl 配置文件
let ssl = undefined;
try {
    ssl = {
        key: readFileSync("./ssl/server.key"),
        cert: readFileSync("./ssl/server.crt")
    };
} catch (e) { }

// Create the Server
export const webSocketServer = new WsServer(serviceProto, {
    port: 3010,
    // Remove this to use binary mode (remove from the client too)
    json: true,
    heartbeatWaitTime: 15000,
    wss: ssl,
    logConnect: true
});

webSocketServer.flows.postDisconnectFlow.push(v => {
    hall.userQuitRoomByConnId(v.conn.id);
    return v;
});


setInterval(() => {
    const now = Math.floor(Date.now() / 1000);
    for (const room of hall.rooms.values()) {
        if (Object.values(room.users).length == 0) {
            hall.deleteRoom(room.roomId);
            continue;
        }
    }
}, 1000);

// Initialize before webSocketServer start
async function init() {
    await webSocketServer.autoImplementApi(path.resolve(__dirname, 'api'));
    await httpServer.autoImplementApi(path.resolve(__dirname, 'api'));

    // TODO
    // Prepare something... (e.g. connect the db)
};

// Entry function
async function main() {
    await init();
    await webSocketServer.start();
    await httpServer.start();
}
main();

const httpServer = new HttpServer(serviceProto, { port: 3011, https: ssl });
httpServer.flows.preRecvDataFlow.push(async v => {
    let conn = v.conn as HttpConnection;
    if (conn.httpReq.method === 'GET') {
        // 静态文件服务
        if (conn.httpReq.url) {
            // 检测文件是否存在
            let resFilePath = path.join('./res', conn.httpReq.url);
            console.log(resFilePath);
            let isExisted = await access(resFilePath).then(() => true).catch(() => false);
            if (isExisted) {
                // 返回文件内容
                let content = await readFile(resFilePath);
                conn.httpRes.end(content);
                return undefined;
            }
            conn.httpRes.end("resource path error");
            return undefined;
        }

        // 默认 GET 响应
        conn.httpRes.end("Hello World");
        return undefined;
    }
    return v;
});