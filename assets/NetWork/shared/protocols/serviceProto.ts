import { ServiceProto } from 'tsrpc-proto';
import { MsgRoomUpdate } from './MsgRoomUpdate';
import { ReqCode2Session, ResCode2Session } from './PtlCode2Session';
import { ReqJoinRoom, ResJoinRoom } from './PtlJoinRoom';
import { ReqLogin, ResLogin } from './PtlLogin';
import { ReqRoomList, ResRoomList } from './PtlRoomList';

export interface ServiceType {
    api: {
        "Code2Session": {
            req: ReqCode2Session,
            res: ResCode2Session
        },
        "JoinRoom": {
            req: ReqJoinRoom,
            res: ResJoinRoom
        },
        "Login": {
            req: ReqLogin,
            res: ResLogin
        },
        "RoomList": {
            req: ReqRoomList,
            res: ResRoomList
        }
    },
    msg: {
        "RoomUpdate": MsgRoomUpdate
    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 11,
    "services": [
        {
            "id": 3,
            "name": "RoomUpdate",
            "type": "msg"
        },
        {
            "id": 4,
            "name": "Code2Session",
            "type": "api",
            "conf": {}
        },
        {
            "id": 6,
            "name": "JoinRoom",
            "type": "api",
            "conf": {}
        },
        {
            "id": 2,
            "name": "Login",
            "type": "api",
            "conf": {}
        },
        {
            "id": 5,
            "name": "RoomList",
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
                        "target": "../global/data/RoomModel"
                    }
                }
            ]
        },
        "../global/data/RoomModel": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "roomId",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "roomStatus",
                    "type": {
                        "type": "Reference",
                        "target": "../global/data/RoomStatus"
                    }
                },
                {
                    "id": 2,
                    "name": "users",
                    "type": {
                        "type": "Interface",
                        "indexSignature": {
                            "keyType": "String",
                            "type": {
                                "type": "Reference",
                                "target": "../global/data/UserModel"
                            }
                        }
                    }
                }
            ]
        },
        "../global/data/RoomStatus": {
            "type": "Enum",
            "members": [
                {
                    "id": 0,
                    "value": 0
                },
                {
                    "id": 1,
                    "value": 1
                },
                {
                    "id": 2,
                    "value": 2
                }
            ]
        },
        "../global/data/UserModel": {
            "type": "Interface",
            "properties": [
                {
                    "id": 5,
                    "name": "userId",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 2,
                    "name": "token",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 3,
                    "name": "userName",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 4,
                    "name": "headImg",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "PtlCode2Session/ReqCode2Session": {
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
                    "name": "jsCode",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "base/BaseRequest": {
            "type": "Interface"
        },
        "PtlCode2Session/ResCode2Session": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "openid",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "base/BaseResponse": {
            "type": "Interface"
        },
        "PtlJoinRoom/ReqJoinRoom": {
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
                    "name": "roomId",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "userInfo",
                    "type": {
                        "type": "Reference",
                        "target": "../global/data/UserModel"
                    }
                }
            ]
        },
        "PtlJoinRoom/ResJoinRoom": {
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
                        "target": "../global/data/UserModel"
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
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "userInfo",
                    "type": {
                        "type": "Reference",
                        "target": "../global/data/UserModel"
                    }
                }
            ]
        },
        "PtlRoomList/ReqRoomList": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "PtlRoomList/ResRoomList": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "roomList",
                    "type": {
                        "type": "Array",
                        "elementType": {
                            "type": "Reference",
                            "target": "../global/data/RoomModel"
                        }
                    }
                }
            ]
        }
    }
};