import { Asset, assetManager, AssetManager, Prefab } from "cc";
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
    async loadRes<T extends Asset>(
        resPath: string,
        progressFun?: (completedCount: number, totalCount: number, item: any) => void,
    ) {
        try {
            const { bundleName, path } = Parser.path(resPath);
            const bundle = await app.bundle.getBundle(bundleName);
            return await this.loadAsset<T>(bundle, path, progressFun);
        } catch (error) {
            app.log.err(`加载资源失败${resPath}`, error);
        }
    }

    /**
     * 加载单个资源的辅助方法
     * @param bundle 资源所属分包
     * @param path 资源路径
     * @param progressFun 进度回调函数
     * @returns 加载完成后的Promise
     */
    private loadAsset<T>(
        bundle: AssetManager.Bundle,
        path: string,
        progressFun: (completedCount: number, totalCount: number, item: any) => void,
    ) {
        return new Promise<T>((resolve, reject) => {
            bundle.load(
                path,
                (completedCount, totalCount, item) => progressFun?.(completedCount, totalCount, item),
                (err, asset) => {
                    if (err) {
                        app.log.err(`从分包加载资源${path}失败`, err);
                        reject(err);
                    } else {
                        resolve(asset as T);
                    }
                }
            );
        });
    }

    /**
     * 加载目录下的所有资源
     * @param resPath 资源路径
     * @param progressFun 进度回调函数
     * @returns 加载完成后的Promise
     */
    async loadResDir(
        resPath: string,
        progressFun?: (completedCount: number, totalCount: number, item: any) => void
    ) {
        try {
            const { bundleName, path } = Parser.path(resPath);
            const bundle = await app.bundle.getBundle(bundleName);
            return await this.loadAssetDir(bundle, path, progressFun);
        } catch (error) {
            app.log.err(`加载资源目录失败${resPath}`, error);
        }
    }

    /**
     * 加载目录下所有资源的辅助方法
     * @param bundle 资源所属分包
     * @param path 目录路径
     * @param progressFun 进度回调函数
     * @returns 加载完成后的Promise
     */
    private loadAssetDir(
        bundle: AssetManager.Bundle,
        path: string,
        progressFun: (completedCount: number, totalCount: number, item: any) => void
    ) {
        return new Promise<Asset[]>((resolve, reject) => {
            bundle.loadDir(
                path,
                (completedCount, totalCount, item) => progressFun?.(completedCount, totalCount, item),
                (err, assets) => {
                    if (err) {
                        app.log.err(`从分包加载目录${path}失败`, err);
                        reject(err);
                    } else {
                        resolve(assets);
                    }
                }
            );
        });
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
}