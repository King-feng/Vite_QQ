import { createRouter, createWebHistory } from "vue-router";
import { baseRoutes } from "./routes";
const router = createRouter({
    history: createWebHistory(),
    routes: baseRoutes,
});
export default router;