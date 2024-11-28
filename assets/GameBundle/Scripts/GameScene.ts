import { _decorator, Button, log, Node } from 'cc';
import { FrameEnumEventMsgID, FrameEnumScene } from '../../Core/Scripts/FrameEnum';
import { ComponentBase } from '../../Core/Scripts/Components/ComponentBase';
import { ServiceType } from '../../NetWork/shared/protocols/serviceProto';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends ComponentBase {

    btn: Node = null;

    start() {
        this.node.getChildByName('Button').on(Button.EventType.CLICK, this.onClickButton, this);
        this.node.getChildByName('PopupBtn').on(Button.EventType.CLICK, this.onClickPopupBtn, this);

        app.network.client();

        this.addListen(FrameEnumEventMsgID.NetWorkNotify, this.netWorkHandler);
    }

    netWorkHandler(a: keyof ServiceType['msg'], b: ServiceType['msg']) {
        console.log(a, b);
    }

    private onClickButton() {
        app.ui.switchScene(FrameEnumScene.MainBundle);
    }

    private onClickPopupBtn() {
        app.ui.openPopup("MainBundle/PopupDemo1");

        app.log.info(app.ui);
    }

    update(deltaTime: number) {

    }
}
