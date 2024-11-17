import { _decorator, Component, Director, director, isValid, log, Node, NodeEventType } from 'cc';
import { ComponentBase } from '../Core/Scripts/ComponentBase';
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

    start() {
        app.log.info("进入主场景");

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
        app.log.info(this.flag, data);
    }

}
