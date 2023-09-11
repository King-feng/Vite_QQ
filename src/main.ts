import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'animate.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "./router/index";
import { store } from './store'
import VueNativeSock from "vue-native-websocket-vue3";


const app = createApp(App);
app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(VueNativeSock, "ws://222.196.37.70:8080/api/getwsconn", {
    connectManually: true, // 手动连接
    format: 'json', // json格式
    reconnection: true, // 是否自动重连
    reconnectionAttempts: 5, // 自动重连次数
    reconnectionDelay: 2000, // 重连间隔时间
});
app.mount('#app')
