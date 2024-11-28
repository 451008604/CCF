import { _decorator } from 'cc';
import { FrameEnumScene } from '../Core/Scripts/FrameEnum';
import { ComponentBase } from '../Core/Scripts/Components/ComponentBase';
import { ApiLoginReq } from '../NetWork/Login';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends ComponentBase {

    async start() {
        app.log.info("启动游戏！！！");

        app.ui.init(this.node);
        // 展示主场景
        app.ui.switchScene(FrameEnumScene.GameBundle);


        app.network.onConnected(ApiLoginReq);
    }
}
