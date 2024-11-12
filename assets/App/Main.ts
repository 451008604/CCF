import { _decorator, Component, log, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    start() {
        app.log.info("进入主场景");
        app.log.warn("进入主场景");
        app.log.err("进入主场景");


        app.data.setData("abc", 123);

        app.log.info(app.data.getText("abc"));


        // 事件测试
        app.event.addListen(10001, function (data: any) {
            app.log.info("测试事件", data, this);
        });

        // 事件测试
        app.event.addListen(10002, (data: any) => {
            app.log.info("测试事件", data, this);
        });


        new test(13).unListen();
        app.log.info(app.event);

        app.event.send(10001, "66666");
        app.event.send(10002, "66666");
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


class test {
    flag = 0;
    constructor(_flag) {
        this.flag = _flag;
        app.event.addListen(10001, this.listHandler.bind(this));
    }

    listHandler(data: any) {
        app.log.info(data, this.flag);
    }

    unListen() {
        app.log.info(app.event);
        app.event.removeListen(10001, this.listHandler.bind(this));
        app.log.info(app.event);
    }
}