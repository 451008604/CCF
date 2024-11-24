import { _decorator, Component, Input, Node } from 'cc';
import { PopupViewBase } from '../../Core/Scripts/Components/PopupViewBase';
const { ccclass, property } = _decorator;

@ccclass('PopupDemo1')
export class PopupDemo1 extends PopupViewBase {
    start() {
        this.node.on(Input.EventType.TOUCH_END, (event) => {
            console.log(event, 111);
        }, this);
    }

    update(deltaTime: number) {

    }
}

