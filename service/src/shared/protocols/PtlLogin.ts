import { IUserModel } from "../global/data";
import { BaseRequest, BaseResponse, BaseConf } from "./base";

export interface ReqLogin extends BaseRequest {
    userInfo: IUserModel;
}

export interface ResLogin extends BaseResponse {
}

export const conf: BaseConf = {

};
