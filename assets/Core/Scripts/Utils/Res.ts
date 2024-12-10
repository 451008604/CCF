import { instantiate, JsonAsset, Node, Prefab, Sprite, SpriteFrame, TextAsset } from "cc";

export class Res {

    /**
     * 异步加载并实例化一个预制体资源。
     * @param resPtah - 预制体资源的路径。
     * @returns 返回实例化后的预制体对象。
     */
    static async GetPrefab(resPtah: string) {
        let res = await app.res.loadRes<Prefab>(resPtah);
        return instantiate(res);
    }

    /**
     * 异步加载指定路径的精灵帧，并创建一个包含该精灵帧的新节点。
     * @param resPtah - 精灵帧资源的路径。
     * @returns 返回一个包含指定精灵帧的新节点。
     */
    static async GetSpriteFrame(resPtah: string) {
        const res = await app.res.loadRes<SpriteFrame>(resPtah);
        const node = new Node();
        node.addComponent(Sprite).spriteFrame = res;
        return node;
    }

    /**
     * 异步加载一个JSON文件。
     * @param resPath - JSON文件的路径。
     * @returns 返回解析后的JSON对象。
     */
    static async GetJson(resPath: string) {
        const json = await app.res.loadRes<JsonAsset>(resPath);
        return json.json;
    }

    /**
     * 异步加载指定路径下的文本资源。
     * @param resPath - 文本资源的路径。
     * @returns 返回加载的文本资源内容。
     */
    static async GetText(resPath: string) {
        const text = await app.res.loadRes<TextAsset>(resPath);
        return text.text;
    }
    
}
