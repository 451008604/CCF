import { BaseRequest, BaseResponse, BaseConf } from "./base";

export interface ReqUserSelect extends BaseRequest {
    idx: number; // 选择的索引（0 or 1）
}

export interface ResUserSelect extends BaseResponse {

}

export const conf: BaseConf = {

};