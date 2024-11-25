import { Component, Node, NodeEventType } from "cc";

/**
 * 组件基类。用于替代`cc.Component`
 */
export abstract class ComponentBase extends Component {

    /**
     * 如需使用请替换为`onLoadAfter()`
     * @deprecated 由父类执行，子类请勿覆盖
     */
    protected onLoad() {
        // 监听节点销毁时，自动清理挂载的自定义监听
        this.node.once(NodeEventType.NODE_DESTROYED, this.destroyAfterHandler, this);

        this.onLoadAfter();
    }

    /**
     * 执行组件初始化操作，等效于`onLoad()`
     */
    protected onLoadAfter() { };

    // 挂载的监听事件
    private listenList = [];

    /**
     * 添加监听事件
     * @param cmd 事件ID
     * @param handler 事件处理函数
     */
    addListen(cmd: number, handler: Function) {
        app.event.addListen(cmd, handler, this);
        this.listenList.push(cmd);
    }

    /**
     * 节点销毁后执行
     */
    private destroyAfterHandler() {
        // 自动移除组件中挂载的监听事件
        for (const cmd of this.listenList) {
            app.event.removeListen(cmd, this);
        }
    }

}
