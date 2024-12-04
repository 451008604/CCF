/**
 * 框架保留常量
 */
export enum FrameEnumEventMsgID {
    /**语言切换 */
    LangChange = 0x100001,
    /**接收到的服务器通知 */
    NetWorkNotify
};

/**
 * 提示展示的位置
 */
export enum FrameEnumTipsPosition {
    /**居中展示 */
    CENTER,
    /**上方展示 */
    TOP,
    /**底部展示 */
    BOTTOM
};