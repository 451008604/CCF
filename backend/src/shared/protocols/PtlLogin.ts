import { UserModel } from "../global/data";
import { BaseRequest, BaseResponse, BaseConf } from "./base";

export interface ReqLogin extends BaseRequest {
    userId: string;
}

export interface ResLogin extends BaseResponse {
    userInfo: UserModel;
}

export const conf: BaseConf = {

};
