import { UserModel } from "../global/data";
import { BaseRequest, BaseResponse, BaseConf } from "./base";

export interface ReqJoinRoom extends BaseRequest {
    roomId: string;
    userInfo: UserModel;
}

export interface ResJoinRoom extends BaseResponse {

}

export const conf: BaseConf = {

};