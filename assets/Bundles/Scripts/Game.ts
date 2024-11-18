import { __private, _decorator, Button, Component, Node, NodeEventType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {

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
    }

    update(deltaTime: number) {

    }
}
