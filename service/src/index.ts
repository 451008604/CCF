import * as path from "path";
import { WsServer } from "tsrpc";
import { serviceProto } from './shared/protocols/serviceProto';
import { hall } from "./models/Hall";
import { readFileSync } from "fs";

// Create the Server
export const server = new WsServer(serviceProto, {
    port: 3000,
    // Remove this to use binary mode (remove from the client too)
    json: true,
    heartbeatWaitTime: 15000,
    wss: {
        cert: readFileSync(""),
        key: readFileSync("")

    }
});

server.flows.postDisconnectFlow.push(v => {
    hall.userQuitRoomByConnId(v.conn.id);
    return v;
});

// Initialize before server start
async function init() {
    await server.autoImplementApi(path.resolve(__dirname, 'api'));

    // TODO
    // Prepare something... (e.g. connect the db)
};

// Entry function
async function main() {
    await init();
    await server.start();
}
main();
