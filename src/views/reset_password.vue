<template>

    <div>
        <PublicFormLoginAndResetPassword :formData="reset_password_form_data"
            :formPageLayoutData="reset_password_form_page_layout_data" @completeInputFormData="submitResetPassword">

            <template #password>
                <el-form-item prop="password" label="密码">
                    <el-input v-model="reset_password_form_data.password" type="password" placeholder="亲，请输入密码"
                        show-password>
                    </el-input>
                </el-form-item>
            </template>
            <template #confirm_password>
                <el-form-item prop="confirm_password" label="确认密码" label-class="custom-label">
                    <el-input v-model="reset_password_form_data.confirm_password" type="password"
                        placeholder="亲，请再次输入密码" show-password>
                    </el-input>
                </el-form-item>
            </template>

        </PublicFormLoginAndResetPassword>
    </div>

</template>

<script setup>
    import { ref, reactive, onMounted, nextTick, inject } from "vue";
    import { useRouter, useRoute } from "vue-router";
    import { getEncryptData } from "@/hooks/useSign.js";//加密
    import resetPasswordModuleApi from "@/api/reset_password/reset_password.js";//api接口
    import useMetaInfo from '@/hooks/useMetaInfo.js';//设置页面meta元数据，标题、关键词、描述 
    import { debounce, throttle } from '@/hooks/debounceOrThrottle.js';

    import PublicFormLoginAndResetPassword from '@/components/public_form_login_and_reset_password.vue';


    const route = useRoute();//用于获取当前路由的信息。返回的是当前路由的路由对象，包含了当前路由的各种信息
    const router = useRouter();//进行路由的导航操作。返回的是路由的实例，可以进行各种路由操作。
    const $message = inject('$message');

    /* 修改当前页面meta元数据，标题、关键词、描述  开始  */

    // meta元数据，标题、关键词、描述 
    const current_meta_title = ref('');
    const current_meta_keywords = ref('');
    const current_meta_description = ref('');

    // 调用封装函数使用@unhead/vue的useHead修改页面meta元数据
    useMetaInfo(current_meta_title, current_meta_keywords, current_meta_description);

    /* 修改当前页面meta元数据，标题、关键词、描述  结束  */


    // 表单数据
    const reset_password_form_data = reactive({
        password: "",
        confirm_password: "",
    })

    // 页面标题和按钮标题
    const reset_password_form_page_layout_data = reactive({
        page_title: current_meta_title,
        button_title: current_meta_title
    })

       //提交参数 
       const params_data = reactive({
        temporary_token: '',
        password: '',
        confirm_password:'',
    });


    //提交数据进行重置密码
    function submitResetPassword(val) {
        // 使用扩展运算符进行深拷贝 避免修改一个变量时影响到另一个变量。
        let data = { ...val };
        // 加密密码
        const encrypt_password_result = getEncryptData(data.password);
        const encrypt_confirm_password_result = getEncryptData(data.password);

        params_data.password = encrypt_password_result;
        params_data.confirm_password = encrypt_confirm_password_result;
        // console.log('encrypt_password_result:', encrypt_password_result);
        //  TODO: 请求错误404等也会进入then方法
        resetPasswordModuleApi.goResetPassword(params_data)
            .then(response => {
                //处理逻辑 
                // console.log('请求接口成功-处理逻辑：', response);
                // $message('重置密码链接已发送到您的邮箱，有效期3小时', 'success');
                $message('已重置密码！3秒后自动跳转到登录界面！', 'success');

                debounce(() => {//3秒防抖
                    $message('自动跳转到登录界面！', 'success');
                    // 导航到登录页
                    router.push({ name: 'login', key: new Date().getTime() });
                }, 3100);

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

    //         $message('重置密码链接已发送到您的邮箱，有效期3小时', 'success');




    //获取页面配置（如页面标题、页面关键词、页面描述、、网站log）
    function getResetPasswordPageData() {
        // { method: 'getResetPasswordPageData' }

        resetPasswordModuleApi.getResetPasswordPageData({ method: "010011 010110 000101 101110sgetResetPasswordPageDataBase64编码的基本思路是将原始数据的三个字节拆分转化为四个字节,然后根据Base64的对应表" })
            .then(response => {
                // console.log('response:', response);
                //页面 meta 元数据
                current_meta_title.value = response.meta_title;
                current_meta_keywords.value = response.meta_keywords;
                current_meta_description.value = response.meta_description;
                //使用来自layout页面（公共）提供修改当前页面meta元数据，标题、关键词、描述的方法的方法修改页面meta 数据。
                // updatePageMetaInfoFunction(current_page_meta_data);

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

        //获取页面配置（如页面标题、页面关键词、页面描述、、网站log）
        getResetPasswordPageData();
    });


</script>
<style scoped>
    /* 表单项label字体颜色 */
    :deep(.el-form-item__label) {color: #ffffff;}
</style>