import { _decorator, Component, Node } from 'cc';
import { LogMgr } from './Manager/LogMgr';
import { BundleMgr } from './Manager/BundleMgr';
import { DataMgr } from './Manager/DataMgr';
import { ResMgr } from './Manager/ResMgr';

/**
 * Core 类
 * 负责映射导出框架接口
 */
export class Core {
    instance: any;
    /** 日志管理器 */
    log: LogMgr = LogMgr.instance;

    /**分包管理器 */
    bundle: BundleMgr = BundleMgr.instance;

    /**数据管理器 */
    data: DataMgr = DataMgr.instance;

    /**资源管理器 */
    res: ResMgr = ResMgr.instance;


}


/** 全局 Window 接口 */
declare global {
    interface Window {
        app: Core;
    }
    const app: Core;
}
/** 创建 Core 类的实例并赋值给全局 window 对象 */
window.app = new Core();