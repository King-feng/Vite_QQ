import request from "@/utils/request";
import { LocationQueryValue } from "vue-router";
/**好友聊天信息 */
export interface MessageInfo {
    ID?: number;
    fromid?: number;//发送者id
    fromname?: string;//发送者昵称
    targetid?: number;//消息接收者id
    targetname?: string;//消息接收者昵称
    msgtype?: number;//消息种类：1,文字 2,图片 3,视频
    msgkind?: number;//消息类型：1,私聊 2,群聊 3,系统
    content?: string;//消息内容
}
//获取与好友的历史消息
export const getFhistoryMsg = (params: { fid: number | LocationQueryValue[] | LocationQueryValue }) => {
    return request({
        url: "/api/getFhistoryMsg",
        method: "get",
        params
    })
}