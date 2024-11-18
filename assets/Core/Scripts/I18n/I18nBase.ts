import { ComponentBase } from "../ComponentBase";
import { FrameEnum } from "../FrameEnum";

/**
 * 多语言抽象基类
 */
export abstract class I18nBase extends ComponentBase {

    protected onLoadAfter(): void {
        // 注册语言更新事件
        this.addListen(FrameEnum.LangChange, this.refresh);

        this.refresh();
    }

    /**
     * 刷新组件显示属性
     */
    protected abstract refresh(): void;
}
