import { ServiceProto } from 'tsrpc-proto';
import { MsgRoomUpdate } from './MsgRoomUpdate';
import { ReqLogin, ResLogin } from './PtlLogin';

export interface ServiceType {
    api: {
        "Login": {
            req: ReqLogin,
            res: ResLogin
        }
    },
    msg: {
        "RoomUpdate": MsgRoomUpdate
    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 8,
    "services": [
        {
            "id": 3,
            "name": "RoomUpdate",
            "type": "msg"
        },
        {
            "id": 2,
            "name": "Login",
            "type": "api",
            "conf": {}
        }
    ],
    "types": {
        "MsgRoomUpdate/MsgRoomUpdate": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "roomInfo",
                    "type": {
                        "type": "Reference",
                        "target": "../global/data/IRoomModel"
                    }
                }
            ]
        },
        "../global/data/IRoomModel": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "Users",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../global/data/IUserModel"
                        }
                    }
                }
            ]
        },
        "../global/data/IUserModel": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "ConnId",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "Token",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "UserName",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 4,
                    "name": "OtherData",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "PtlLogin/ReqLogin": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "userInfo",
                    "type": {
                        "type": "Reference",
                        "target": "../global/data/IUserModel"
                    }
                }
            ]
        },
        "base/BaseRequest": {
            "type": "Interface"
        },
        "PtlLogin/ResLogin": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ]
        },
        "base/BaseResponse": {
            "type": "Interface"
        }
    }
};