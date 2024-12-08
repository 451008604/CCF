import { _decorator, Button, instantiate, Node, Prefab } from 'cc';
import { ComponentBase } from '../../../Core/Scripts/Components/ComponentBase';
import { ResPaths } from '../../ResPaths';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends ComponentBase {

    btn: Node = null;

    start() {
        this.node.getChildByName('Button').on(Button.EventType.CLICK, this.onClickButton, this);
        this.node.getChildByName('PopupBtn').on(Button.EventType.CLICK, this.onClickPopupBtn, this);


        app.res.loadRes<Prefab>(ResPaths.GameBundle.ChessBoardPrefab).then((prefab) => {
            let chessBoard = instantiate(prefab);
            this.node.addChild(chessBoard);
        });
    }

    private onClickButton() {
        app.ui.switchScene(ResPaths.MainBundle.MainScenePrefab);
    }

    private onClickPopupBtn() {
        app.ui.openPopup(ResPaths.MainBundle.PopupDemo1Prefab);
    }

    update(deltaTime: number) {

    }
}
