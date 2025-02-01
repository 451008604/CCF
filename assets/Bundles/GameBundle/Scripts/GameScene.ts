import { _decorator, Button, Node } from 'cc';
import { ComponentBase } from '../../../Core/Scripts/Components/ComponentBase';
import { ResPaths } from 'db://assets/Core/ResPaths';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends ComponentBase {

    btn: Node = null;

    async start() {
        this.node.getChildByName('Button').on(Button.EventType.CLICK, this.onClickButton, this);
        this.node.getChildByName('PopupBtn').on(Button.EventType.CLICK, this.onClickPopupBtn, this);

        app.ui.showTips('Hello World!');
    }

    private onClickButton() {
        app.ui.switchScene(ResPaths.MainBundle.MainScenePrefab);
    }

    private onClickPopupBtn() {
    }

    update(deltaTime: number) {

    }
}
