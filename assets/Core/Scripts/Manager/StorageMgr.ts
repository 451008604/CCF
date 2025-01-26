import { sys } from "cc";
import { Crypt } from "../Utils/Crypt";
import { Json } from "../Utils/Json";

/**
 * 数据管理器
 */
export class StorageMgr {
    private constructor() { }
    static readonly instance: StorageMgr = new StorageMgr();

    /**
     * 存储数据
     * @param key 数据键
     * @param value 数据值，可以是文本、数字或者对象
     */
    setData(key: string, value: any) {
        const stringValue = typeof value === "object" ? JSON.stringify(value) : value.toString();
        const encryptedValue = Crypt.strEncrypt(stringValue, "dataKey");
        try {
            sys.localStorage.setItem(key, encryptedValue);
        } catch (error) {
            app.log.err(`数据存储失败: ${key}`, error);
        }
    }

    /**
     * 读取文本数据
     * @param key 数据键
     * @returns 返回对应的数据值
     */
    getText(key: string) {
        try {
            const encryptedValue = sys.localStorage.getItem(key);
            if (encryptedValue) {
                return Crypt.strDecrypt(encryptedValue, 'dataKey');
            }
            return "";
        } catch (error) {
            app.log.err(`文本读取失败: ${key}`, error);
            return "";
        }
    }

    /**
     * 读取数字数据
     * @param key 数据键
     * @returns 返回对应的数字值
     */
    getNumber(key: string) {
        const textValue = this.getText(key);
        if (textValue) {
            const numberValue = Number(textValue);
            return isNaN(numberValue) ? 0 : numberValue;
        }
        return 0;
    }

    /**
     * 读取JSON数据
     * @param key 数据键
     * @returns 返回对应的JSON对象
     */
    getJson(key: string) {
        const textValue = this.getText(key);
        if (textValue) {
            return Json.parse(textValue);
        }
        return {};
    }

    /**
     * 删除数据
     * @param key 数据键
     */
    removeData(key: string) {
        sys.localStorage.removeItem(key);
    }

    /**
     * 清空所有数据
     */
    clearAllData() {
        sys.localStorage.clear();
    }
}