import { Asset, assetManager, AssetManager, ImageAsset, instantiate, JsonAsset, Node, Prefab, Sprite, SpriteFrame, TextAsset, Texture2D } from "cc";
import { Parser } from "../Utils/Parser";

/**
 * 资源管理器
 */
export class ResMgr {
    private constructor() { }
    static readonly instance: ResMgr = new ResMgr();

    /**
     * 加载资源
     * @param resPath 资源路径
     * @param progressFun 进度回调函数
     * @returns 加载完成后的Promise
     */
    async loadRes<T extends Asset>(resPath: string, progressFun?: (progress: number) => void,) {
        try {
            const { bundleName, path } = Parser.path(resPath);
            const bundle = await app.bundle.getBundle(bundleName, progressFun);
            return await this.loadAsset<T>(bundle, path);
        } catch (error) {
            app.log.err(`加载资源失败${resPath}`, error);
        }
    }

    /**
     * 加载目录下的所有资源
     * @param resPath 资源路径
     * @param progressFun 进度回调函数
     * @returns 加载完成后的Promise
     */
    async loadResDir(resPath: string, progressFun?: (progress: number) => void) {
        try {
            const { bundleName, path } = Parser.path(resPath);
            const bundle = await app.bundle.getBundle(bundleName, progressFun);
            return await this.loadAssetDir(bundle, path);
        } catch (error) {
            app.log.err(`加载资源目录失败${resPath}`, error);
        }
    }

    /**
     * 释放指定分包内的单个资源
     * @param resPath 资源路径
     */
    releaseRes(resPath: string) {
        const { bundleName, path } = Parser.path(resPath);
        const bundle = assetManager.getBundle(bundleName);
        if (bundle) {
            bundle.release(path);
        } else {
            app.log.err(`分包${bundleName}未找到，无法释放资源${path}`);
        }
    }

    /**
     * 释放指定分包内的全部资源
     * @param bundleName 分包名称
     */
    releaseBundle(bundleName: string) {
        const bundle = assetManager.getBundle(bundleName);
        if (bundle) {
            bundle.releaseAll();
            assetManager.removeBundle(bundle);
        } else {
            app.log.err(`分包${bundleName}未找到，无法移除`);
        }
    }

    /**
     * 移除所有分包
     */
    releaseAll() {
        assetManager.releaseAll();
    }

    /**
     * 加载远程资源并返回指定类型的资源
     * @template T 资源类型，必须继承自Asset
     * @param {string} remoteUrl 远程资源的URL
     * @param {Object} [ext] 可选参数，包含资源的扩展名等信息
     * @param {string} [ext.ext] 资源的扩展名，默认为".png"
     * @returns 返回一个Promise对象，解析为指定类型的资源
     */
    loadRemoteRes<T extends Asset>(remoteUrl: string, ext?: { [k: string]: any; ext?: string; }) {
        return new Promise<T>((resolve, reject) => {
            assetManager.loadRemote<T>(remoteUrl, ext, (err, asset) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(asset);
                }
            });
        });
    }

    /**
     * 加载单个资源的辅助方法
     * @param bundle 资源所属分包
     * @param path 资源路径
     * @returns 加载完成后的Promise
     */
    private loadAsset<T>(bundle: AssetManager.Bundle, path: string) {
        return new Promise<T>((resolve, reject) => {
            bundle.load(path, null, (err, asset) => {
                if (err) {
                    app.log.err(`从分包加载资源${path}失败`, err);
                    reject(err);
                } else {
                    resolve(asset as T);
                }
            });
        });
    }

    /**
     * 加载目录下所有资源的辅助方法
     * @param bundle 资源所属分包
     * @param path 目录路径
     * @returns 加载完成后的Promise
     */
    private loadAssetDir(bundle: AssetManager.Bundle, path: string) {
        return new Promise<Asset[]>((resolve, reject) => {
            bundle.loadDir(path, null, (err, assets) => {
                if (err) {
                    app.log.err(`从分包加载目录${path}失败`, err);
                    reject(err);
                } else {
                    resolve(assets);
                }
            });
        });
    }

    /**
     * 异步加载并实例化一个预制体资源。
     * @param resPtah - 预制体资源的路径。
     * @returns 返回实例化后的预制体对象。
     */
    GetPrefabNode(resPtah: string) {
        return new Promise<Node>((resolve, reject) => {
            app.res.loadRes<Prefab>(resPtah).then((res) => {
                resolve(instantiate(res));
            }).catch(reject);
        });
    }

    /**
     * 异步加载指定路径的精灵帧，并创建一个包含该精灵帧的新节点。
     * @param resPtah - 精灵帧资源的路径。
     * @returns 返回一个包含指定精灵帧的新节点。
     */
    GetSpriteFrame(resPtah: string) {
        return new Promise<Node>((resolve, reject) => {
            app.res.loadRes<SpriteFrame>(resPtah).then((res) => {
                const node = new Node();
                node.addComponent(Sprite).spriteFrame = res;
                resolve(node);
            }).catch(reject);
        });
    }

    /**
     * 加载远程图片并返回SpriteFrame
     * @param remoteUrl 远程图片的URL
     * @returns 返回一个Promise对象，解析为SpriteFrame
     */
    GetSpriteFrameRemote(remoteUrl: string) {
        return new Promise<SpriteFrame>((resolve, reject) => {
            app.res.loadRemoteRes<ImageAsset>(remoteUrl, { ext: ".png" }).then((imageAsset: ImageAsset) => {
                const spriteFrame = new SpriteFrame();
                const texture = new Texture2D();
                texture.image = imageAsset;
                spriteFrame.texture = texture;
                resolve(spriteFrame);
            }).catch(reject);
        });
    }

    /**
     * 异步加载一个JSON文件。
     * @param resPath - JSON文件的路径。
     * @returns 返回解析后的JSON对象。
     */
    GetJson(resPath: string) {
        return new Promise<any>((resolve, reject) => {
            app.res.loadRes<JsonAsset>(resPath).then((jsonAsset: JsonAsset) => {
                resolve(jsonAsset.json);
            }).catch(reject);
        });
    }

    /**
     * 异步加载指定路径下的文本资源。
     * @param resPath - 文本资源的路径。
     * @returns 返回加载的文本资源内容。
     */
    GetText(resPath: string) {
        return new Promise<string>((resolve, reject) => {
            app.res.loadRes<TextAsset>(resPath).then((textAsset: TextAsset) => {
                resolve(textAsset.text);
            }).catch(reject);
        });
    }

}
