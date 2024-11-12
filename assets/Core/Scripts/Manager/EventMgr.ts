/**
 * 事件管理器
 */
export class EventMgr {
    private constructor() { }
    static readonly instance: EventMgr = new EventMgr();

    private listenMap = new Map<number, Function[]>();

    /**
     * 添加事件监听
     * @param cmd 事件ID
     * @param handler 事件处理函数
     */
    addListen(cmd: number, handler: Function) {
        let list = this.listenMap.get(cmd);
        if (!list) {
            list = [];
            this.listenMap.set(cmd, list);
        }
        list.push(handler);
    }

    /**
     * 移除事件监听
     * @param cmd 事件ID
     * @param handler 事件处理函数
    */
    removeListen(cmd: number, handler: Function) {
        let list = this.listenMap.get(cmd);
        if (list) {
            app.log.info(list);
            for (let i = 0; i < list.length; i++) {
                if (list[i] == handler) {
                    list.splice(i, 1);
                    i--;
                }
            }
        }
    }

    /**
     * 广播事件
     * @param cmd 事件ID
     * @param data 形参数据
     */
    send(cmd: number, data: any) {
        let list = this.listenMap.get(cmd);
        if (list) {
            list.forEach(callback => { callback(data); });
        }
    }
}