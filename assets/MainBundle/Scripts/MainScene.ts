import { __private, _decorator, Button, Node } from 'cc';
import { FrameEnumScene } from '../../Core/Scripts/FrameEnum';
import { ComponentBase } from '../../Core/Scripts/Components/ComponentBase';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends ComponentBase {

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
