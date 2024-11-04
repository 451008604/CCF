import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    start() {
        app.log.info("进入主场景");


        app.data.setData("abc", 123);

        app.log.info(app.data.getText("abc"));
    }

    update(deltaTime: number) {

    }

    protected onLoad(): void {
        app.res.loadResDir("Bundles", (completedCount, totalCount, item) => {
            app.log.info("分包加载进度", (completedCount / totalCount).toFixed(2), "%");
        }).then((bundle) => {
            if (bundle) {
                app.log.info("分包加载完成", bundle);
            }
        });
    }
}

