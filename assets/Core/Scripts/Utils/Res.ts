import { instantiate, Node, Prefab, Sprite, SpriteFrame } from "cc";

export class Res {

    static async GetPrefab(resPtah: string) {
        let res = await app.res.loadRes<Prefab>(resPtah);
        return instantiate(res);
    }

    static async GetSpriteFrame(resPtah: string) {
        const res = await app.res.loadRes<SpriteFrame>(resPtah);
        const node = new Node();
        node.addComponent(Sprite).spriteFrame = res;
        return node;
    }
}