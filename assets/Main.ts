import { _decorator } from 'cc';
import { ComponentBase } from './Core/Scripts/Components/ComponentBase';
import { ApiLoginReq } from './NetWork/Login';
import { ResPaths } from './Bundles/ResPaths';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends ComponentBase {

    async start() {
        app.log.info("启动游戏！！！");

        app.ui.init(this.node);
        // 展示主场景
        app.ui.switchScene(ResPaths.GameBundle.GameScenePrefab);

        app.network.onConnected(ApiLoginReq);
    }
}
