import { _decorator, BlockInputEvents, Canvas, color, director, Graphics, instantiate, Label, Node, Prefab, tween, UIOpacity, UITransform, v3, Widget } from 'cc';
import { LoadingView } from '../Components/LoadingView';
import { FrameEnumTipsPosition } from '../FrameEnum';

/**
 * 场景、弹窗管理器
 */
export class UIMgr {
    private constructor() { };
    static readonly instance: UIMgr = new UIMgr();

    /**游戏根节点 */
    private _rootNode: Node = null;
    private get rootNode(): Node {
        if (!this._rootNode) {
            app.log.err("未通过 app.ui.init() 初始化场景根节点");
        }
        return this._rootNode;
    }
    /**资源加载loading界面 */
    private loadingComponent: LoadingView = null;
    /**当前展示的场景 */
    private curShowScene: Node = null;

    /**场景层 */
    private sceneLayer: Node = null;
    /**菜单层 */
    private menuLayer: Node = null;
    /**弹出层 */
    private popupLayer: Node = null;
    /**提示层 */
    private tipsLayer: Node = null;
    /**顶层 */
    private topLayer: Node = null;


    /**
     * 初始化场景根节点
     * @param _rNode 场景根节点
     */
    init(_rNode: Node) {
        if (this._rootNode) {
            return;
        }
        this._rootNode = _rNode;

        this.sceneLayer = this.rootNode.getChildByName("SceneLayer");
        if (!this.sceneLayer) {
            app.log.warn("场景中未获取到名称为 SceneLayer 的节点！！！");
        }
        this.menuLayer = this.rootNode.getChildByName("MenuLayer");
        if (!this.menuLayer) {
            app.log.warn("场景中未获取到名称为 MenuLayer 的节点！！！");
        }
        this.popupLayer = this.rootNode.getChildByName("PopupLayer");
        if (!this.popupLayer) {
            app.log.warn("场景中未获取到名称为 PopupLayer 的节点！！！");
        }
        this.tipsLayer = this.rootNode.getChildByName("TipsLayer");
        if (!this.tipsLayer) {
            app.log.warn("场景中未获取到名称为 TipsLayer 的节点！！！");
        }
        this.topLayer = this.rootNode.getChildByName("TopLayer");
        if (!this.topLayer) {
            app.log.warn("场景中未获取到名称为 TopLayer 的节点！！！");
        }

        // 将root下的所有`层`节点适配宽高
        for (const element of this.rootNode.children) {
            if (element.name.indexOf("Layer") != -1) {
                const widget = element.addComponent(Widget);
                widget.isAlignTop = widget.isAlignBottom = widget.isAlignLeft = widget.isAlignRight = true;
                widget.top = widget.bottom = widget.left = widget.right = 0;
            }
        }

        // 将资源加载界面置于最顶层
        this.loadingComponent = this.rootNode.getComponentInChildren(LoadingView);
        if (this.loadingComponent) {
            this.rootNode.insertChild(this.loadingComponent.node, -1);
        }
    }

    /**
     * 切换展示场景预制体
     * @param scenePath 场景路径
     */
    switchScene(scenePath: string) {
        app.res.loadRes<Prefab>(scenePath, (progress: number) => {
            // 更新加载进度
            if (this.loadingComponent) {
                this.rootNode.insertChild(this.loadingComponent.node, -1);
                this.loadingComponent.node.active = true;
                this.loadingComponent.updateProgress(progress);
            }
        }).then(prefab => {
            if (this.loadingComponent) {
                this.loadingComponent.node.active = false;
            }
            // 移除上一个场景
            this.sceneLayer.removeChild(this.curShowScene);
            this.curShowScene?.destroy();
            // 加载新的场景
            const sceneNode = instantiate(prefab);
            this.sceneLayer.addChild(sceneNode);
            this.curShowScene = sceneNode;
        });
    }

    /**
     * 打开弹窗
     * @param viewPath 弹窗视图预制体路径
     */
    openPopup(viewPath: string) {
        app.res.loadRes<Prefab>(viewPath).then((prefab) => {
            // 防止点击穿透
            if (!this.popupLayer.getComponent(BlockInputEvents)) {
                this.popupLayer.addComponent(BlockInputEvents);
            }
            this.popupLayer.addChild(instantiate(prefab));
        });
    }

    /**
     * 关闭弹窗
     * @param childUuid 弹窗节点uuid
     */
    closePopup(childUuid: string) {
        const node = this.popupLayer.getChildByUuid(childUuid);
        this.popupLayer.removeChild(node);
        node?.destroy();
        // 子节点清空时允许点击穿透
        if (this.popupLayer.children.length == 0) {
            this.popupLayer.getComponent(BlockInputEvents)?.destroy();
        }
    }


    /**
     * 展示提示内容
     * @param text 提示的文字
     * @param param1 可选配置项
     */
    showTips(text: string = '', { gravity = FrameEnumTipsPosition.CENTER, duration = 1, bg_color = color(102, 102, 102, 255) } = {}) {
        let canvas = this.tipsLayer || director.getScene().getComponentInChildren(Canvas).node;
        let canvasTransform = canvas.getComponent(UITransform);
        let width = canvasTransform.width;
        let height = canvasTransform.height;

        // Lable文本格式设置
        let textNode = new Node();
        let textLabel = textNode.addComponent(Label);
        let textTransform = textNode.addComponent(UITransform);
        textLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
        textLabel.verticalAlign = Label.VerticalAlign.CENTER;
        textLabel.fontSize = 30;
        textLabel.string = text;

        // 当文本宽度过长时，设置为自动换行格式
        if (text.length * textLabel.fontSize > (width * 3) / 5) {
            textLabel.overflow = Label.Overflow.RESIZE_HEIGHT;
        } else {
            textTransform.width = text.length * textLabel.fontSize;
        }
        let lineCount = ~~((text.length * textLabel.fontSize) / ((width * 3) / 5)) + 1;
        textTransform.height = textLabel.fontSize * lineCount;

        // 背景设置
        let bgNode = new Node();
        let ctx = bgNode.addComponent(Graphics);
        let bgNodeOpacity = bgNode.addComponent(UIOpacity);
        ctx.arc(-textTransform.width / 2, 0, textTransform.height / 2 + 20, 0.5 * Math.PI, 1.5 * Math.PI, true);
        ctx.lineTo(textTransform.width / 2, -(textTransform.height / 2 + 20));
        ctx.arc(textTransform.width / 2, 0, textTransform.height / 2 + 20, 1.5 * Math.PI, 0.5 * Math.PI, true);
        ctx.lineTo(-textTransform.width / 2, textTransform.height / 2 + 20);
        ctx.fillColor = bg_color;
        ctx.fill();

        // gravity 设置tips显示的位置
        if (gravity === FrameEnumTipsPosition.CENTER) {
            bgNode.setPosition(v3(0, 0, 0));
        } else if (gravity === FrameEnumTipsPosition.TOP) {
            bgNode.setPosition(bgNode.getPosition().add(v3(0, (height / 5) * 2, 0)));
        } else if (gravity === FrameEnumTipsPosition.BOTTOM) {
            bgNode.setPosition(bgNode.getPosition().subtract(v3(0, (height / 5) * 2, 0)));
        }

        bgNode.addChild(textNode);
        canvas.addChild(bgNode);
        // 执行动画
        tween(bgNodeOpacity).delay(duration).to(.5, { opacity: 0 }).start();
        tween(bgNode).delay(duration).by(.5, { position: v3(0, 100, 0) }).destroySelf().start();
    }

}
