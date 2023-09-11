import { RouteRecordRaw } from "vue-router";
import Layout from "layout/index.vue";
export const baseRoutes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/login",
    },
    /**登陆与注册页 */
    {
        path: "/login",
        component: () => import("pages/login/index.vue"),
    },
    /**首页 */
    {
        path: "/home",
        component: Layout,
        children: [
            {
                path: "chat",
                name: "Chat",
                component: () => import("pages/message/index.vue"),
            }
        ]
    }
]