/**
 * 事件管理器
 */
export class EventMgr {
    private constructor() { }
    static readonly instance: EventMgr = new EventMgr();

    private listenMap = new Map<number, Map<any, Function>>();

    add(cmd: number, callback: Function, thisObject: any) {
        let list = this.listenMap.get(cmd);
        if (!list) {
            list = new Map();
            this.listenMap.set(cmd, list);
        }
        list.set(thisObject, callback);
    }

    remove(cmd: number, thisObject: any) {
        let list = this.listenMap.get(cmd);
        list.delete(thisObject);
    }

    send(cmd: number, data: any) {
        let list = this.listenMap.get(cmd);
        list.forEach(callback => {
            callback(data);
        });
    }
}