import { __private, _decorator, Button, Component, Node, NodeEventType } from 'cc';
import { FrameEnumEventMsgID, FrameEnumScene } from '../../Core/Scripts/FrameEnum';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends Component {

    btn: Node = null;

    lang: string = "";

    start() {
        this.lang = app.data.getText("language");
        this.btn = this.node.getChildByName('Button');
        if (this.btn) {
            this.btn.on(Button.EventType.CLICK, this.onButtonClick, this);
        }
    }

    onButtonClick() {
        if (this.lang == 'zh') {
            this.lang = 'en';
        } else {
            this.lang = 'zh';
        }

        app.language.changeLang(this.lang);
        app.ui.switchScene(FrameEnumScene.GameBundle);
    }

    update(deltaTime: number) {

    }
}
