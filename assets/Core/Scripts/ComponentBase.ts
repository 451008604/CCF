import { Component, NodeEventType } from "cc";

export class ComponentBase extends Component {
    constructor() {
        super();
    }

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

        if (this.listenList.length == 1) {
            // 监听节点销毁时，自动清理挂载的自定义监听
            this.node.once(NodeEventType.NODE_DESTROYED, this.destroyAfterHandler, this);
        }
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