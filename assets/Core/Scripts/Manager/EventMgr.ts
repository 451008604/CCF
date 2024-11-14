/**
 * 事件管理器
 */
export class EventMgr {
    private constructor() { }
    static readonly instance: EventMgr = new EventMgr();

    private listenMap = new Map<number, Map<any, Function>>();

    /**
     * 添加监听事件
     * @param cmd 事件ID
     * @param handler 事件处理函数
     * @param thisObject 事件作用域
     */
    addListen(cmd: number, handler: Function, thisObject: Object) {
        let list = this.listenMap.get(cmd);
        if (!list) {
            list = new Map();
            this.listenMap.set(cmd, list);
        }
        list.set(thisObject, handler);
    }

    /**
     * 移除监听事件
     * @param cmd 事件ID
     * @param thisObject 事件作用域
    */
    removeListen(cmd: number, thisObject: Object) {
        this.listenMap.get(cmd)?.delete(thisObject);
    }

    /**
     * 广播事件
     * @param cmd 事件ID
     * @param data 形参数据
     */
    send(cmd: number, ...data: any) {
        this.listenMap.get(cmd)?.forEach((callback, thisObject) => {
            callback.call(thisObject, ...data);
        });
    }
}
