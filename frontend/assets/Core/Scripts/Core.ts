import { _decorator } from "cc";
import { LogMgr } from "./Manager/LogMgr";
import { BundleMgr } from "./Manager/BundleMgr";
import { StorageMgr } from "./Manager/StorageMgr";
import { ResMgr } from "./Manager/ResMgr";
import { AudioMgr } from "./Manager/AudioMgr";
import { EventMgr } from "./Manager/EventMgr";
import { TimerMgr } from "./Manager/TimerMgr";
import { LangMgr } from "./Manager/LangMgr";
import { UIMgr } from "./Manager/UIMgr";
import { NetWorkMgr } from "./Manager/NetWorkMgr";
import { MiniSdk } from "./Utils/MiniSdk";
import { Config } from "./Utils/Config";
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
    storage: StorageMgr = StorageMgr.instance;

    /**资源管理器 */
    res: ResMgr = ResMgr.instance;

    /**音频管理器 */
    audio: AudioMgr = AudioMgr.instance;

    /**事件管理器 */
    event: EventMgr = EventMgr.instance;

    /**定时任务管理器 */
    timer: TimerMgr = TimerMgr.instance;

    /**多语言管理器 */
    language: LangMgr = LangMgr.instance;

    /**场景、弹窗管理器 */
    ui: UIMgr = UIMgr.instance;

    /**网络管理器 */
    network: NetWorkMgr = NetWorkMgr.instance;

    /**小游戏SDK */
    miniSdk: MiniSdk = MiniSdk.instance;

    /**配置管理器 */
    config: Config = Config.instance;
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
