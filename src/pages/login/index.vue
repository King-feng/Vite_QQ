<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { UserInfo, register, login } from "api/user/index";
import router from "@/router";
import * as XLSX from "xlsx-js-style";
var aoa = [
    ['主要信息', null, null, null], // 特别注意合并的地方后面预留3个null
    ['姓名', '性别', '年龄', '注册时间'],
    ['张三', '男', 18, new Date()],
    ['李四', '女', 22, new Date()]
];
var sheet = XLSX.utils.aoa_to_sheet(aoa);
sheet['!merges'] = [
    // 设置A1-C1的单元格合并
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }
];
sheet['A1'].s = {
    font: { bold: true },
    alignment: { horizontal: "center" },
    fill: { fgColor: { rgb: "FFFF0000" } },
}

const filename = '导出合并单元格的表格.xlsx'
// Excel第一个sheet的名称
const ws_name = 'Sheet1'
const wb = XLSX.utils.book_new()

onMounted(() => {
    // XLSX.utils.book_append_sheet(wb, sheet, ws_name) // 将数据添加到工作薄
    // XLSX.writeFile(wb, filename) // 导出Excel
})
const userInfo = reactive<UserInfo>({
    phone: "",
    password: "",
})
const signInfo = reactive<UserInfo>({
    phone: "",
    username: "",
    oldpassword: "123456",
    password: "",
    repassword: ""
})
const isFocusedu = ref(false)
const isFocusede = ref(false)
const isFocusedp = ref(false)
const isFocusedcp = ref(false)
const isSignUp = ref(false)
/**失去焦点后改变样式 */
const handleBlur = (value: UserInfo) => {
    if (value.username == '')
        isFocusedu.value = false;
    if (value.phone == '')
        isFocusede.value = false;
    if (value.password == '')
        isFocusedp.value = false;
    if (value.repassword == '')
        isFocusedcp.value = false;
}
/**聚焦后改变样式 */
const addFocusClass = (value: string) => {
    if (value === 'text')
        isFocusedu.value = true;
    if (value === 'phone')
        isFocusede.value = true;
    if (value === 'password')
        isFocusedp.value = true;
    if (value === 'repeatpassword')
        isFocusedcp.value = true;
}
/**注册 */
const handleSign = async (value: UserInfo) => {
    try {
        const res = await register(value)
        if (res.status === 200) {
            ElMessage({
                type: 'success',
                message: "注册成功"
            })
            signInfo.username = ''

        }
        else
            ElMessage.error({
                type: "error",
                message: res.message
            });
    } catch {
        console.log("注册失败")
    }
}
/**登录 */
const handleLogin = async (value: UserInfo) => {
    try {
        const res = await login(value)
        if (res.status === 200) {
            sessionStorage.setItem("Authorization", res.token)
            router.push({
                path: '/home'
            })
        } else {
            ElMessage.error({
                type: "error",
                message: res.message
            });
        }
    } catch {
        console.log("登录失败")
    }
}
/**切换后复位 */
const change = (obj: UserInfo) => {
    isSignUp.value = !isSignUp.value;
    for (var key in obj) {
        obj[key] = '';
    }
    isFocusedu.value = false;
    isFocusede.value = false;
    isFocusedp.value = false;
    isFocusedcp.value = false;
    signInfo.username = '';
    signInfo.phone = '';
    signInfo.password = '';
    signInfo.repassword = '';
}
</script>
<template>
    <div class="body">
        <div class="container animate__animated animate__backInDown " id="login-box"
            :class="{ 'right-panel-active': isSignUp }">


            <div class="form-container sign-up-container">
                <el-form>
                    <h1>注册</h1>
                    <div class="txtb" :class="{ txtb1: isFocusedu }">
                        <input type="text" v-model="signInfo.username" @blur="handleBlur(signInfo)"
                            v-on:focus="addFocusClass('text')">
                        <span data-placeholder="Useranme"></span>
                    </div>
                    <div class="txtb" :class="{ txtb1: isFocusede }">
                        <input type="phone" v-model="signInfo.phone" @blur="handleBlur(signInfo)"
                            v-on:focus="addFocusClass('phone')">
                        <span data-placeholder="Phone"></span>
                    </div>
                    <div class="txtb" :class="{ txtb1: isFocusedp }">
                        <input type="password" v-model="signInfo.password" @blur="handleBlur(signInfo)"
                            v-on:focus="addFocusClass('password')">
                        <span data-placeholder="Password"></span>
                    </div>
                    <div class="txtb" :class="{ txtb1: isFocusedcp }">
                        <input type="password" v-model="signInfo.repassword" @blur="handleBlur(signInfo)"
                            v-on:focus="addFocusClass('repeatpassword')">
                        <span data-placeholder="Confirm Password"></span>
                    </div>
                    <el-button @click="handleSign(signInfo)">注册</el-button>
                </el-form>
            </div>
            <div class="form-container sign-in-container">
                <form action="#">
                    <h1>登录</h1>
                    <div class="txtb" :class="{ txtb1: isFocusede }">
                        <input type="text" v-model="userInfo.phone" @blur="handleBlur(userInfo)"
                            v-on:focus="addFocusClass('phone')">
                        <span data-placeholder="UserPhone"></span>
                    </div>
                    <div class="txtb" :class="{ txtb1: isFocusedp }">
                        <input type="password" v-model="userInfo.password" @blur="handleBlur(userInfo)"
                            v-on:focus="addFocusClass('password')">
                        <span data-placeholder="Password"></span>
                    </div>
                    <a href="#">忘记密码？</a>
                    <el-button @click="handleLogin(userInfo)">登录</el-button>
                </form>
            </div>

            <div class="overlay-container">
                <div class="overlay">
                    <div class="overlay-panel overlay-left">
                        <h1>已有账号？</h1>
                        <p>请使用您的账号进行登录</p>
                        <button class="ghost" id="signIn" @click="isSignUp = !isSignUp">登录</button>
                    </div>
                    <div class="overlay-panel overlay-right">
                        <h1>没有账号?</h1>
                        <p>立即注册加入我们，和我们一起开始旅程吧</p>
                        <button class="ghost" id="signUp" @click="change(userInfo)">注册</button>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    box-sizing: border-box;
}

