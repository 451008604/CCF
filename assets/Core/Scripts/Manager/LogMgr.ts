import { _decorator } from 'cc';

/**
 * 日志管理类，用于统一日志输出格式
 */
export class LogMgr {
    private constructor() { }
    static readonly instance: LogMgr = new LogMgr();

    /**
     * 用于输出一般信息
     */
    get info() {
        return window.console.log.bind(window.console, '%c【信息】', 'color: white; background-color: #28A745; font-weight: bold; font-size: 14px;');
    }

    /**
     * 用于输出警告信息
     */
    get warn() {
        return window.console.log.bind(window.console, '%c【警告】', 'color: black; background-color: #FFC107; font-weight: bold; font-size: 14px;');
    }

    /**
     * 用于输出错误信息
     */
    get err() {
        return window.console.log.bind(window.console, '%c【错误】', 'color: white; background-color: #DC3545; font-weight: bold; font-size: 14px;');
    }
}
