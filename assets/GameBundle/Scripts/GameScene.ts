import { _decorator, Button, Component, Node } from 'cc';
import { FrameEnumEventMsgID, FrameEnumScene } from '../../Core/Scripts/FrameEnum';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends Component {

    btn: Node = null;

    start() {
        this.btn = this.node.getChildByName('Button');
        this.btn.on(Button.EventType.CLICK, this.onClick, this);
    }

    private onClick() {
        app.event.send(FrameEnumEventMsgID.SwitchScenePrefab, FrameEnumScene.MainBundle);
    }

    update(deltaTime: number) {

    }
}
