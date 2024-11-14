<template>

    <div>
        <PublicFormLoginAndResetPassword :formData="reset_password_form_data"
            :formPageLayoutData="reset_password_form_page_layout_data" :validateCodePath="validate_code_path"
            @completeInputFormData="submitDataGetRetrievePasswordUrl">
            <template #email>
                <el-form-item prop="email" label="输入您的用户帐户的验证电子邮件地址，我们将向您发送密码重置链接。">
                    <el-input v-model="reset_password_form_data.email" type="text" placeholder="亲，请输入邮箱">
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
        button_title: current_meta_title
    })


    //提交数据获取重置密码链接
    function submitDataGetRetrievePasswordUrl(val) {
        const params_data = val;
        resetPasswordModuleApi.getRetrievePasswordUrl(params_data)
            .then(response => {
               const get_reset_password_url_result=response.get_reset_password_url;
               if(get_reset_password_url_result){
            
                $message('发送密码重置链接，请注意查收！自动跳转到登录界面！', 'success');
            
                // debounce(() => {//3秒防抖
                //     $message('自动跳转到登录界面！', 'success');
                //     // 导航到登录页
                //     router.push({ name: 'login', key: new Date().getTime() });
                // }, 3000)
                

                return;
               }
            
            })


    }




    //获取页面配置（如页面标题、页面关键词、页面描述、、网站log）
    function getLoginPageConfigData() {
        resetPasswordModuleApi.getResetPasswordPageConfigData({ method: 'getLoginPageConfigData' })
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

    }


    onMounted(() => {



        //获取页面配置（如页面标题、页面关键词、页面描述、、网站log）
        getLoginPageConfigData();
    });


</script>
