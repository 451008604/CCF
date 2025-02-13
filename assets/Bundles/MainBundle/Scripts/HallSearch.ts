import { _decorator, Component, Label, Node } from 'cc';
import { NodePaths } from 'db://assets/Core/NodePaths';
import { ComponentBase } from 'db://assets/Core/Scripts/Components/ComponentBase';
import { Json } from 'db://assets/Core/Scripts/Utils/Json';
import { DataManager } from 'db://assets/Model/DataManager';
const { ccclass, property } = _decorator;

@ccclass('HallSearch')
export class HallSearch extends ComponentBase {
    circleInfo: any;

    protected onLoadAfter(): void {
        this.node.getChildByPath(NodePaths.HallSearchPrefab.弹窗_关闭).on(Node.EventType.TOUCH_END, () => { app.ui.closePanel(this.node.uuid); }, this);
        this.node.getChildByPath(NodePaths.HallSearchPrefab.弹窗_按钮黄).on(Node.EventType.TOUCH_END, this.joinClick, this);

        this.node.active = false;
    }

    async showCircleInfo(circleId: string) {
        const resData = Json.parse(await app.network.request(app.config.getServerAddress() + "/getCircleInfo", { circle_id: circleId }));
        if (resData && resData.code == 1000) {
            this.circleInfo = resData;
            this.node.getChildByPath(NodePaths.HallSearchPrefab.弹窗_文本框大_Label).getComponent(Label).string = "亲友圈名称：" + resData.data.name;
            this.node.getChildByPath(NodePaths.HallSearchPrefab.弹窗_文本框大_Label001).getComponent(Label).string = "亲友圈ID：" + resData.data.id;
            this.node.getChildByPath(NodePaths.HallSearchPrefab.弹窗_文本框大_Label002).getComponent(Label).string = "人数：" + resData.data.people_num;
            this.node.getChildByPath(NodePaths.HallSearchPrefab.弹窗_文本框大_Label003).getComponent(Label).string = "亲友圈公告：" + resData.data.circle_desc;

            this.node.active = true;
        }
    }

    async joinClick() {
        const resData = Json.parse(await app.network.request(app.config.getServerAddress() + "/userApply", { user_id: DataManager.selfModel.userId, circle_id: this.circleInfo.data.id }));
        if (resData) {
            if (resData.code == 1000) {
                app.ui.closePanel(this.node.uuid);
            } else {
                app.ui.showTips(resData.message);
            }
        }
    }

}
