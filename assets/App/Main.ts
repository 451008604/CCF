import { _decorator, Component, Enum, log, Node } from 'cc';
import { ComponentBase } from '../Core/Scripts/ComponentBase';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    start() {
        app.log.info("进入主场景");

        for (let i = 0; i < 10; i++) {
            let t = this.addComponent(test);
            t.init(i);
            t.destroy();
            let t1 = this.addComponent(test1);
            t1.init(i);
            t1.destroy();
        }


        console.log(app.event);

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

const a = 10001;
class test extends ComponentBase {
    flag = 0;

    init(_flag: number) {
        this.flag = _flag;

        this.addListen(a, this.listHandler);
    }

    listHandler(data: any) {
        app.log.info(data, this.flag);
    }

    onDestroy(): void {

    }
}


class test1 extends ComponentBase {
    flag = 0;

    init(_flag: number) {
        this.flag = _flag;

        this.addListen(a, this.listHandler);
    }

    listHandler(data: any) {
        app.log.info(data, this.flag);
    }

}
