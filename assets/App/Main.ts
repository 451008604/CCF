import { _decorator, Component, director, find, instantiate, Layers, Node, Prefab, Vec3 } from 'cc';
import { FrameEnumEventMsgID, FrameEnumScene } from '../Core/Scripts/FrameEnum';
import { ComponentBase } from '../Core/Scripts/Components/ComponentBase';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends ComponentBase {

    async start() {
        app.log.info("启动游戏！！！");

        app.ui.init(this.node);
        // 展示主场景
        app.ui.switchScene(FrameEnumScene.GameBundle);
    }
}
