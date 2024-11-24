import { _decorator, Button, Component, Node } from 'cc';
import { FrameEnumEventMsgID, FrameEnumScene } from '../../Core/Scripts/FrameEnum';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends Component {

    btn: Node = null;

    start() {
        this.node.getChildByName('Button').on(Button.EventType.CLICK, this.onClickButton, this);
        this.node.getChildByName('PopupBtn').on(Button.EventType.CLICK, this.onClickPopupBtn, this);
    }

    private onClickButton() {
        app.ui.switchScene(FrameEnumScene.MainBundle);
    }

    private onClickPopupBtn() {
        app.ui.showPopup("MainBundle/PopupDemo1");
    }

    update(deltaTime: number) {

    }
}
