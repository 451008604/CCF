import { _decorator, Button, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
import { NodePaths } from 'db://assets/Core/NodePaths';
import { ResPaths } from 'db://assets/Core/ResPaths';
import { ComponentBase } from 'db://assets/Core/Scripts/Components/ComponentBase';
import { DataManager } from 'db://assets/Model/DataManager';
import { UserModel } from 'db://assets/NetWork/shared/global/data';
const { ccclass, property } = _decorator;

@ccclass('User')
export class User extends ComponentBase {

    private _userInfo: UserModel;
    leftHead: Node;
    rightHead: Node;
    盲盒关: Node;
    盲盒关001: Node;
    轮到谁谁发光: Node;

    protected onLoadAfter(): void {
        this.轮到谁谁发光 = this.node.getChildByPath(NodePaths.UserPrefab.轮到谁谁发光);

        this.leftHead = this.node.getChildByPath(NodePaths.UserPrefab.亲友圈头像框);
        this.rightHead = this.node.getChildByPath(NodePaths.UserPrefab.亲友圈头像框001);

        this.盲盒关 = this.node.getChildByPath(NodePaths.UserPrefab.盲盒关);
        this.盲盒关001 = this.node.getChildByPath(NodePaths.UserPrefab.盲盒关001);
    }

    start() {
        this.盲盒关.on(Node.EventType.TOUCH_END, this.盲盒关Click, this);
        this.盲盒关001.on(Node.EventType.TOUCH_END, this.盲盒关001Click, this);
    }

    public get userInfo(): UserModel {
        return this._userInfo;
    }
    public set userInfo(value: UserModel) {
        this._userInfo = value;

        this.node.getChildByPath(NodePaths.UserPrefab.亲友圈头像框001_昵称ID框_Label001).getComponent(Label).string = "ID:" + value.userId;
        this.node.getChildByPath(NodePaths.UserPrefab.亲友圈头像框_昵称ID框_Label001).getComponent(Label).string = "ID:" + value.userId;
        this.node.getChildByPath(NodePaths.UserPrefab.亲友圈头像框001_昵称ID框_Label).getComponent(Label).string = value.userName;
        this.node.getChildByPath(NodePaths.UserPrefab.亲友圈头像框_昵称ID框_Label).getComponent(Label).string = value.userName;

        this.openBox(value.selectIdx);
    }

    async 盲盒关Click() {
        if (DataManager.selfModel.userId != this.userInfo.userId) {
            return;
        }
        const client = await app.network.client();
        app.ui.showTips((await client.callApi('UserSelect', { idx: 0 })).err?.message);
    }

    async 盲盒关001Click() {
        if (DataManager.selfModel.userId != this.userInfo.userId) {
            return;
        }
        const client = await app.network.client();
        app.ui.showTips((await client.callApi('UserSelect', { idx: 1 })).err?.message);
    }

    openBox(idx: number) {
        if (idx == 0) {
            // 箱子开启动画
            app.res.loadRes<SpriteFrame>(ResPaths.GameBundle.盲盒开Png).then(res => {
                this.盲盒关.getComponent(Sprite).spriteFrame = res;
            });
        } else if (idx == 1) {
            // 箱子开启动画
            app.res.loadRes<SpriteFrame>(ResPaths.GameBundle.盲盒开Png).then(res => {
                this.盲盒关001.getComponent(Sprite).spriteFrame = res;
            });
        } else {
            app.res.loadRes<SpriteFrame>(ResPaths.GameBundle.盲盒关Png).then(res => {
                this.盲盒关.getComponent(Sprite).spriteFrame = res;
            });
            app.res.loadRes<SpriteFrame>(ResPaths.GameBundle.盲盒关Png).then(res => {
                this.盲盒关001.getComponent(Sprite).spriteFrame = res;
            });
        }
    }

    update(deltaTime: number) {

    }

    setHaedPos(pos: number) {
        this.leftHead.active = this.rightHead.active = false;
        if (pos == 0) {
            this.leftHead.active = true;
        } else {
            this.rightHead.active = true;
        }
    }
}

