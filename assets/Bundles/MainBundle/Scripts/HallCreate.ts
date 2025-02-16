import { _decorator, Component, EditBox, Node, NodeEventType } from 'cc';
import { NodePaths } from 'db://assets/Core/NodePaths';
import { ComponentBase } from 'db://assets/Core/Scripts/Components/ComponentBase';
import { Json } from 'db://assets/Core/Scripts/Utils/Json';
import { DataManager } from 'db://assets/Model/DataManager';
import { MsgId } from 'db://assets/Model/Enum';
const { ccclass, property } = _decorator;

@ccclass('HallCreate')
export class HallCreate extends ComponentBase {

    弹窗_Label001_EditBox: Node;
    弹窗_Label002_EditBox: Node;
    弹窗_Label003_EditBox: Node;
    弹窗_Label004_EditBox: Node;

    protected onLoadAfter(): void {
        this.node.getChildByPath(NodePaths.HallSearchPrefab.弹窗_关闭).on(Node.EventType.TOUCH_END, () => { app.ui.closePanel(this.node.uuid); }, this);
        this.node.getChildByPath(NodePaths.HallCreatePrefab.弹窗_按钮黄).on(Node.EventType.TOUCH_END, this.createClick, this);

        this.弹窗_Label001_EditBox = this.node.getChildByPath(NodePaths.HallCreatePrefab.弹窗_Label001_EditBox);
        this.弹窗_Label002_EditBox = this.node.getChildByPath(NodePaths.HallCreatePrefab.弹窗_Label002_EditBox);
        this.弹窗_Label003_EditBox = this.node.getChildByPath(NodePaths.HallCreatePrefab.弹窗_Label003_EditBox);
        this.弹窗_Label004_EditBox = this.node.getChildByPath(NodePaths.HallCreatePrefab.弹窗_Label004_EditBox);
    }

    async createClick() {
        app.log.info(
            "名称：" + this.弹窗_Label001_EditBox.getComponent(EditBox).string,
            "ID：" + this.弹窗_Label002_EditBox.getComponent(EditBox).string,
            "人数上限：" + this.弹窗_Label003_EditBox.getComponent(EditBox).string,
            "亲友圈公告：" + this.弹窗_Label004_EditBox.getComponent(EditBox).string,
        );
        const resData = await app.network.request(app.config.getServerAddress() + "/createCircle", {
            user_id: DataManager.selfModel.userId,
            name: this.弹窗_Label001_EditBox.getComponent(EditBox).string,
            people_num: this.弹窗_Label003_EditBox.getComponent(EditBox).string,
            circle_desc: this.弹窗_Label004_EditBox.getComponent(EditBox).string
        });
        const data = Json.parse(resData);
        if (data) {
            if (data["code"] == 1000) {
                app.ui.closePanel(this.node.uuid);
                app.event.send(MsgId.RefreshCircle);
            } else {
                app.ui.showTips(data.message);
            }
        }
    }

}
