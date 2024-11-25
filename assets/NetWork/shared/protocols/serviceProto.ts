import { ServiceProto } from 'tsrpc-proto';
import { MsgAttack } from './MsgAttack';
import { MsgRoomUpdate } from './MsgRoomUpdate';
import { ReqAttack, ResAttack } from './PtlAttack';
import { ReqLogin, ResLogin } from './PtlLogin';

export interface ServiceType {
    api: {
        "Attack": {
            req: ReqAttack,
            res: ResAttack
        },
        "Login": {
            req: ReqLogin,
            res: ResLogin
        }
    },
    msg: {
        "Attack": MsgAttack,
        "RoomUpdate": MsgRoomUpdate
    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 7,
    "services": [
        {
            "id": 0,
            "name": "Attack",
            "type": "msg"
        },
        {
            "id": 3,
            "name": "RoomUpdate",
            "type": "msg"
        },
        {
            "id": 4,
            "name": "Attack",
            "type": "api",
            "conf": {}
        },
        {
            "id": 2,
            "name": "Login",
            "type": "api",
            "conf": {}
        }
    ],
    "types": {
        "MsgAttack/MsgAttack": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "attackUser",
                    "type": {
                        "type": "Reference",
                        "target": "../global/data/IUserModel"
                    }
                },
                {
                    "id": 1,
                    "name": "targetUser",
                    "type": {
                        "type": "Reference",
                        "target": "../global/data/IUserModel"
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
        "PtlAttack/ReqAttack": {
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
                    "name": "selfToken",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "targetToken",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "base/BaseRequest": {
            "type": "Interface"
        },
        "PtlAttack/ResAttack": {
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
        }
    }
};