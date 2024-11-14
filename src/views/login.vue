<template>
  
  <div>

    <PublicFormLoginAndResetPassword :formData="login_form_data" :formPageLayoutData="login_form_page_layout_data"  :validateCodePath="validate_code_path" @completeInputFormData="submitLogin">
      
      <template #email>
      <el-form-item prop="email"  label="邮箱">
        <el-input v-model="login_form_data.email" type="text" placeholder="亲，请输入邮箱">
        </el-input>
    </el-form-item>
  </template>


      <template #password>
        <el-form-item prop="password" label="密码">
          <el-input v-model="login_form_data.password" type="password" placeholder="亲，请输入密码" show-password>
          </el-input>
      </el-form-item>
    </template>

    </PublicFormLoginAndResetPassword>
  </div>

</template>

<script setup>
  import { ref, reactive, onMounted,nextTick, inject } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { getEncryptData } from "@/hooks/useSign.js";//加密
  import loginModuleApi from "@/api/login/login.js";//api接口
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
useMetaInfo(current_meta_title,current_meta_keywords,current_meta_description);

/* 修改当前页面meta元数据，标题、关键词、描述  结束  */


const validate_code_path=ref();


// 表单数据
      const login_form_data = reactive({
        email: "",
        password: "",
        validate_code:""
    })
    
    // 页面标题和按钮标题
    const login_form_page_layout_data=reactive({
      page_title:current_meta_title,
      button_title:current_meta_title,
    })





  //提交数据进行登录
  function submitLogin(val) {
    console.log('submitLogin', val);
    
    const params_data = val;
                const encrypt_result = getEncryptData(params_data.password);
                params_data.password = encrypt_result;
                console.log('encrypt_result:', encrypt_result);
    // return;
    loginModuleApi.goLogin(params_data)
                    .then(response => {
                        let temporary_token = response.temporary_token;
                        $message('账号通过验证,请输入验证码继续登录', 'success');
                        //路由携参跳转
                        router.push({ name: 'verification', query: { temporary_token: temporary_token }, key: new Date().getTime() });


                    })


    }



	//获取页面配置（如页面标题、页面关键词、页面描述、、网站log）
  function getLoginPageConfigData(){
    loginModuleApi.getLoginPageConfigData({method:'getLoginPageConfigData'})
          .then(response => {
            
        //页面 meta 元数据
current_meta_title.value = response.meta_title;
    current_meta_keywords.value = response.meta_keywords;
    current_meta_description.value = response.meta_description;
     //使用来自layout页面（公共）提供修改当前页面meta元数据，标题、关键词、描述的方法的方法修改页面meta 数据。
        // updatePageMetaInfoFunction(current_page_meta_data);

        //验证码图片地址
        validate_code_path.value=response.validate_code_path;
            

        })

  }


  onMounted(() => {

  
		
	//获取页面配置（如页面标题、页面关键词、页面描述、、网站log）
    getLoginPageConfigData();
	});


</script>

