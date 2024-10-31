import { sys } from "cc";
import { Crypt } from "../Utils/Crypt";
import { Json } from "../Utils/Json";

export class DataMgr {
    private constructor() { }
    static readonly instance: DataMgr = new DataMgr();

    setData(key: string, value: any) {
        const stringValue = typeof value === "object" ? JSON.stringify(value) : value.toString();
        const encryptedValue = Crypt.strEncrypt(stringValue, "dataKey");
        try {
            sys.localStorage.setItem(key, encryptedValue);
        } catch (error) {
            app.log.err(`数据存储失败: ${key}`, error);
        }
    }

    getText(key: string) {
        try {
            const encryptedValue = sys.localStorage.getItem(key);
            if (encryptedValue) {
                return Crypt.strDecrypt(encryptedValue, 'dataKey');
            }
            return null;
        } catch (error) {
            app.log.err(`文本读取失败: ${key}`, error);
            return null;
        }
    }

    getNumber(key: string) {
        const textValue = this.getText(key);
        if (textValue) {
            const numberValue = Number(textValue);
            return isNaN(numberValue) ? null : numberValue;
        }
        return null;
    }

    getJson(key: string) {
        const textValue = this.getText(key);
        if (textValue) {
            return Json.parse(textValue);
        }
        return null;
    }

    removeData(key: string) {
        sys.localStorage.removeItem(key);
    }

    clearAllData() {
        sys.localStorage.clear();
    }
}