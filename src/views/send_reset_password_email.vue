<template>

    <div>
        <PublicFormLoginAndResetPassword :formData="reset_password_form_data"
            :formPageLayoutData="reset_password_form_page_layout_data" :validateCodePath="validate_code_path"
            @completeInputFormData="submitDataSendResetPasswordEmail">
            <template #email>
                <el-form-item prop="email" label="输入您的用户帐户的验证电子邮件地址，我们将向您发送密码重置链接。">
                    <el-input v-model="reset_password_form_data.email"
                        @input="handleInputContainsLetterOrDigitOrSpecialSymbols" type="text" placeholder="亲，请输入邮箱">
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


    const validate_code_path = ref();
    /* 修改当前页面meta元数据，标题、关键词、描述  开始  */

    // meta元数据，标题、关键词、描述 
    const current_meta_title = ref('');
    const current_meta_keywords = ref('');
    const current_meta_description = ref('');

    // 调用封装函数使用@unhead/vue的useHead修改页面meta元数据
    useMetaInfo(current_meta_title, current_meta_keywords, current_meta_description);

    /* 修改当前页面meta元数据，标题、关键词、描述  结束  */


    const reset_password_form_data = reactive({
        email: "",
        validate_code: "",
    })

    // 页面标题和按钮标题
    const reset_password_form_page_layout_data = reactive({
        page_title: current_meta_title,
        button_title: '发送重置密码邮件'
    })


    // 实时查询，每输入一个字符都会触发该事件。
    // 输入值是否包含匹配字母、数字和特定符号(. - @)
    function handleInputContainsLetterOrDigitOrSpecialSymbols(value) {
        console.log('handleInputContainsLetterOrDigitOrSpecialSymbols:', value)
        // 使用正则表达式匹配字母、数字和特定符号(. - @)，其他字符替换为空
        // const regex = /^[a-zA-Z0-9.\-@]*$/;
        const new_value = value.replace(/[^a-zA-Z0-9.\-@]/g, '');
        reset_password_form_data.email = new_value;
    }


    //提交数据发送重置密码邮件
    function submitDataSendResetPasswordEmail(val) {
        const params_data = val;
        resetPasswordModuleApi.sendResetPasswordEmail(params_data)
            .then(response => {
                const send_reset_password_email_result = response.send_reset_password_email;
                if (send_reset_password_email_result) {//如果值是true，那么弹出消息

                    $message('已发送重置密码邮件，请注意查收！3秒后自动跳转到登录界面！', 'success');

                    debounce(() => {//3秒防抖
                        $message('自动跳转到登录界面！', 'success');
                        // 导航到登录页
                        router.push({ name: 'login', key: new Date().getTime() });
                    }, 3100);
                }

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

    //获取页面配置（如页面标题、页面关键词、页面描述、、网站log）
    function getSendResetPasswordEmailPageData() {
        resetPasswordModuleApi.getSendResetPasswordEmailPageData({ method: 'getSendResetPasswordEmailPageData' })
            .then(response => {

                //页面 meta 元数据
                current_meta_title.value = response.meta_title;
                current_meta_keywords.value = response.meta_keywords;
                current_meta_description.value = response.meta_description;
                //使用来自layout页面（公共）提供修改当前页面meta元数据，标题、关键词、描述的方法的方法修改页面meta 数据。
                // updatePageMetaInfoFunction(current_page_meta_data);

                //验证码图片地址
                validate_code_path.value = response.validate_code_path;
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
        $message('每24小时内仅可发送3次重置密码邮件！！！', 'message');
        //获取页面配置（如页面标题、页面关键词、页面描述、、网站log）
        getSendResetPasswordEmailPageData();
    });


</script>

<style scoped>
    /* 表单项label字体颜色 */
    :deep(.el-form-item__label) {color: #ffffff;}
</style>