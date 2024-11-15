import { _decorator } from 'cc';
import { LogMgr } from './Manager/LogMgr';
import { BundleMgr } from './Manager/BundleMgr';
import { DataMgr } from './Manager/DataMgr';
import { ResMgr } from './Manager/ResMgr';
import { AudioMgr } from './Manager/AudioMgr';
import { EventMgr } from './Manager/EventMgr';
import { TimerMgr } from './Manager/TimerMgr';

/**
 * Core 类
 * 负责映射导出框架接口
 */
export class Core {

    /** 日志管理器 */
    log: LogMgr = LogMgr.instance;

    /**分包管理器 */
    bundle: BundleMgr = BundleMgr.instance;

    /**数据管理器 */
    data: DataMgr = DataMgr.instance;

    /**资源管理器 */
    res: ResMgr = ResMgr.instance;

    /**音频管理器 */
    audio: AudioMgr = AudioMgr.instance;

    /**事件管理器 */
    event: EventMgr = EventMgr.instance;

    /**定时任务管理器 */
    timer: TimerMgr = TimerMgr.instance;
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