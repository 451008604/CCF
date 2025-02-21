import { _decorator } from 'cc';
import { ComponentBase } from './Core/Scripts/Components/ComponentBase';
import { ResPaths } from './Core/ResPaths';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends ComponentBase {

    protected onLoadAfter(): void {
        app.log.info("启动游戏！！！");
        app.ui.init(this.node);

        // 展示主场景
        app.ui.switchScene(ResPaths.MainBundle.MainScenePrefab);
    }

}
