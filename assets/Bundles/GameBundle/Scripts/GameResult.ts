import { _decorator, Component, Label, Node } from 'cc';
import { NodePaths } from 'db://assets/Core/NodePaths';
import { ResPaths } from 'db://assets/Core/ResPaths';
import { ComponentBase } from 'db://assets/Core/Scripts/Components/ComponentBase';
import { DataManager } from 'db://assets/Model/DataManager';
import { UserModel } from 'db://assets/NetWork/shared/global/data';
const { ccclass, property } = _decorator;

@ccclass('GameResult')
export class GameResult extends ComponentBase {

    isWinner = false;

    protected onLoadAfter(): void {
        const users = Object.values(DataManager.roomModel.users);
        const myself: UserModel = DataManager.roomModel.users[DataManager.selfModel.userId];
        users.sort((a, b) => b.changeScore - a.changeScore);

        this.isWinner = myself.changeScore > 0;
        if (this.isWinner) {
            this.node.getChildByPath(NodePaths.GameResultPrefab.win).active = true;
            this.node.getChildByPath(NodePaths.GameResultPrefab.win_胜利框1).active = true;
            this.node.getChildByPath(NodePaths.GameResultPrefab.win_胜利框2_结算排名).active = false;
        } else {
            this.node.getChildByPath(NodePaths.GameResultPrefab.lose).active = true;
            this.node.getChildByPath(NodePaths.GameResultPrefab.lose_失败框1).active = true;
            this.node.getChildByPath(NodePaths.GameResultPrefab.lose_失败框2_结算排名).active = false;
        }

        this.node.getChildByPath(NodePaths.GameResultPrefab.lose_失败框1_确定).on(Node.EventType.TOUCH_END, this.nextStep, this);
        this.node.getChildByPath(NodePaths.GameResultPrefab.win_胜利框1_确定).on(Node.EventType.TOUCH_END, this.nextStep, this);
        this.node.getChildByPath(NodePaths.GameResultPrefab.lose_失败框2_结算排名_确定).on(Node.EventType.TOUCH_END, this.backHome, this);
        this.node.getChildByPath(NodePaths.GameResultPrefab.win_胜利框2_结算排名_确定).on(Node.EventType.TOUCH_END, this.backHome, this);

        this.node.getChildByPath(NodePaths.GameResultPrefab.lose_失败框1_Label).getComponent(Label).string = `积分 ${myself.changeScore} 分`;
        this.node.getChildByPath(NodePaths.GameResultPrefab.win_胜利框1_Label).getComponent(Label).string = `积分 ${myself.changeScore} 分`;

        for (const i in users) {
            this.node.getChildByPath(NodePaths.GameResultPrefab[`lose_失败框2_结算排名_rank${Number(i) + 1}`]).active = true;
            this.node.getChildByPath(NodePaths.GameResultPrefab[`lose_失败框2_结算排名_rank${Number(i) + 1}_Label`]).getComponent(Label).string = users[i].userName;
            this.node.getChildByPath(NodePaths.GameResultPrefab[`lose_失败框2_结算排名_rank${Number(i) + 1}_Label001`]).getComponent(Label).string = "" + users[i].changeScore;

            this.node.getChildByPath(NodePaths.GameResultPrefab[`win_胜利框2_结算排名_rank${Number(i) + 1}`]).active = true;
            this.node.getChildByPath(NodePaths.GameResultPrefab[`win_胜利框2_结算排名_rank${Number(i) + 1}_Label`]).getComponent(Label).string = users[i].userName;
            this.node.getChildByPath(NodePaths.GameResultPrefab[`win_胜利框2_结算排名_rank${Number(i) + 1}_Label001`]).getComponent(Label).string = "" + users[i].changeScore;
        }
    }

    nextStep() {
        this.node.getChildByPath(NodePaths.GameResultPrefab.win_胜利框1).active = false;
        this.node.getChildByPath(NodePaths.GameResultPrefab.lose_失败框1).active = false;

        if (this.isWinner) {
            this.node.getChildByPath(NodePaths.GameResultPrefab.win_胜利框2_结算排名).active = true;
        } else {
            this.node.getChildByPath(NodePaths.GameResultPrefab.lose_失败框2_结算排名).active = true;
        }
    }

    backHome() {
        app.ui.switchScene(ResPaths.MainBundle.MainScenePrefab);
    }

    update(deltaTime: number) {

    }
}
