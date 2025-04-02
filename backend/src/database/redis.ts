import { RedisClientType } from "@redis/client";
import { createClient } from "redis";

class Redis {

    private _client: RedisClientType | undefined = undefined;

    constructor() {
    }

    public async client() {
        if (this._client) {
            return this._client;
        }
        // 重置redis客户端连接
        this._client = createClient({
            url: "redis://127.0.0.1:6379",
            password: "123456"
        });
        await this._client.connect();
        this._client.once('error', (err) => {
            console.error(err);
            this._client = undefined;
        });
        return this._client;
    }
}

/**redis客户端 */
export const redis = new Redis();
