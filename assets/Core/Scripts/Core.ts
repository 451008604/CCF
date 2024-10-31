import { _decorator, Component, Node } from 'cc';
import { LogMgr } from './Manager/LogMgr';
import { BundleMgr } from './Manager/BundleMgr';
import { DataMgr } from './Manager/DataMgr';
const { ccclass, property } = _decorator;

/**
 * Core 类
 * 负责映射导出框架接口
 */
export class Core {
    /** 日志管理器 */
    log = LogMgr;

    /**分包管理器 */
    bundle = BundleMgr.instance;

    /**数据管理器 */
    data = DataMgr.instance;
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