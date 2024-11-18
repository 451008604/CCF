import { _decorator, Component, instantiate, Layers, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    protected onLoad(): void {
        // app.res.loadResDir("Bundles", (completedCount, totalCount, item) => {
        //     app.log.info("分包加载进度", (completedCount / totalCount).toFixed(2), "%");
        // }).then((bundle) => {
        //     if (bundle) {
        //         app.log.info("分包加载完成", bundle);
        //     }
        // });
    }

    async start() {
        app.log.info("进入主场景");


        // 测试多语言配置
        await app.language.loadLanguageData("Bundles");
        const prefab = await app.res.loadRes<Prefab>('Bundles/Node');
        const newNode = instantiate(prefab);
        const scale = newNode.getScale(new Vec3());
        // scale.x = scale.y = scale.z *= 1.5;
        newNode.setScale(scale);
        newNode.children.forEach(node => {
            node.layer = Layers.Enum.UI_2D;
        });
        this.node.addChild(newNode);

    }
}
