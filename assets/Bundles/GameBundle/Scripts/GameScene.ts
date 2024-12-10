import { _decorator, Button, instantiate, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { ComponentBase } from '../../../Core/Scripts/Components/ComponentBase';
import { ResPaths } from '../../ResPaths';
import { Res } from '../../../Core/Scripts/Utils/Res';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends ComponentBase {

    btn: Node = null;

    start() {
        this.node.getChildByName('Button').on(Button.EventType.CLICK, this.onClickButton, this);
        this.node.getChildByName('PopupBtn').on(Button.EventType.CLICK, this.onClickPopupBtn, this);

        Res.GetPrefab(ResPaths.GameBundle.ChessBoardPrefab).then((prefab) => {
            this.node.addChild(prefab);
        });
        app.bundle.getBundle('GameBundle').then((bundle) => {
            console.log(bundle);
        });

        Res.GetSpriteFrame("GameBundle/Res/Chess/chessboard/spriteFrame").then((spriteFrame) => {
            spriteFrame.setPosition(100, 100);
            this.node.addChild(spriteFrame);
        });

        app.res.loadRes("GameBundle/Res/Chess/chessboard/texture").then((res) => {
            console.log(res);
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
