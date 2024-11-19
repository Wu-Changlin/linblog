<template>
    <div class="verification-page">
        <!-- <VerificationCode /> -->

        <VerificationCode @completeVerificationCode="submitVerificationCode" />
    </div>
</template>

<script setup>
    import { reactive, ref, onMounted, inject } from 'vue';
    import VerificationCode from '@/components/verification_code.vue';//验证码输入框组件
    import { useRouter, useRoute } from "vue-router";
    import loginModuleApi from "@/api/login/login.js";//api接口
    import { debounce, throttle } from '@/hooks/debounceOrThrottle.js';
    import { useUserStore } from '@/stores/useUserStore.js';//持久存储登录用户相关信息(昵称、令牌、刷新令牌)  会话级



    const route = useRoute();//用于获取当前路由的信息。返回的是当前路由的路由对象，包含了当前路由的各种信息
    const router = useRouter();//进行路由的导航操作。返回的是路由的实例，可以进行各种路由操作。

    const $message = inject('$message');

    //提交参数 
    const params_data = reactive({
        temporary_token: '',
        verification_code: ''
    });

    // 接收验证码，组装参数继续登录
    function submitVerificationCode(val) {
        params_data.verification_code.val;
        loginModuleApi.goLogin(params_data)
            .then(response => {
            
                //     "nick_name":"lin",
                // "jwt_access_token": "jwt_access_tokenvavasvavavavava",
                // "jwt_refresh_token": "jwt_refresh_tokenvavs99999"

                if (response && response.nick_name && response.jwt_access_token && response.jwt_refresh_token) {
                    $message('成功登录', 'success');
                    // //保存数据到本地存储
                    console.log('response.nick_name,response.jwt_access_token,response.jwt_refresh_token:', response.nick_name, response.jwt_access_token, response.jwt_refresh_token)
                    useUserStore().login(response.nick_name, response.jwt_access_token, response.jwt_refresh_token)

                    // 导航到后台首页
                    router.push({ name: 'admin', key: new Date().getTime() });
                    

                }

              


                //路由携参跳转
            })
            .catch(error => {
                // console.log('请求接口错误-提示：', error);
                // // 处理错误
                // let message_str = error.message;
                // if (error.data) {
                //     message_str = error.data.data.msg;
                // }

                // $message(message_str, 'error');
            });
    }


    onMounted(() => {
        if (!route.query.temporary_token) {
            $message('非法操作', 'error');
            router.push({ path: '/404' });//重定向到404页面
            return;
        }
        // 获取地址栏的临时令牌参数
        params_data.temporary_token = route.query.temporary_token;
    });



</script>

<style>
    .verification-page {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
</style>