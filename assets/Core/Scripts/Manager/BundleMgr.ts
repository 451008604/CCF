import { _decorator, AssetManager, assetManager } from 'cc';

/**
 * 分包管理器
 */
export class BundleMgr {
    private constructor() { }
    static readonly instance: BundleMgr = new BundleMgr();

    /**
     * 自动加载并获取指定分包
     * @param nameOrUrl 分包名称或者URL
     * @param onProgress 进度回调函数
     */
    async getBundle(nameOrUrl: string, onProgress?: (progress: number) => void) {
        const bundle = assetManager.getBundle(nameOrUrl);
        if (bundle) {
            return bundle;
        }

        try {
            const loadedBundle = await this.loadBundle(nameOrUrl);
            if (onProgress) {
                await this.loadAssetsWithProgress(loadedBundle, onProgress);
            }

            // 加载多语言配置
            await app.language.loadLanguageData(nameOrUrl);
            return loadedBundle;
        } catch (error) {
            app.log.err(`分包${nameOrUrl}加载失败`, error);
            return null;
        }
    }

    /**
     * 加载指定分包
     * @param nameOrUrl 分包名称或者URL
     * @returns 加载完成后的Promise
     */
    private loadBundle(nameOrUrl: string) {
        return new Promise<AssetManager.Bundle>((resolve, reject) => {
            assetManager.loadBundle(nameOrUrl, (err, loadedBundle) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(loadedBundle);
                }
            });
        });
    }


    /**
     * 加载分包中的资源并返回加载进度
     * @param loadedBundle 已加载的分包
     * @param onProgress 加载进度回调函数
     * @returns 加载完成后的Promise
     */
    private loadAssetsWithProgress(loadedBundle: AssetManager.Bundle, onProgress: (progress: number) => void) {
        return new Promise<void>((resolve, reject) => {
            const assets = loadedBundle.getDirWithPath('');
            const totalAssets = assets.length;
            let loadedAssets = 0;

            if (totalAssets == 0) {
                onProgress(1);
                resolve();
                return;
            }

            assets.forEach((assets) => {
                loadedBundle.load(assets.path, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    loadedAssets++;
                    onProgress(loadedAssets / totalAssets);

                    if (loadedAssets == totalAssets) {
                        resolve();
                    }
                });
            });
        });
    }
}
