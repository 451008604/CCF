import { RoomModel } from "../global/data";
import { BaseRequest, BaseResponse, BaseConf } from "./base";

export interface ReqRoomList extends BaseRequest {
}

export interface ResRoomList extends BaseResponse {
    roomList: RoomModel[];
}

export const conf: BaseConf = {

};