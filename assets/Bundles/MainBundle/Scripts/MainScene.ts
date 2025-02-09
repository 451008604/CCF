import { __private, _decorator, Label, Node } from 'cc';
import { ComponentBase } from '../../../Core/Scripts/Components/ComponentBase';
import { ResPaths } from 'db://assets/Core/ResPaths';
import { NodePaths } from 'db://assets/Core/NodePaths';
import { RoomModel, RoomStatus } from 'db://assets/NetWork/shared/global/data';
import { DataManager } from 'db://assets/Model/DataManager';
import { ServiceType } from 'db://assets/NetWork/shared/protocols/serviceProto';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends ComponentBase {

    protected onLoadAfter(): void {
        app.ui.setBackground(ResPaths.MainBundle.BgPng);

        this.node.getChildByPath(NodePaths.MainScenePrefab.开始有些).on(Node.EventType.TOUCH_END, this.startHall, this);
    }

    protected netWorkHandler(msgId: keyof ServiceType['msg'], msgBody: ServiceType['msg'][keyof ServiceType['msg']]): void {
        switch (msgId) {
            case "RoomUpdate":
                if (DataManager.roomModel.roomStatus != RoomStatus.GAME_START && msgBody.roomInfo.roomStatus == RoomStatus.GAME_START) {
                    DataManager.roomModel = msgBody.roomInfo;
                    app.ui.switchScene(ResPaths.GameBundle.GameScenePrefab);
                }
                break;
        }
    }

    async startHall() {
        const client = await app.network.client();
        const roomList = (await client.callApi("RoomList", {})).res.roomList;
        let room: RoomModel;
        for (const r of roomList) {
            if (r.roomStatus == RoomStatus.GAME_WAIT) {
                room = r;
                break;
            }
        }
        client.callApi("JoinRoom", { roomId: room ? room.roomId : "", userInfo: DataManager.selfModel });

    }

    start() {
        this.node.getChildByPath(NodePaths.MainScenePrefab.头像框_Label).getComponent(Label).string = DataManager.selfModel.userName;
        this.node.getChildByPath(NodePaths.MainScenePrefab.头像框_Label001).getComponent(Label).string = "ID:" + DataManager.selfModel.userId;
        this.node.getChildByPath(NodePaths.MainScenePrefab.公告文字栏_Label).getComponent(Label).string = "暂无公告";
    }

    update(deltaTime: number) {

    }
}
