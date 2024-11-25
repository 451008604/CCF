import { _decorator, Button, Node } from 'cc';
import { FrameEnumScene } from '../../Core/Scripts/FrameEnum';
import { ComponentBase } from '../../Core/Scripts/Components/ComponentBase';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends ComponentBase {

    btn: Node = null;

    start() {
        this.node.getChildByName('Button').on(Button.EventType.CLICK, this.onClickButton, this);
        this.node.getChildByName('PopupBtn').on(Button.EventType.CLICK, this.onClickPopupBtn, this);
    }

    private onClickButton() {
        app.ui.switchScene(FrameEnumScene.MainBundle);
    }

    private onClickPopupBtn() {
        app.ui.openPopup("MainBundle/PopupDemo1");
        app.ui.openPopup("MainBundle/PopupDemo1");
        app.ui.openPopup("MainBundle/PopupDemo1");
        app.ui.openPopup("MainBundle/PopupDemo1");

        app.log.info(app.ui);
    }

    update(deltaTime: number) {

    }
}
