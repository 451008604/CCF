import { _decorator, Component, EventTouch, input, Input, Node } from 'cc';
import { ComponentBase } from '../../Core/Scripts/Components/ComponentBase';
import { FrameEnumEventMsgID } from '../../Core/Scripts/FrameEnum';
const { ccclass, property } = _decorator;

@ccclass('PopupDemo1')
export class PopupDemo1 extends ComponentBase {

    start() {
        this.node.getChildByName("CloseBtn").once(Input.EventType.TOUCH_END, () => {
            app.ui.closePopup(this.node.uuid);
        }, this);
    }

    update(deltaTime: number) {

    }
}
