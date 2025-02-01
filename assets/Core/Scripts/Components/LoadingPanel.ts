import { _decorator, BlockInputEvents, NodeEventType, ProgressBar, sys } from 'cc';
import { ComponentBase } from './ComponentBase';
import { FrameEnumEventMsgID } from '../FrameEnum';
import { DataManager } from 'db://assets/Model/DataManager';
const { ccclass, property } = _decorator;

/**
 * 资源加载进度条视图
 */
@ccclass('LoadingPanel')
export class LoadingPanel extends ComponentBase {

    private progress: ProgressBar = null;

    protected onLoadAfter(): void {
        // 防止点击穿透
        this.node.addComponent(BlockInputEvents);
        const bj = this.node.getChildByPath("");
        app.ui.adaptBackgroundToScreen(bj);

        this.node.on(NodeEventType.ACTIVE_CHANGED, this.activeChanged, this);

        this.addListen(FrameEnumEventMsgID.UserDataChange, this.hide);
    }

    start() {
        this.progress = this.node.getComponentInChildren(ProgressBar);
        this.node.active = false;
    }

    /**
     * 当节点的激活状态发生变化时调用
     * @param target 目标节点
     * @param active 节点的激活状态
     */
    async activeChanged(target: any, active: boolean) {
        if (active) {
            // 将节点的层级设置为最上层
            this.node.setSiblingIndex(-1);
            // 未授权时
            if (DataManager.selfModel.token == "") {
                if (sys.isBrowser) {
                    let now = Date.now();
                    let token = app.storage.getText("token");
                    DataManager.selfModel.token = token;
                    // 获取浏览器地址栏的token参数
                    const urlParams = new URLSearchParams(window.location.search);
                    urlParams.get('token') ? token = urlParams.get('token') : null;
                    DataManager.selfModel.token = token || "" + now;
                    DataManager.selfModel.userName = "玩家_" + DataManager.selfModel.token.slice(10);
                    app.storage.setData("token", DataManager.selfModel.token);
                    // 初始化网络管理器
                    app.network.client();
                } else {
                    // 获取用户昵称和头像
                    app.miniSdk.createUserInfoButton().then(userInfo => {
                        userInfo.nickName && (DataManager.selfModel.userName = userInfo.nickName);
                        userInfo.avatarUrl && (DataManager.selfModel.headImg = userInfo.avatarUrl);
                        // 初始化网络管理器
                        app.network.client();
                    }).catch(() => app.ui.showTips("获取用户信息失败"));
                }
            } else {
                this.node.getChildByPath("").active = false;
            }
        }
    }

    /**
     * 更新进度
     * @param _progress 进度值。0 ～ 1
     */
    updateProgress(_progress: number) {
        this.node.active = true;
        if (this.progress) {
            this.progress.progress = _progress;
        }
    }

    /**
     * 隐藏加载进度条视图
     * 如果 DataManager.selfModel.token 存在，则将节点设置为不可见
     */
    hide() {
        if (DataManager.selfModel.token && this.progress?.progress == 1) {
            this.node.active = false;
        }
    }
}
