import { _decorator, Component, Label, Node } from 'cc';
import { NodePaths } from 'db://assets/Core/NodePaths';
import { ComponentBase } from 'db://assets/Core/Scripts/Components/ComponentBase';
import { Json } from 'db://assets/Core/Scripts/Utils/Json';
const { ccclass, property } = _decorator;

@ccclass('HallItem2')
export class HallItem2 extends ComponentBase {
    private _info: any;

    async setData(info: any) {
        this._info = info;

        this.getChild(NodePaths.HallItem2Prefab.Label).getComponent(Label).string = "" + info.nickname;
        this.getChild(NodePaths.HallItem2Prefab.Label001).getComponent(Label).string = "" + info.user_id;

        this.node.active = true;
    }
}

