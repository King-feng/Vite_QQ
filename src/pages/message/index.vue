<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { MessageInfo, getFhistoryMsg } from "api/message/index"
import { useRoute } from 'vue-router'
import { useStore } from 'vuex';


const store = useStore()
const route = useRoute()
let scrollRef = ref();
let innerRef = ref();
const token = sessionStorage.getItem("Authorization");
var ws = new WebSocket('ws://222.196.37.70:8080/api/getwsconn', [token?.toString() || ''])
const input = ref('')
const fname = ref("")
const name = ref("")
let submitCode = {
    Fromid: store.state.uid,
    Targetid: Number(route.query.fid),
    Msgtype: 1,
    Msgkind: 1,
    Content: '',
};
ws.onmessage = function (e) {
    console.log("服务器返回的信息：" + e.data);
    setTimeout(() => {
        handleHistoryMessage()
    }, 100)
}
onMounted(() => {
    historyMessagelist.length = 0;
    fname.value = '';
    name.value = '';
    handleHistoryMessage();
})
const sendMessage = () => {
    submitCode.Content = input.value
    ws.send(JSON.stringify(submitCode));
    input.value = '';
    setTimeout(() => {
        handleHistoryMessage()
    }, 100)
}
const historyMessagelist = reactive<Array<MessageInfo>>([])
const handleHistoryMessage = async () => {
    try {
        const res = await getFhistoryMsg({ fid: route.query.fid })
        historyMessagelist.length = 0;
        fname.value = res.friendname;
        name.value = res.username;
        let t = res.msgList.filter((item: MessageInfo) => item.content != '')
        historyMessagelist.push(...t)
        setTimeout(() => {
            scrollRef.value!.setScrollTop(innerRef.value.clientHeight)
        }, 20)
        console.log(historyMessagelist)
    }
    catch {
        console.log('获取历史消息失败')
    }
}
</script>

<template>
    <el-container style="background-color: rgb(246, 247, 247);">
        <el-header style="background-color: rgb(238, 243, 243);text-align:center;vertical-align: middle;padding: 15px;">
            {{ fname }}
        </el-header>
        <el-main>
            <el-scrollbar max-height="600px" ref="scrollRef">
                <div class="chat-content" ref="innerRef">
                    <div v-for="(itemc, indexc) in historyMessagelist" :key="indexc">
                        <div class="word" v-if="itemc.fromid != store.state.uid">
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                            <div class="info">
                                <p class="time">{{ fname }}</p>
                                <div class="info-content">{{ itemc.content }}</div>
                            </div>
                        </div>

                        <div class="word-my" v-else>
                            <div class="info">
                                <p class="time">{{ name }}</p>
                                <div class="info-content">{{ itemc.content }}</div>
                            </div>
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                        </div>
                    </div>
                </div>
            </el-scrollbar>
        </el-main>
        <el-divider />
        <el-footer style="height: 17%;padding: 0;">
            <el-input v-model="input" style="margin-left: 0;" type="textarea" :autosize="{ minRows: 4, maxRows: 4 }">
            </el-input>
            <el-button class="btn" @click="sendMessage">发送</el-button>
        </el-footer>
    </el-container>
</template>

<style scoped>
.chat-content {

    .word {
        display: flex;
        margin-bottom: 20px;

        .info {
            margin-left: 10px;

            .time {
                font-size: 12px;
                color: rgba(51, 51, 51, 0.8);
                margin: 0;
                height: 20px;
                line-height: 20px;
                margin-top: -5px;
            }

            .info-content {
                padding: 10px;
                font-size: 14px;
                background: #a6a7eb;
                position: relative;
                margin-top: 8px;
                border-radius: 5%;
            }

            .info-content::before {
                position: absolute;
                left: -8px;
                top: 8px;
                content: '';
                border-right: 10px solid #a6a7eb;
                border-top: 8px solid transparent;
                border-bottom: 8px solid transparent;
            }
        }
    }

    .word-my {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;

        .info {
            width: 90%;
            margin-left: 10px;
            text-align: right;

            .time {
                font-size: 12px;
                color: rgba(51, 51, 51, 0.8);
                margin: 0;
                height: 20px;
                line-height: 20px;
                margin-top: -5px;
                margin-right: 10px;
            }

            .info-content {
                max-width: 70%;
                padding: 10px;
                font-size: 14px;
                float: right;
                margin-right: 10px;
                position: relative;
                margin-top: 8px;
                background: #A3C3F6;
                text-align: left;
                border-radius: 5%;
            }

            .info-content::after {
                position: absolute;
                right: -8px;
                top: 8px;
                content: '';
                border-left: 10px solid #A3C3F6;
                border-top: 8px solid transparent;
                border-bottom: 8px solid transparent;
            }
        }
    }
}
</style>