import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { ElMessage } from "element-plus";
import { FriendInfo } from "@/api/user";

declare module "axios" {
    interface AxiosResponse<T = any> {
        token: string;
        message: string
        firendsList: any
        msgList: any
        friendname: string
        username: string
        // 这里追加你的参数
    }
    export function create(config?: AxiosRequestConfig): AxiosInstance;
}


//创建Axios实例
const request = axios.create({
    baseURL: 'http://222.196.37.70:8080',
    timeout: 1000 * 90,
})

//请求拦截器
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem("Authorization");
    if (token) {
        config.headers!.Authorization = token;//!.非空断言操作符
    }
    return config;
});


request.interceptors.response.use((res: AxiosResponse) => {
    if (res.status === 200) {
        //josn请求
        const contentType = res.headers["content-type"];//"application/json;charst=UTF-8"

        //判断为普通请求还是文件下载
        if (contentType.includes("application/json") === true) {
            return res.data;
        } else {
            //文件下载 appliction/octet-stream
            return res;
        }
    } else {
        console.log('error');
        ElMessage.error({
            type: "error",
            message: res.data.message || "服务器错误"
        });
        return Promise.reject(res.data.data)
    }

},
    (error) => {
        console.log(error);
        //token过期
        if (error.response?.status === 401) {
            sessionStorage.removeItem("Authorization");
            //路由跳转回登录界面

            //记录当前路由，用户重新登录后跳转回当前界面

        }
        ElMessage.error({
            type: error,
            message: error.response?.data?.message || error.message || "服务器错误"
        });
        return Promise.reject(error);
    });

export default request;