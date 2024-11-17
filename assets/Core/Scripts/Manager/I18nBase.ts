import { ComponentBase } from "../ComponentBase";
import { FrameConst } from "../Const";

/**
 * 多语言抽象基类
 */
export abstract class I18nBase extends ComponentBase {

    protected onLoadAfter(): void {
        // 注册语言更新事件
        this.addListen(FrameConst.LangChange, this.refresh);

        this.refresh();
    }

    /**
     * 刷新组件显示属性
     */
    abstract refresh(): void;
}
