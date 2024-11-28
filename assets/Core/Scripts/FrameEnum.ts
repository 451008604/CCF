/**
 * 框架保留常量
 */
export enum FrameEnumEventMsgID {
    /**
     * 语言切换
     */
    LangChange = 0x100001,
    /**
     * 网络通知
     */
    NetWorkNotify
};

/**
 * 场景预制体路径
 */
export enum FrameEnumScene {
    /**主场景 */
    MainBundle = "MainBundle/MainScene",
    /**游戏场景 */
    GameBundle = "GameBundle/GameScene"
}
