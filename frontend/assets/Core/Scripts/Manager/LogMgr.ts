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
        return window.console.log.bind(window.console, '%c[ info ]', 'color: white; background-color: #198754; font-weight: bold; font-size: 1rem;');
    }

    /**
     * 用于输出警告信息
     */
    get warn() {
        return window.console.log.bind(window.console, '%c[ warn ]', 'color: white; background-color: #ffc107; font-weight: bold; font-size: 1rem;');
    }

    /**
     * 用于输出错误信息
     */
    get err() {
        return window.console.log.bind(window.console, '%c[ err  ]', 'color: white; background-color: #dc3545; font-weight: bold; font-size: 1rem;');
    }
}
