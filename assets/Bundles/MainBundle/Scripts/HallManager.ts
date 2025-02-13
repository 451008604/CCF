import { _decorator, Component, EditBox, instantiate, Node, Prefab } from 'cc';
import { NodePaths } from 'db://assets/Core/NodePaths';
import { ResPaths } from 'db://assets/Core/ResPaths';
import { ComponentBase } from 'db://assets/Core/Scripts/Components/ComponentBase';
import { Json } from 'db://assets/Core/Scripts/Utils/Json';
import { DataManager } from 'db://assets/Model/DataManager';
import { HallItem2 } from './HallItem2';
import { HallItem3 } from './HallItem3';
const { ccclass, property } = _decorator;

@ccclass('HallManager')
export class HallManager extends ComponentBase {

    bg2_成员管理: Node;
    bg2_加入申请: Node;

    protected onLoadAfter() {
        this.bg2_成员管理 = this.node.getChildByPath(NodePaths.HallManagerPrefab.bg2_成员管理);
        this.bg2_加入申请 = this.node.getChildByPath(NodePaths.HallManagerPrefab.bg2_加入申请);

        this.bindNodeClickHandler(NodePaths.HallManagerPrefab.bg2_返回, () => { app.ui.switchScene(ResPaths.MainBundle.HallTablePrefab); });
        this.bindNodeClickHandler(NodePaths.HallManagerPrefab.bg2_ToggleGroup_Toggle1, this.toggle1Click);
        this.bindNodeClickHandler(NodePaths.HallManagerPrefab.bg2_ToggleGroup_Toggle2, this.toggle2Click);
        this.bindNodeClickHandler(NodePaths.HallManagerPrefab.bg2_按钮黄, this.showSearchClick);
        this.bindNodeClickHandler(NodePaths.HallManagerPrefab.黑色半透明遮罩_弹窗_叉, () => {
            this.node.getChildByPath(NodePaths.HallManagerPrefab.黑色半透明遮罩).active = false;
        });
        this.bindNodeClickHandler(NodePaths.HallManagerPrefab.黑色半透明遮罩_弹窗_按钮黄, this.searchClick);

    }

    protected start(): void {
        this.toggle1Click();
    }

    async toggle1Click() {
        this.bg2_成员管理.active = !(this.bg2_加入申请.active = false);

        this.getChild(NodePaths.HallManagerPrefab.bg2_成员管理_ScrollView_view_content).removeAllChildren();
        // 刷新圈子成员列表
        const resData = Json.parse(await app.network.request(app.config.getServerAddress() + "/getCircleInfoList", { user_id: DataManager.selfModel.userId, circle_id: DataManager.hallModel.circleId }));
        if (resData && resData.code == 1000) {
            const itemRes = await app.res.loadRes<Prefab>(ResPaths.MainBundle.HallItem2Prefab);
            for (const i in resData.data) {
                const item = instantiate(itemRes);
                item.getComponent(HallItem2).setData(resData.data[i]);
                this.getChild(NodePaths.HallManagerPrefab.bg2_成员管理_ScrollView_view_content).addChild(item);
            }
        }
    }

    async toggle2Click() {
        this.bg2_加入申请.active = !(this.bg2_成员管理.active = false);

        this.getChild(NodePaths.HallManagerPrefab.bg2_加入申请_ScrollView001_view_content).removeAllChildren();
        // 刷新加入申请列表
        const resData = Json.parse(await app.network.request(app.config.getServerAddress() + "/getCircleApply", { user_id: DataManager.selfModel.userId }));
        if (resData && resData.code == 1000) {
            const itemRes = await app.res.loadRes<Prefab>(ResPaths.MainBundle.HallItem3Prefab);
            for (const i in resData.data) {
                const item = instantiate(itemRes);
                item.getComponent(HallItem3).setData(resData.data[i]);
                this.getChild(NodePaths.HallManagerPrefab.bg2_加入申请_ScrollView001_view_content).addChild(item);
            }
        }
    }

    showSearchClick() {
        this.node.getChildByPath(NodePaths.HallManagerPrefab.黑色半透明遮罩).active = true;
    }

    searchClick() {
        // TODO 等待补充：搜索成员管理列表中对应的玩家ID
        this.node.getChildByPath(NodePaths.HallManagerPrefab.黑色半透明遮罩_弹窗_EditBox).getComponent(EditBox).string;
    }

}
