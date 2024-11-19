import { assetManager, Director, director, JsonAsset, sys, System } from "cc";
import { EDITOR } from "cc/env";
import { FrameEnumEventMsgID } from "../FrameEnum";

/**
 * 多语言管理器
 */
export class LangMgr {
    private constructor() {
        if (!EDITOR) {
            director.once(Director.EVENT_AFTER_SCENE_LAUNCH, this.init, this);
        }
    }
    static readonly instance: LangMgr = new LangMgr();

    // 记录已加载的分包及其语言
    private loadedBundles: Record<string, Set<string>> = {};
    // 当前选择的语言
    private curLang: string;
    // 缓存的语言数据
    private langData: Record<string, Set<string>> = {};

    private async init() {
        const curLang = app.data.getText("language") || sys.language || "zh";
        await this.changeLang(curLang);
    }

    /**
     * 获取当前语言
     */
    get lang(): string {
        return this.curLang;
    }

    /**
     * 更改当前语言Code，并刷新已显示的语言内容
     * @param langCode 语言Code
     */
    async changeLang(langCode: string) {
        if (this.curLang != langCode) {
            this.curLang = langCode;

            await Promise.all(
                Object.keys(this.loadedBundles).map(async bundleName => {
                    await this.loadLanguageData(bundleName, langCode);
                })
            );

            app.data.setData("language", langCode);
            app.event.send(FrameEnumEventMsgID.LangChange);
        }
    }

    /**
     * 异步加载指定分包的语言数据
     * @param bundleName 分包名称
     * @param langCode 语言Code
     */
    async loadLanguageData(bundleName: string, langCode: string = this.curLang) {
        const loadedLanguages = this.loadedBundles[bundleName] || new Set<string>();
        if (loadedLanguages.has(langCode)) {
            return;
        }

        const filePath = `/Res/Lang/Lable/${langCode}`;
        if (assetManager.bundles.get(bundleName).getInfoWithPath(filePath)) {
            const langAsset = await app.res.loadRes<JsonAsset>(`${bundleName}` + filePath);
            this.langData[langCode] = { ...this.langData[langCode], ...langAsset.json };
            loadedLanguages.add(langCode);
            this.loadedBundles[bundleName] = loadedLanguages;
        }
    }

    /**
     * 根据键获取语言对应的文本内容
     * @param key 文本键
     * @param def 默认显示内容
     * @returns 语言对应的文本内容
     */
    getLanguage(key: string, def: string = "") {
        return this.langData[this.curLang]?.[key] ?? def;
    }
}