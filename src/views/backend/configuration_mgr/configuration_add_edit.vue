<template>

  <div class="page_title_container">
    <div class="line"></div>
    <div class="title">
      {{ page_title}}
    </div>
    <div class="line"></div>
  </div>
  
    <el-form  ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm"
      label-position="left">
      <el-form-item label="中文名称" prop="cn_name">
        <el-input v-model="ruleForm.cn_name" placeholder="亲，请输入中文名称"></el-input>
      </el-form-item>
  
      <el-form-item label="英文名称" prop="en_name">
        <!-- 非英文的全局替换成空 -->
        <el-input v-model="ruleForm.en_name" placeholder="亲，请输入英文名称"  @input="ruleForm.en_name =ruleForm.en_name.replace(/[^a-zA-Z ]+/g,'')"></el-input>
      </el-form-item>

      <el-form-item label="表单标签" prop="form_tag_type">
        <el-radio-group v-model="ruleForm.form_tag_type" @change="checkColumnRadio">
          <el-radio  v-for="item in options_form_tag_type_data" :key="item.form_tag_type" :value="item.form_tag_type">
            {{ item.form_tag_name }} ({{ item.form_tag_title }})
          </el-radio>
        </el-radio-group>
      </el-form-item>
  

      <el-form-item label="标签配置值" prop="form_tag_value‌s">
        <el-input v-model="ruleForm.form_tag_value‌s" placeholder="亲，请输入标签配置值。多个以逗号为间隔"></el-input>
      </el-form-item>
  
      <el-form-item label="活跃配置值" prop="form_tag_active_value‌">
        <el-input v-model="ruleForm.form_tag_active_value‌" placeholder="亲，请输入活跃配置值">
        </el-input>
      </el-form-item>
  
      
      <el-form-item>
        <div style="width: 100%;">
          <el-button type="primary" @click="clickSubmit()">提交</el-button>
        </div>
  
      </el-form-item>
  
    </el-form>
  </template>
  
  <script setup>
    import { ref, reactive, onMounted, computed, nextTick, inject } from "vue";
    import { useRouter, useRoute } from "vue-router";
    import ArticleCoverList from '@/components/backend/article_cover_list.vue';
    import {sendMsg} from '@/components/cross_tag_msg/crossTagMsg.js';
    import configurationModuleApi from "@/api/backend/configuration.js";//api接口
  
  
  
    const route = useRoute();
    const router = useRouter();
    //使用 provide inject 代替getCurrentInstance
    const $verify = inject('$verify');
    const $message = inject('$message');


    //表单ref
    const ruleFormRef = ref();
    //初始化添加数据
    const ruleForm = reactive({
      configuration_id: 0,
      cn_name: "",
      en_name: "",
      form_tag_type: 0,
      form_tag_name: "",
      form_tag_value‌s: "",
      form_tag_active_value‌: "",
    })

    
    //点击栏目单选框选中值
  function checkColumnRadio(val) {
     // 查找相等id返回menu_title。find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
    const current_active_menu_id_data = options_form_tag_type_data.value.find(form_tag => form_tag.form_tag_type === ruleForm.form_tag_type);
      ruleForm.form_tag_name=current_active_menu_id_data.form_tag_name;
      
  }
  
  
    //校验
    const rules = {
      email: [
        { required: true, message: "请输入邮箱" },
        { max: 50, message: "邮箱长度超限" },
        // { validator: proxy.$verify.email, message: "邮箱格式有误" },
      ],
    };
  
    //提交修改数据
    function clickSubmit() {
      //valid 类型：布尔值 。fields 没有通过校验的字段，类型：对象
      ruleFormRef.value.validate((valid, fields) => {
        if (valid) {
          console.log("表单数据:", ruleForm)
          // 处理提交逻辑
          configurationModuleApi.clickSubmitAddAndEditData(ruleForm)
            .then(response => {
              //把修改或添加消息广播出去
              // const msg_content=response.action_success_data;
              if (route.query.action == "edit") {
                //模拟
                let msg_content = {
                  configuration_id: route.query.id ? Number(route.query.id) : 1,
                  cn_name: ruleForm.cn_name,
                  en_name: ruleForm.en_name,
                  form_tag_type: ruleForm.form_tag_type,
                  form_tag_name: ruleForm.form_tag_name,
                  form_tag_value‌s: ruleForm.form_tag_value‌s,
                  form_tag_active_value‌: ruleForm.form_tag_active_value‌,

                  created_time: "1687938191",
                  update_time: "1728874350",
                }
  
  
                sendMsg('edit-configuration', msg_content);
                $message('修改成功', 'success');
  
              } else if (route.query.action == "add") {
                //模拟
                let msg_content = {
                  configuration_id: 999,
                  cn_name: ruleForm.cn_name,
                  en_name: ruleForm.en_name,
                  form_tag_type: ruleForm.form_tag_type,
                  form_tag_name: ruleForm.form_tag_name,
                  form_tag_value‌s: ruleForm.form_tag_value‌s,
                  form_tag_active_value‌: ruleForm.form_tag_active_value‌,
                  created_time: "1687938191",
                  update_time: "1728874350",
                }
  
  
                sendMsg('add-configuration', msg_content);
                $message('添加成功', 'success');
  
              }
  
            })
            .catch(error => {
                // console.log('请求接口错误-提示：', error);
                // // 处理错误
                // let message_str = error.message;
                // if (error.data) {
                //     message_str = error.data.data.message;
                // }

                // $message(message_str, 'error');
            });
  
        } else {
          // 有字段没有通过验证
          let obj = Object.keys(fields)[0];
          //使用formEl.scrollToField方法来焦点定位并滚动到特定的表单字段,这里跳到第一个字段
          ruleFormRef.value.scrollToField(obj);
          $message('输入数据有误，请检查', 'warning');
          return false;
        }
      });
    }
  
  
    function getEditCurrentIdData(edit_current_id_data) {
      configurationModuleApi.getEditCurrentIdData(edit_current_id_data)
        .then(response => {
  
          ruleForm.configuration_id = response.configuration_id;
          ruleForm.cn_name = response.cn_name;
          ruleForm.en_name = response.en_name;
          ruleForm.form_tag_type = response.form_tag_type;
          ruleForm.form_tag_name = response.form_tag_name;
          ruleForm.form_tag_value‌s = response.form_tag_value‌s;
          ruleForm.form_tag_active_value‌ = response.form_tag_active_value‌;
  
        })
        .catch(error => {
          // console.log(' getPageLayoutData()=>error:',error)
          $message('请求未找到', 'error');
          // $message('请求未找到', 'error');
        });
  
    }
  
  
  
    //选择器数据
    const options_form_tag_type_data = ref();
  
    // 获取页面框架数据
    function getAddAndEditPageLayoutData() {
      configurationModuleApi.getPageLayoutData({})
        .then(response => {
  
          options_form_tag_type_data.value = response.options_form_tag_type_data;
        console.log('response.options_form_tag_type_data:',response.options_form_tag_type_data)
  
        })
        .catch(error => {
          // console.log(' getPageLayoutData()=>error:',error)
          $message('请求未找到', 'error');
          // $message('请求未找到', 'error');
        });
  
    }
  
  const page_title=ref('');
    onMounted(() => {
  
  
      if (Object.keys(route.query).length > 0) {
        //如果是action=="edit"，那么获取当前编辑id数据
        if (route.query.action == "edit") {
          getEditCurrentIdData(route.query);
          getAddAndEditPageLayoutData();
   
          page_title.value='编辑配置';
        } else if (route.query.action == "add") {
          getAddAndEditPageLayoutData();
          page_title.value='添加配置';
  
        } else {
          $message('非法操作', 'error');
          router.push({ path: '/404' });//重定向到404页面
          return;
        }
  
  
      } else {
        $message('非法请求', 'error');
      }
    });
  
  </script>
  
  
  <style  scoped>
  
  .page_title_container {
    display: flex;
    align-items: center; /* 垂直居中 */
    justify-content: space-between;  /* 水平间隔 */
    height: 100px; /* 容器高度 */
    .title {
    text-align: center;
    flex: 1; /* 占据剩余空间 */
  }
  
  .line {
    flex: 1; /* 占据剩余空间 */
    border-top: 2px solid #999999; /* 横线样式 */
    margin: 0 10px; /* 横线外边距 */
  }
  }
  
  
  </style>