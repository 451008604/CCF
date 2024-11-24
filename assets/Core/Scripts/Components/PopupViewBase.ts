import { _decorator, Input } from 'cc';
import { ComponentBase } from './ComponentBase';
const { ccclass, property } = _decorator;

/**
 * 弹出层视图基类
 */
@ccclass('PopupViewBase')
export class PopupViewBase extends ComponentBase {

    start() {
        this.node.getChildByName("Background").on(Input.EventType.TOUCH_END, (event) => {
            console.log(event, 111);
        }, this);
    }

    update(deltaTime: number) {

    }
}

