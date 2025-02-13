import { _decorator, Label, Node, Sprite, SpriteFrame, Tween, tween, Vec3 } from 'cc';
import { NodePaths } from 'db://assets/Core/NodePaths';
import { ComponentBase } from 'db://assets/Core/Scripts/Components/ComponentBase';
import { User } from './User';
import { DataManager } from 'db://assets/Model/DataManager';
import { RoomStatus, UserModel } from 'db://assets/NetWork/shared/global/data';
import { ServiceType } from 'db://assets/NetWork/shared/protocols/serviceProto';
import { ResPaths } from 'db://assets/Core/ResPaths';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends ComponentBase {

    桌面_User000: User;
    桌面_User001: User;
    桌面_User002: User;
    桌面_User003: User;
    桌面_User004: User;
    桌面_User005: User;
    桌面_User006: User;
    桌面_User007: User;
    桌面_角色1: Node;

    round: number = 0;

    protected onLoadAfter(): void {
        this.桌面_User000 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_User000).getComponent(User);
        this.桌面_User001 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_User001).getComponent(User);
        this.桌面_User002 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_User002).getComponent(User);
        this.桌面_User003 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_User003).getComponent(User);
        this.桌面_User004 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_User004).getComponent(User);
        this.桌面_User005 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_User005).getComponent(User);
        this.桌面_User006 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_User006).getComponent(User);
        this.桌面_User007 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_User007).getComponent(User);
        this.bindNodeClickHandler(NodePaths.GameScenePrefab.顶部栏_返回按钮, () => { app.ui.switchScene(ResPaths.MainBundle.HallTablePrefab); });
        this.桌面_角色1 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_角色1);
    }

    protected netWorkHandler(msgId: keyof ServiceType['msg'], msgBody: ServiceType['msg'][keyof ServiceType['msg']]): void {
        switch (msgId) {
            case "RoomUpdate":
                if (msgBody.roomInfo.roomStatus == RoomStatus.GAME_DISMISS) {
                    break;
                }

                DataManager.roomModel = msgBody.roomInfo;
                this.refershPos();
                break;
        }
    }

    refershPos() {
        if (this.round != DataManager.roomModel.round) {
            this.round = DataManager.roomModel.round;
            app.res.loadRes<SpriteFrame>(ResPaths.GameBundle[`角色${DataManager.roomModel.round}Png`]).then(res => {
                this.桌面_角色1.getComponent(Sprite).spriteFrame = res;
                tween(this.桌面_角色1).to(.3, { scale: new Vec3(1, 1) }).delay(1).to(.3, { scale: new Vec3(0, 0) }).start();
            });
        }
        this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_Label).getComponent(Label).string = `第 ${DataManager.roomModel.round + 1} 回合`;

        const myself: UserModel = DataManager.roomModel.users[DataManager.selfModel.userId];
        for (const user of Object.values(DataManager.roomModel.users)) {
            const t = (this["桌面_User00" + (user.pos - myself.pos + 8) % 8] as User);
            t.node.active = true;
            t.userInfo = user;

            t.轮到谁谁发光.active = user.userId == DataManager.roomModel.currentUserId;
        }

        // 游戏结束
        if (DataManager.roomModel.roomStatus == RoomStatus.GAME_END) {
            app.ui.openPanel(ResPaths.GameBundle.GameResultPrefab);
        }
    }

    async start() {
        this.桌面_User000.node.active = this.桌面_User001.node.active = this.桌面_User002.node.active = this.桌面_User003.node.active = this.桌面_User004.node.active = this.桌面_User005.node.active = this.桌面_User006.node.active = this.桌面_User007.node.active = false;

        this.桌面_User000.setHaedPos(0);
        this.桌面_User001.setHaedPos(1);
        this.桌面_User002.setHaedPos(1);
        this.桌面_User003.setHaedPos(1);
        this.桌面_User004.setHaedPos(0);
        this.桌面_User005.setHaedPos(0);
        this.桌面_User006.setHaedPos(0);
        this.桌面_User007.setHaedPos(0);

        this.getChild(NodePaths.GameScenePrefab.顶部栏_房间号框_Label).getComponent(Label).string = "房间号：" + DataManager.roomModel.roomId;

        this.refershPos();
    }

    update(deltaTime: number) {

    }
}
