<script setup lang="ts">
import sideBar from './components/SideBar/index.vue'
import { Search } from '@element-plus/icons-vue'
import { ref, reactive, onMounted, computed } from 'vue'
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router'
import { MessageInfo, getFhistoryMsg } from "api/message/index"

const router = useRouter();
const route = useRoute();
const store = useStore();
let scrollRef = ref();
let innerRef = ref()
const token = sessionStorage.getItem("Authorization");
var ws = new WebSocket('ws://222.196.37.70:8080/api/getwsconn', [token?.toString() || ''])
// 监听连接事件
onMounted(() => {

});
ws.onmessage = function (e) {
    console.log("服务器返回的信息：" + e.data)
}
const historyMessagelist = reactive<Array<MessageInfo>>([])
const handleHistoryMessage = async (id: number) => {
    try {
        router.push({ name: "Chat", query: { fid: id } })
        const res = await getFhistoryMsg({ fid: id })
        historyMessagelist.length = 0;
        let t = res.msgList.filter((item: MessageInfo) => item.content != '')
        historyMessagelist.push(...t)
        console.log(historyMessagelist)
    }
    catch {
        console.log('获取历史消息失败')
    }
}
const search = ref('')
const isSearch = ref(false)
const isFocus = ref(false)
const isSearchList = ref(false)
const history = ref(false)
const types = reactive(['', 'success', 'info', 'waring', 'danger'])
const searchList = ref(["暂无数据"])
const historySearchList = reactive([{
    type: 'info',
    name: 'fyq'
}])
const removeAllHistory = () => {
    localStorage.removeItem("searchHistory")
}
const focus = () => {
    isFocus.value = true;
    historySearchList.length = 0;
    if (JSON.parse(localStorage.getItem("searchHistory") || "0") == "0")
        historySearchList.length = 0;
    else
        historySearchList.push(...JSON.parse(localStorage.getItem("searchHistory") || "0"))
    history.value = historySearchList.length == 0 ? false : true;
}
let timer: any;
const blur = () => {
    timer = setTimeout(() => {
        isFocus.value = false;
    }, 300)
}
const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min)) + min;
}
const searchHandle = () => {
    const n = getRandomInt(0, 5);
    let exist = historySearchList.filter((value) => {
        return value.name === search.value
    }).length == 0 ? false : true;
    if (!exist) {
        historySearchList.push({ name: search.value, type: types[n] })
        localStorage.setItem("searchHistory", JSON.stringify(historySearchList))
    }
    history.value = historySearchList.length == 0 ? false : true;
}
const isHistorySearch = () => {
    return isFocus.value && !search
}
const closeHander = (search: any) => {
    historySearchList.splice(historySearchList.indexOf(search), 1)
    localStorage.setItem("searchHistory", JSON.stringify(historySearchList))
    if (historySearchList.length == 0) {
        history.value = false
    }
}
const enterSerchBoxHanlder = () => {
    clearTimeout(timer)
}
var key = computed(() => {
    return route.name !== undefined ? route.name?.toString() + new Date().toString() : route + new Date().toString();
})
</script>
<template>
    <div style="height: 100%;">
        <el-container style="height: 100%;">
            <el-aside width="5%">
                <sideBar />
            </el-aside>
            <el-aside>
                <el-input v-model="search" placeholder="搜索" :prefix-icon="Search" clearable @focus="focus" @blur="blur"
                    @keyup.enter.native="searchHandle" />
                <el-card @mouseenter="enterSerchBoxHanlder" v-if="isFocus" class="box-card" style="z-index:15">
                    <dl v-if="isHistorySearch">
                        <dt class="search-title" v-show="history">历史搜索</dt>
                        <el-tag v-for="(search, index) in historySearchList" :key="index" closable :type="search.type"
                            @close="closeHander(search)" style="margin-right:0%; margin-bottom:0%;">{{ search.name
                            }}</el-tag>
                    </dl>
                    <dl v-if="isSearchList">
                        <dd v-for="search in searchList">{{ search }}</dd>
                    </dl>
                </el-card>
                <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
                    text-color="#fff">
                    <el-menu-item v-for="item in store.state.friends" @click="handleHistoryMessage(item.fid)">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                        <span>{{ item.notes }}</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <router-view :key="key"></router-view>
        </el-container>

    </div>
</template>

<style>
.el-aside::-webkit-scrollbar {
    display: none;
}

.btn {
    position: relative;
    right: -47%;
    top: 2%;
}

.search-title {
    color: #bdbaba;
    font-size: 15px;
    position: fixed;
    left: 5%;
    top: 4%;
}

.remove-history {
    color: #bdbaba;
    font-size: 15px;
    float: right;
    margin-top: 0px;
}

.el-card__body {
    padding: 0;
}

.el-card__body {}
</style>