.body {
    font-family: 'Montserrat', sans-serif;
    background-size: cover;
    height: 100vh;
    background-image: linear-gradient(120deg, #3498db, #8e44ad);
    ;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

h1 {
    font-weight: bold;
    margin: 0;
}

p {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: .5px;
    margin: 20px 0 30px;
}

span {
    font-size: 12px;
}

a {
    color: #333;
    font-size: 14px;
    text-decoration: none;
    margin: 15px 0;
}

.up {
    top: -5px;
}

.container {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .22);
    position: relative;
    overflow: hidden;
    width: 768px;
    max-width: 100%;
    min-height: 480px;

}

.form-container form {
    background: #fff;
    display: flex;
    flex-direction: column;
    padding: 0 50px;
    height: 100%;
    justify-content: center;
    text-align: center;
}

.social-container {
    margin: 20px 0;
}

.social-container a {
    border: 1px solid #ddd;
    border-radius: 50%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0 5px;
    height: 40px;
    width: 40px;
}

.social-container a:hover {
    background-color: #eee;

}

.txtb {
    border-bottom: 2px solid #adadad;
    position: relative;
    margin: 10px 0;
}

.txtb input {
    font-size: 15px;
    color: #333;
    border: none;
    width: 100%;
    outline: none;
    background: none;
    padding: 0 3px;
    height: 35px;
}

.txtb span::before {
    content: attr(data-placeholder);
    position: absolute;
    top: 50%;
    left: 5px;
    color: #adadad;
    transform: translateY(-50%);
    transition: .5s;
}

.txtb1 span::before {
    content: attr(data-placeholder);
    position: absolute;
    top: 0%;
    left: 5px;
    color: #adadad;
    transform: translateY(-50%);
    transition: .5s;
}

.txtb span::after {
    content: '';
    position: absolute;
    left: 0%;
    top: 100%;
    width: 0%;
    height: 2px;
    background-image: linear-gradient(120deg, #3498db, #8e44ad);
    transition: .5s;
}

.focus+span::before {
    top: -5px;
}

.focus+span::after {
    width: 100%;
}

button {
    border-radius: 20px;
    border: 1px solid #ff4b2b;
    background: #ff4b2b;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    cursor: pointer;
}

button:active {
    transform: scale(.95);
}

button:focus {
    outline: none;
}

button.ghost {
    background: transparent;
    border-color: #fff;
}

.form-container {
    position: absolute;
    top: 0;
    height: 100%;
    transition: all .6s ease-in-out;
}

.form-container button {
    background: linear-gradient(120deg, #3498db, #8e44ad);
    border: none;
    background-size: 200%;
    color: #fff;
    transition: .5s;
}

.form-container button:hover {
    background-position: right;
}

.sign-in-container {
    left: 0;
    width: 50%;
    z-index: 2;
}

.sign-in-container form a {
    position: relative;
    left: 100px;
}

.sign-up-container {
    left: 0;
    width: 50%;
    z-index: 1;
    opacity: 0;
}

.sign-up-container button {
    margin-top: 20px;
}

.overlay-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform .6s ease-in-out;
    z-index: 100;
}

.overlay {
    background-image: linear-gradient(120deg, #3498db, #8e44ad);
    color: #fff;
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    transform: translateY(0);
    transition: transform .6s ease-in-out;
}

.overlay-panel {
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0 40px;
    height: 100%;
    width: 50%;
    text-align: center;
    transform: translateY(0);
    transition: transform .6s ease-in-out;
}

.overlay-right {
    right: 0;
    transform: translateY(0);

}

.overlay-left {
    transform: translateY(-20%);
}

.container.right-panel-active .sign-in-container {
    transform: translateY(100%);
}

.container.container.right-panel-active .overlay-container {
    transform: translateX(-100%);
}

.container.right-panel-active .sign-up-container {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
}

.container.container.right-panel-active .overlay {
    transform: translateX(50%);
}

.container.container.right-panel-active .overlay-left {
    transform: translateY(0);
}

.container.container.right-panel-active .overlay-right {
    transform: translateY(20%);
}
</style>