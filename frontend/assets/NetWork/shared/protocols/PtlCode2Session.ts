import { BaseRequest, BaseResponse, BaseConf } from "./base";

export interface ReqCode2Session extends BaseRequest {
    jsCode: string;
}

export interface ResCode2Session extends BaseResponse {
    openid: string;
}

export const conf: BaseConf = {

};