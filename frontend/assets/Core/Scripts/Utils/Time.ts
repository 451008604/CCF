/**
 * 时间工具类
 */
export class Time {
    /**
     * 获取当前时间的秒值
     * @returns 自1970年1月1日到现在经过的秒数
     */
    static getNowSeconds() {
        return Math.floor(Date.now() / 1000);
    }
}