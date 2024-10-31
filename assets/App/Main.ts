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
        app.bundle.getBundle("Bundles", this.BundleLoadProgree).then((bundle) => {
            if (bundle) {
                app.log.info("分包加载完成", bundle);
            }
        });
    }
    BundleLoadProgree(arg0: number) {
        app.log.info("分包加载进度", arg0.toFixed(2), "%");
    }

}

