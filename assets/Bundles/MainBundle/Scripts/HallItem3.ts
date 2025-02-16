import { _decorator, Component, Label, Node } from 'cc';
import { NodePaths } from 'db://assets/Core/NodePaths';
import { ComponentBase } from 'db://assets/Core/Scripts/Components/ComponentBase';
import { Json } from 'db://assets/Core/Scripts/Utils/Json';
import { DataManager } from 'db://assets/Model/DataManager';
const { ccclass, property } = _decorator;

@ccclass('HallItem3')
export class HallItem3 extends ComponentBase {
    private _info: any;

    protected onLoadAfter(): void {
        this.bindNodeClickHandler(NodePaths.HallItem3Prefab.按钮黄小, () => { this.handler(1); });
        this.bindNodeClickHandler(NodePaths.HallItem3Prefab.按钮绿小, () => { this.handler(2); });
    }

    async handler(t: number) {
        const resData = Json.parse(await app.network.request(app.config.getServerAddress() + "/handleApply", { user_id: DataManager.selfModel.userId, circleInfo_id: this._info.circleInfo_id, type: t }));
        if (resData) {
            if (resData.code == 1000) {
                this.node.removeFromParent();
            } else {
                app.ui.showTips(resData.message);
            }
        }
    }

    async setData(info: any) {
        this._info = info;

        this.getChild(NodePaths.HallItem3Prefab.Label).getComponent(Label).string = "" + info.nickname;
        this.getChild(NodePaths.HallItem3Prefab.Label001).getComponent(Label).string = "" + info.user_id;

        this.node.active = true;
    }
}

