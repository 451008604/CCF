import { _decorator, Component, instantiate, Layers, Node, Prefab, Vec3 } from 'cc';
import { ComponentBase } from '../Core/Scripts/ComponentBase';
import { FrameEnumEventMsgID, FrameEnumScene } from '../Core/Scripts/FrameEnum';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends ComponentBase {

    async start() {
        app.log.info("进入主场景");

        this.addListen(FrameEnumEventMsgID.SwitchScenePrefab, this.switchScenePrefab);
        // 展示默认场景
        app.event.send(FrameEnumEventMsgID.SwitchScenePrefab, FrameEnumScene.GameBundle);
    }


    private lastShowScene: Node | null = null;
    private switchScenePrefab(sceneName: string) {
        app.res.loadRes(sceneName).then(scene => {
            if (scene instanceof Prefab) {
                // 移除上一个场景
                this.node.removeChild(this.lastShowScene);
                // 加载新的场景
                const sceneNode = instantiate(scene);
                this.node.addChild(sceneNode);
                this.lastShowScene = sceneNode;
            }
        });
    }
}
