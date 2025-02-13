import { __private, _decorator, Label, Node } from 'cc';
import { ComponentBase } from '../../../Core/Scripts/Components/ComponentBase';
import { ResPaths } from 'db://assets/Core/ResPaths';
import { NodePaths } from 'db://assets/Core/NodePaths';
import { DataManager } from 'db://assets/Model/DataManager';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends ComponentBase {

    protected onLoadAfter(): void {
        app.ui.setBackground(ResPaths.MainBundle.BgPng);

        this.node.getChildByPath(NodePaths.MainScenePrefab.开始有些).on(Node.EventType.TOUCH_END, this.startHall, this);
    }

    async startHall() {
        app.ui.switchScene(ResPaths.MainBundle.HallScenePrefab);
    }

    start() {
        this.node.getChildByPath(NodePaths.MainScenePrefab.头像框_Label).getComponent(Label).string = DataManager.selfModel.userName;
        this.node.getChildByPath(NodePaths.MainScenePrefab.头像框_Label001).getComponent(Label).string = "ID:" + DataManager.selfModel.userId;
        this.node.getChildByPath(NodePaths.MainScenePrefab.公告文字栏_Label).getComponent(Label).string = "暂无公告";
    }

    update(deltaTime: number) {

    }
}
