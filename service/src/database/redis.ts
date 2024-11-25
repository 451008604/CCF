import { RedisClientType } from "@redis/client";
import { createClient } from "redis";

class RedisClient {

    private _client: RedisClientType | undefined = undefined;

    constructor() {
    }

    public get client() {
        if (this._client) {
            return this._client;
        }
        // 重置redis客户端连接
        this._client = createClient({
            url: "redis://localhost:6380"
        });
        this._client.connect().catch(console.error);
        this._client.once('error', (err) => {
            console.error(err);
            this._client = undefined;
        });
        return this._client;
    }
}

/**redis客户端 */
export const redisClient = new RedisClient();
