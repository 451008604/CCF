import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    start() {
        app.log.info("进入主场景");


        app.data.setData("abc", 123);

        app.log.info(app.data.getText("abc"));


        // 事件测试
        app.event.add(10001, (data: any) => {
            app.log.info("测试事件", data);
        }, this);

        // 事件测试
        app.event.add(10001, (data: any) => {
            app.log.info("测试事件", data);
        }, this);

        app.event.send(10001, "66666");
    }

    update(deltaTime: number) {

    }

    protected onLoad(): void {
        // app.res.loadResDir("Bundles", (completedCount, totalCount, item) => {
        //     app.log.info("分包加载进度", (completedCount / totalCount).toFixed(2), "%");
        // }).then((bundle) => {
        //     if (bundle) {
        //         app.log.info("分包加载完成", bundle);
        //     }
        // });
    }
}

