import { _decorator, CCString, Label, RichText, Sprite } from "cc";
import { I18nBase } from "./I18nBase";
import { EDITOR } from "cc/env";
const { ccclass, property, requireComponent } = _decorator;

@ccclass('I18nLabel')
@requireComponent(Label)
@requireComponent(RichText)
export class I18nLabel extends I18nBase {
    @property({ visible: true, displayName: "多语言key" })
    private _key: string = "";

    private lbl: Label | RichText | null = null;

    get key(): string {
        return this._key;
    }

    set key(value: string) {
        this._key = value;
        this.refresh();
    }

    protected refresh(): void {
        if (EDITOR) {
            return;
        }

        if (!this.lbl) {
            this.lbl = this.getComponent(Label) || this.getComponent(RichText);
            if (!this.lbl) {
                app.log.err("未找到 Label 或 RichText 组件");
                return;
            }
        }

        this.lbl.string = app.language.getLanguage(this.key);
    }
}
