import { _decorator, Label, Node, Sprite } from 'cc';
import { NodePaths } from 'db://assets/Core/NodePaths';
import { ResPaths } from 'db://assets/Core/ResPaths';
import { ComponentBase } from 'db://assets/Core/Scripts/Components/ComponentBase';
import { Json } from 'db://assets/Core/Scripts/Utils/Json';
import { DataManager } from 'db://assets/Model/DataManager';
import { RoomModel, RoomStatus } from 'db://assets/NetWork/shared/global/data';
import { ServiceType } from 'db://assets/NetWork/shared/protocols/serviceProto';
const { ccclass, property } = _decorator;

@ccclass('HallItem4')
export class HallItem4 extends ComponentBase {
    private _info: any;

    protected netWorkHandler(msgId: keyof ServiceType['msg'], msgBody: ServiceType['msg'][keyof ServiceType['msg']]): void {
        switch (msgId) {
            case "RoomUpdate":
                if (DataManager.roomModel.roomStatus != RoomStatus.GAME_START) {
                    DataManager.roomModel = msgBody.roomInfo;
                    app.ui.switchScene(ResPaths.GameBundle.GameScenePrefab);
                }
                break;
        }
    }

    setStyle(t: number) {
        if (t == 0) {
            this.getChild(NodePaths.HallItem4Prefab.Node).active = !(this.getChild(NodePaths.HallItem4Prefab.Node001).active = true);
            this.bindNodeClickHandler(NodePaths.HallItem4Prefab['Node001_组 124'], this.createTable);
        } else {
            this.getChild(NodePaths.HallItem4Prefab.Node001).active = !(this.getChild(NodePaths.HallItem4Prefab.Node).active = true);
            this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
        }
    }

    async onClick() {
        const resData = Json.parse(await app.network.request(app.config.getServerAddress() + "/joinCardTable", { user_id: DataManager.selfModel.userId, code: this._info.code }));
        if (resData) {
            if (resData.code == 1000) {
                const client = await app.network.client();
                client.callApi("JoinRoom", { roomId: "" + this._info.code, userInfo: DataManager.selfModel, peopleNum: this._info.people_num });
            } else {
                app.ui.showTips(resData.message);
            }
        }
    }

    createTable() {
        app.ui.openPanel(ResPaths.MainBundle.HallTableCreatePrefab);
    }

    async setData(info: any) {
        this._info = info;
        const resData = Json.parse(await app.network.request(app.config.getServerAddress() + "/getCardTableUser", { card_table_id: info.id }));
        let userNum = 0;
        if (resData) {
            if (resData.code == 1000) {
                userNum = resData.data.length;
                for (const user of resData.data) {
                    if (user.user_id == DataManager.selfModel.userId) {
                        const client = await app.network.client();
                        client.callApi("JoinRoom", { roomId: "" + this._info.code, userInfo: DataManager.selfModel, peopleNum: this._info.people_num });
                        break;
                    }
                }
            } else {
                app.ui.showTips(resData.message);
            }
        }

        // 刷新座位头像
        for (let i = 0; i < 8; i++) {
            this.getChild(NodePaths.HallItem4Prefab[`Node_Node_椅子00${i + 1}_默认头像`]).active = false;
            if (i < userNum) {
                this.getChild(NodePaths.HallItem4Prefab[`Node_Node_椅子00${i + 1}_默认头像`]).active = true;
            }
        }

        this.getChild(NodePaths.HallItem4Prefab.Node_Label).getComponent(Label).string = "" + info.name;
        this.getChild(NodePaths.HallItem4Prefab.Node_文本框2_Label).getComponent(Label).string = `猜盲盒：${userNum}/${info.people_num}`;
    }

}

