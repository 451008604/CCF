import { _decorator, Component, Node, ProgressBar } from 'cc';
import { ComponentBase } from './ComponentBase';
const { ccclass, property } = _decorator;

/**
 * 资源加载进度条界面
 */
@ccclass('LoadingView')
export class LoadingView extends ComponentBase {

    private progress: ProgressBar = null;

    start() {
        this.progress = this.node.getComponentInChildren(ProgressBar);
        this.node.active = false;
    }

    /**
     * 更新进度
     * @param _progress 进度值。0 ～ 1
     */
    updateProgress(_progress: number) {
        if (this.progress) {
            this.progress.progress = _progress;
        }
    }
}
