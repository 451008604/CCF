import { Component } from "cc";

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
    }

    /**
     * 自动移除组件中挂载的监听事件
     */
    private removeListen() {
        for (const cmd of this.listenList) {
            app.event.removeListen(cmd, this);
        }
        debugger;
    }

}