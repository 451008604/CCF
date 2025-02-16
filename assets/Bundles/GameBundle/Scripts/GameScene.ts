import { _decorator, Color, Label, Node, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { NodePaths } from 'db://assets/Core/NodePaths';
import { ComponentBase } from 'db://assets/Core/Scripts/Components/ComponentBase';
import { User } from './User';
import { DataManager } from 'db://assets/Model/DataManager';
import { RoomModel, RoomStatus, UserModel } from 'db://assets/NetWork/shared/global/data';
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
    桌面_Label001: Node;

    protected onLoadAfter(): void {
        this.桌面_User000 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_User000).getComponent(User);
        this.桌面_User001 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_User001).getComponent(User);
        this.桌面_User002 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_User002).getComponent(User);
        this.桌面_User003 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_User003).getComponent(User);
        this.桌面_User004 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_User004).getComponent(User);
        this.桌面_User005 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_User005).getComponent(User);
        this.桌面_User006 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_User006).getComponent(User);
        this.桌面_User007 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_User007).getComponent(User);
        this.bindNodeClickHandler(NodePaths.GameScenePrefab.顶部栏_返回按钮, async () => {
            const client = await app.network.client();
            client.callApi("ExitRoom", {});
            app.ui.switchScene(ResPaths.MainBundle.HallTablePrefab);
        });
        this.桌面_角色1 = this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_角色1);
        this.桌面_Label001 = this.getChild(NodePaths.GameScenePrefab.桌面_Label001);
        this.桌面_角色1.setScale(new Vec3(0, 0, 0));
        this.桌面_Label001.active = false;
    }

    protected netWorkHandler(msgId: keyof ServiceType['msg'], msgBody: ServiceType['msg'][keyof ServiceType['msg']]): void {
        switch (msgId) {
            case "RoomUpdate":
                if (msgBody.roomInfo.roomStatus == RoomStatus.GAME_DISMISS) {
                    break;
                }

                this.refershPos(msgBody.roomInfo);
                break;
        }
    }

    refershPos(msgBody: RoomModel) {
        // 获取当前用户信息
        const curUser: UserModel = msgBody.users[msgBody.lastUserId];
        // 获取之前的分数
        const previousScore = DataManager.roomModel.users[msgBody.lastUserId].changeScore;
        // 计算分数差异
        const scoreDifference = curUser.changeScore - previousScore;

        // 如果分数有变化，更新显示
        if (scoreDifference !== 0) {
            this.桌面_Label001.active = true;
            this.桌面_Label001.getComponent(Label).string = `积分${scoreDifference > 0 ? '+' : ''}${scoreDifference}`;
            this.桌面_Label001.getComponent(Label).color = scoreDifference > 0 ? new Color(0, 255, 0) : new Color(255, 0, 0);
        } else {
            this.桌面_Label001.active = false;
        }

        // 如果分数差异大于0，加载对应角色的图片资源并执行动画
        if (scoreDifference > 0) {
            app.res.loadRes<SpriteFrame>(ResPaths.GameBundle[`角色${DataManager.roomModel.round + 1}Png`]).then(res => {
                // 设置角色的图片资源
                this.桌面_角色1.getComponent(Sprite).spriteFrame = res;
                // 执行角色出现和消失的缩放动画
                tween(this.桌面_角色1)
                    .to(.3, { scale: new Vec3(1, 1) })
                    .delay(1)
                    .to(.3, { scale: new Vec3(0, 0) })
                    .call(() => { this.桌面_Label001.active = false; })
                    .start();
            });
        } else {
            tween(this.桌面_Label001)
                .delay(1)
                .call(() => { this.桌面_Label001.active = false; })
                .start();
        }

        DataManager.roomModel = msgBody;
        // 更新当前回合数的显示
        this.node.getChildByPath(NodePaths.GameScenePrefab.桌面_Label).getComponent(Label).string = `第 ${DataManager.roomModel.round + 1} 回合`;

        // 获取当前用户信息
        const myself: UserModel = DataManager.roomModel.users[DataManager.selfModel.userId];
        // 遍历所有用户，更新用户信息和状态
        for (const user of Object.values(DataManager.roomModel.users)) {
            // 计算用户在桌面上的位置
            const t = (this["桌面_User00" + (user.pos - myself.pos + 8) % 8] as User);
            t.node.active = true; // 激活用户节点
            t.userInfo = user; // 更新用户信息

            // 如果是当前用户，激活发光效果
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

        this.refershPos(DataManager.roomModel);
    }
}
