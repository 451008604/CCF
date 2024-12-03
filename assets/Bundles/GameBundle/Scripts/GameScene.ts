import { _decorator, Button, Node } from 'cc';
import { ComponentBase } from '../../../Core/Scripts/Components/ComponentBase';
import { ResPaths } from '../../ResPaths';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends ComponentBase {

    btn: Node = null;

    start() {
        this.node.getChildByName('Button').on(Button.EventType.CLICK, this.onClickButton, this);
        this.node.getChildByName('PopupBtn').on(Button.EventType.CLICK, this.onClickPopupBtn, this);
    }

    private onClickButton() {
        app.ui.switchScene(ResPaths.MainBundle.MainScenePrefab);
    }

    private onClickPopupBtn() {
        app.ui.openPopup(ResPaths.MainBundle.PopupDemo1Prefab);
    }

    update(deltaTime: number) {

    }
}
