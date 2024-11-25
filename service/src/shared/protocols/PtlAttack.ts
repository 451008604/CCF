import { BaseRequest, BaseResponse, BaseConf } from "./base";

export interface ReqAttack extends BaseRequest {
    selfToken: string; // 自己token
    targetToken: string;// 目标token
}

export interface ResAttack extends BaseResponse {

}

export const conf: BaseConf = {

};