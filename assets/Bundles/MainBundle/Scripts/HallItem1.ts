import { _decorator, Component, Label, Node, NodeEventType } from 'cc';
import { NodePaths } from 'db://assets/Core/NodePaths';
import { ComponentBase } from 'db://assets/Core/Scripts/Components/ComponentBase';
import { Json } from 'db://assets/Core/Scripts/Utils/Json';
import { DataManager, HallModel } from 'db://assets/Model/DataManager';
import { MsgId } from 'db://assets/Model/Enum';
const { ccclass, property } = _decorator;

@ccclass('HallItem1')
export class HallItem1 extends ComponentBase {

    private _headImg: string;

    private _info: HallModel;

    protected onLoadAfter(): void {
        this.node.active = false;

        this.node.on(Node.EventType.TOUCH_END, this.showCircleInfo, this);
    }

    showCircleInfo() {
        DataManager.hallModel = { ...DataManager.hallModel, ...this._info };
        app.event.send(MsgId.ShowCircleInfo, this._headImg);
    }

    async setData(info: HallModel) {
        this._info = info;
        const resData = Json.parse(await app.network.request(app.config.getServerAddress() + "/getUserInfo", { user_id: info.user_id }));
        let userName = "-";
        if (resData && resData.code == 1000) {
            userName = resData.data.nickname;
            this._headImg = resData.data.img;
        }

        this.node.getChildByPath(NodePaths.HallItem1Prefab.Label).getComponent(Label).string = "" + info.name;
        this.node.getChildByPath(NodePaths.HallItem1Prefab.Label001).getComponent(Label).string = "" + userName;
        this.node.getChildByPath(NodePaths.HallItem1Prefab.Label002).getComponent(Label).string = "" + info.people_num;
        this.node.getChildByPath(NodePaths.HallItem1Prefab.Label003).getComponent(Label).string = "" + info.id;

        this.node.active = true;
    }

}

