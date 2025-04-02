import { __private, _decorator } from 'cc';
import { ComponentBase } from '../../../Core/Scripts/Components/ComponentBase';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends ComponentBase {

    protected onLoadAfter(): void {
        // app.ui.setBackground(ResPaths.MainBundle.BgPng);
    }

    start() {

    }

    update(deltaTime: number) {

    }
}
