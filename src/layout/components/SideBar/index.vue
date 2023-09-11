<script setup lang="ts">
import {
    Avatar,
    ChatDotRound,
    Menu,
    ChatRound
} from '@element-plus/icons-vue'
import { reactive, toRefs } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const visible = ref(false)
const visibler = ref(false)
const triggerRef = ref({
    getBoundingClientRect() {
        return position.value
    },
})
const position = ref({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
})
const mousemoveHandler = (e: any) => {
    position.value = DOMRect.fromRect({
        width: 0,
        height: 0,
        x: e.clientX,
        y: e.clientY,
    })
}
onMounted(() => {
    document.addEventListener('mousemove', mousemoveHandler)
})

onUnmounted(() => {
    document.removeEventListener('mousemove', mousemoveHandler)
})
const state = reactive({
    squareUrl:
        'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    sizeList: ['small', '', 'large'] as const,
})

const { squareUrl, sizeList } = toRefs(state)
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const showMessage = () => {
    store.dispatch('getfriend')
}
</script>

<template>
    <el-menu default-active="1" @open="handleOpen" @close="handleClose" style="height:93%;" :collapse="true">
        <div class="img">
            <el-avatar shape="square" :size="50" :src="squareUrl" style="top: 50%;" />
        </div>
        <el-menu-item index="1" @click="showMessage" style="--el-menu-hover-bg-color:transparent ;top: 0.5%;">
            <el-tooltip v-model:visible="visible" content="消息" placement="bottom" effect="light" virtual-triggering
                :virtual-ref="triggerRef" />
            <el-icon :size="50" @mouseenter="visible = !visible" @mouseleave="visible = !visible" color="#409EFC">
                <ChatDotRound v-show="visible" />
                <ChatRound v-show="!visible" />
            </el-icon>
        </el-menu-item>
        <el-menu-item index="2" style="--el-menu-hover-bg-color:transparent ;">
            <el-tooltip v-model:visible="visibler" content="联系人" placement="bottom" effect="light" virtual-triggering
                :virtual-ref="triggerRef" />
            <el-icon :size="50" @mouseenter="visibler = !visibler" @mouseleave="visibler = !visibler">
                <Avatar />
            </el-icon>
        </el-menu-item>
    </el-menu>
    <el-menu default-active="2" :collapse="true" @open="handleOpen" @close="handleClose">
        <el-sub-menu index="1">
            <template #title>
                <el-icon :size="50">
                    <Menu />
                </el-icon>
            </template>
            <el-menu-item-group>
                <el-menu-item>切换账号</el-menu-item>
                <el-menu-item>退出</el-menu-item>
            </el-menu-item-group>
        </el-sub-menu>
    </el-menu>
</template>

<style scoped>
.img {
    position: relative;
    top: 0.5%;
}
</style>