import { _decorator, Director, director, instantiate, misc, Node, Prefab } from 'cc';
import { FrameEnumEventMsgID } from '../FrameEnum';
import { EDITOR } from 'cc/env';
import { LoadingView } from '../Components/LoadingView';


/**
 * 场景、弹窗管理器
 */
export class UIMgr {
    private constructor() {
        if (!EDITOR) {
            director.once(Director.EVENT_AFTER_SCENE_LAUNCH, () => {
                app.event.addListen(FrameEnumEventMsgID.SwitchScenePrefab, this.switchScenePrefab, this);
            }, this);
        }
    };
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

        // 将资源加载界面置于最顶层
        this.loadingComponent = this.rootNode.getComponentInChildren(LoadingView);
        if (this.loadingComponent) {
            this.rootNode.insertChild(this.loadingComponent.node, -1);
        }

        console.log(this.rootNode.children);
    }

    /**
     * 切换展示场景预制体
     * @param scenePath 场景路径
     */
    private switchScenePrefab(scenePath: string) {
        app.res.loadRes(scenePath, (progress: number) => {
            // 更新加载进度
            if (this.loadingComponent) {
                this.rootNode.insertChild(this.loadingComponent.node, -1);
                this.loadingComponent.node.active = true;
                this.loadingComponent.updateProgress(progress);
            }
        }).then(newScenePrefab => {
            if (newScenePrefab instanceof Prefab) {
                if (this.loadingComponent) {
                    this.loadingComponent.node.active = false;
                }
                // 移除上一个场景
                this.sceneLayer.removeChild(this.curShowScene);
                this.curShowScene?.destroy();
                // 加载新的场景
                const sceneNode = instantiate(newScenePrefab);
                this.sceneLayer.addChild(sceneNode);
                this.curShowScene = sceneNode;
            }
        });
    }

    /**
     * 展示弹窗
     */
    showPop() {

    }

}
