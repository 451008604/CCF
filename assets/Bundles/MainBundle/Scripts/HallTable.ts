import { _decorator, Component, instantiate, Label, Node, Prefab } from 'cc';
import { NodePaths } from 'db://assets/Core/NodePaths';
import { ResPaths } from 'db://assets/Core/ResPaths';
import { ComponentBase } from 'db://assets/Core/Scripts/Components/ComponentBase';
import { Json } from 'db://assets/Core/Scripts/Utils/Json';
import { HallManager } from './HallManager';
import { HallItem4 } from './HallItem4';
import { MsgId } from 'db://assets/Model/Enum';
import { DataManager } from 'db://assets/Model/DataManager';
const { ccclass, property } = _decorator;

@ccclass('HallTable')
export class HallTable extends ComponentBase {

    protected onLoadAfter(): void {
        this.bindNodeClickHandler(NodePaths.HallTablePrefab.BG_返回, () => { app.ui.switchScene(ResPaths.MainBundle.HallScenePrefab); });
        this.bindNodeClickHandler(NodePaths.HallTablePrefab.BG_管理, () => { app.ui.switchScene(ResPaths.MainBundle.HallManagerPrefab); });
        this.addListen(MsgId.RefreshHallTable, this.refershTableList);

    }

    protected start(): void {
        this.refershTableList();

        this.getChild(NodePaths.HallTablePrefab.BG_Label001).getComponent(Label).string = "" + DataManager.hallModel.id;
    }

    async refershTableList() {
        this.getChild(NodePaths.HallTablePrefab.BG_ScrollView_view_Layout).removeAllChildren();
        const resData = Json.parse(await app.network.request(app.config.getServerAddress() + "/getCardTableByCircleId", { circle_id: DataManager.hallModel.id }));
        if (resData && resData.code == 1000) {
            const itemRes = await app.res.loadRes<Prefab>(ResPaths.MainBundle.HallItem4Prefab);
            const item = instantiate(itemRes);
            item.getComponent(HallItem4).setStyle(0);
            this.getChild(NodePaths.HallTablePrefab.BG_ScrollView_view_Layout).addChild(item);

            for (let i = 0; i < resData.data.length; i++) {
                const item = instantiate(itemRes);
                item.getComponent(HallItem4).setStyle(1);
                item.getComponent(HallItem4).setData(resData.data[i]);
                this.getChild(NodePaths.HallTablePrefab.BG_ScrollView_view_Layout).addChild(item);
            }
        }
    }

}

