import { _decorator, Component, EditBox, math, Node } from 'cc';
import { NodePaths } from 'db://assets/Core/NodePaths';
import { ComponentBase } from 'db://assets/Core/Scripts/Components/ComponentBase';
import { Json } from 'db://assets/Core/Scripts/Utils/Json';
import { DataManager } from 'db://assets/Model/DataManager';
import { MsgId } from 'db://assets/Model/Enum';
const { ccclass, property } = _decorator;

@ccclass('HallTableCreate')
export class HallTableCreate extends ComponentBase {

    protected async onLoadAfter(): Promise<void> {
        this.bindNodeClickHandler(NodePaths.HallTableCreatePrefab.kuang_叉, () => { app.ui.closePanel(this.node.uuid); });
        this.bindNodeClickHandler(NodePaths.HallTableCreatePrefab.kuang_按钮绿, () => { app.ui.closePanel(this.node.uuid); });
        this.bindNodeClickHandler(NodePaths.HallTableCreatePrefab.kuang_按钮黄, this.createTable);
    }

    async createTable() {
        const name = this.getChild(NodePaths.HallTableCreatePrefab.kuang_Label001_EditBox).getComponent(EditBox).string;
        const num = Math.min(Number(this.getChild(NodePaths.HallTableCreatePrefab.kuang_Label002_EditBox).getComponent(EditBox).string), 8);
        const resData = Json.parse(await app.network.request(app.config.getServerAddress() + "/createCardTable", { user_id: DataManager.selfModel.userId, name: name, people_num: num, circle_id: DataManager.hallModel.id }));
        if (resData) {
            if (resData.code == 1000) {
                app.ui.closePanel(this.node.uuid);
                app.event.send(MsgId.RefreshHallTable);
            } else {
                app.ui.showTips(resData.message);
            }
        }
    }

}
