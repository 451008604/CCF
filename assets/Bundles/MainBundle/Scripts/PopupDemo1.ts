import { _decorator, Input } from 'cc';
import { ComponentBase } from '../../../Core/Scripts/Components/ComponentBase';
const { ccclass, property } = _decorator;

@ccclass('PopupDemo1')
export class PopupDemo1 extends ComponentBase {

    start() {
        this.node.getChildByName("CloseBtn").once(Input.EventType.TOUCH_END, () => {
            app.ui.openPanel(this.node.uuid);
        }, this);
    }

    update(deltaTime: number) {

    }
}
