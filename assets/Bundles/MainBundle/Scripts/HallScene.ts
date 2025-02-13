import { _decorator, Component, EditBox, instantiate, Label, Node, Prefab } from 'cc';
import { NodePaths } from 'db://assets/Core/NodePaths';
import { ResPaths } from 'db://assets/Core/ResPaths';
import { ComponentBase } from 'db://assets/Core/Scripts/Components/ComponentBase';
import { Json } from 'db://assets/Core/Scripts/Utils/Json';
import { DataManager } from 'db://assets/Model/DataManager';
import { MsgId } from 'db://assets/Model/Enum';
import { HallItem1 } from './HallItem1';
import { HallManager } from './HallManager';
import { HallSearch } from './HallSearch';
import { HallTable } from './HallTable';
const { ccclass, property } = _decorator;

@ccclass('HallScene')
export class HallScene extends ComponentBase {
    bg_亲友圈: Node;
    bg_搜索: Node;
    bg_亲友圈_ScrollView_view_content: Node;

    protected async onLoadAfter(): Promise<void> {
        this.bg_亲友圈 = this.node.getChildByPath(NodePaths.HallScenePrefab.bg_亲友圈);
        this.bg_搜索 = this.node.getChildByPath(NodePaths.HallScenePrefab.bg_搜索);
        this.bg_亲友圈_ScrollView_view_content = this.node.getChildByPath(NodePaths.HallScenePrefab.bg_亲友圈_ScrollView_view_content);

        this.node.getChildByPath(NodePaths.HallScenePrefab.bg_返回按钮).on(Node.EventType.TOUCH_END, () => { app.ui.switchScene(ResPaths.MainBundle.MainScenePrefab); }, this);
        this.node.getChildByPath(NodePaths.HallScenePrefab.bg_刷新).on(Node.EventType.TOUCH_END, this.refreshClick, this);
        this.node.getChildByPath(NodePaths.HallScenePrefab.bg_ToggleGroup_Toggle1).on(Node.EventType.TOUCH_END, this.toggle1Click, this);
        this.node.getChildByPath(NodePaths.HallScenePrefab.bg_ToggleGroup_Toggle2).on(Node.EventType.TOUCH_END, this.toggle2Click, this);
        this.node.getChildByPath(NodePaths.HallScenePrefab.bg_按钮黄).on(Node.EventType.TOUCH_END, this.createClick, this);
        this.node.getChildByPath(NodePaths.HallScenePrefab.bg_搜索_按钮黄).on(Node.EventType.TOUCH_END, this.searchClick, this);
        this.node.getChildByPath(NodePaths.HallScenePrefab.bg_亲友圈_名牌_组123).on(Node.EventType.TOUCH_END, this.managerClick, this);
        this.addListen(MsgId.RefreshCircle, this.refreshClick);
        this.addListen(MsgId.ShowCircleInfo, this.showCircleInfo);


        this.node.getChildByPath(NodePaths.HallScenePrefab.bg_亲友圈_名牌).active = false;
        this.refreshClick();
        this.toggle1Click();
    }

    showCircleInfo(headImg: string) {
        this.node.getChildByPath(NodePaths.HallScenePrefab.bg_亲友圈_名牌).active = true;
        this.node.getChildByPath(NodePaths.HallScenePrefab.bg_亲友圈_名牌_Label).getComponent(Label).string = "" + DataManager.hallModel.circle_desc;
        this.node.getChildByPath(NodePaths.HallScenePrefab.bg_亲友圈_名牌_Label002).getComponent(Label).string = "" + DataManager.hallModel.name;
        this.node.getChildByPath(NodePaths.HallScenePrefab.bg_亲友圈_名牌_Label003).getComponent(Label).string = "ID: " + DataManager.hallModel.id;
        this.node.getChildByPath(NodePaths.HallScenePrefab.bg_亲友圈_名牌_亲友圈头像框_人数框_Label).getComponent(Label).string = "" + DataManager.hallModel.people_num;
    }

    async refreshClick() {
        this.bg_亲友圈_ScrollView_view_content.removeAllChildren();
        const resData = Json.parse(await app.network.request(app.config.getServerAddress() + "/getCircleByUser", { user_id: DataManager.selfModel.userId }));
        if (resData && resData.code == 1000) {
            const itemRes = await app.res.loadRes<Prefab>(ResPaths.MainBundle.HallItem1Prefab);
            for (const i in resData.data) {
                const item = instantiate(itemRes);
                item.getComponent(HallItem1).setData(resData.data[i]);
                this.bg_亲友圈_ScrollView_view_content.addChild(item);
                if (i == "0") {
                    item.getComponent(HallItem1).showCircleInfo();
                }
            }
        }
    }

    toggle1Click() {
        this.bg_亲友圈.active = !(this.bg_搜索.active = false);
    }

    toggle2Click() {
        this.bg_搜索.active = !(this.bg_亲友圈.active = false);
    }

    createClick() {
        app.ui.openPanel(ResPaths.MainBundle.HallCreatePrefab);
    }

    managerClick() {
        app.ui.switchScene(ResPaths.MainBundle.HallTablePrefab);
    }

    async searchClick() {
        const node = await app.ui.openPanel(ResPaths.MainBundle.HallSearchPrefab);
        node.getComponent(HallSearch).showCircleInfo(this.node.getChildByPath(NodePaths.HallScenePrefab.bg_搜索_EditBox).getComponent(EditBox).string);
    }
}
