import request from "@/utils/request";

/**用户的信息 */
export interface UserInfo {
    id?: number;
    phone?: string; //电话
    username?: string; //用户名
    newUsername?: string; //新用户名
    password: string; //密码
    newPassword?: string; //新密码(重置密码)
    repassword?: string; //重复密码(注册)
    oldpassword?: string; //旧密码(修改)
}
/**好友信息 */
export interface FriendInfo {
    ID?: number;
    uid?: number;
    fid?: number;
    notes?: string; //备注
}

//注册
export const register = (data: UserInfo) => {
    return request({
        url: "/api/addUser",
        method: "post",
        data,
    });
};
//登录
export const login = (data: UserInfo) => {
    return request({
        url: "/api/login",
        method: "post",
        data,
    });
};
//获取好友列表
export const getFriends = () => {
    return request({
        url: "/api/getfriends",
        method: "get"
    })
}