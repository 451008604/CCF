import { IUserModel } from "../global/data";

export interface MsgAttack {
    attackUser: IUserModel;
    targetUser: IUserModel;
}
