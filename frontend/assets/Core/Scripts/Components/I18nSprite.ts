import { _decorator, CCString, Sprite, SpriteFrame } from "cc";
import { I18nBase } from "./I18nBase";
import { EDITOR } from "cc/env";
const { ccclass, property } = _decorator;

@ccclass('I18nSpriteData')
export class I18nSpriteData {
    @property({ displayName: "语言代码", tooltip: "如zh、en等" })
    langCode: string = "";
    @property({ type: SpriteFrame, displayName: "对应精灵" })
    spriteFrame: SpriteFrame | null = null;
}

@ccclass('I18nSprite')
export class I18nSprite extends I18nBase {
    @property({ type: [I18nSpriteData], displayName: "多语言精灵数据列表" })
    spList: I18nSpriteData[] = [];

    private sp: Sprite | null = null;

    protected refresh(): void {
        if (EDITOR) {
            return;
        }

        if (!this.sp) {
            this.sp = this.getComponent(Sprite);
            if (!this.sp) {
                app.log.err("未找到 Sprite 组件");
                return;
            }
        }

        const spriteData = this.spList.find(data => data.langCode == app.language.lang);
        if (spriteData?.spriteFrame) {
            this.sp.spriteFrame = spriteData.spriteFrame;
        } else {
            app.log.err(`未找到语言代码为${app.language.lang}的精灵帧`);
        }
    }

}
