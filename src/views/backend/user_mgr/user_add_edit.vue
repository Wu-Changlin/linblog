<template>


  <div class="page_title_container">
    <div class="line"></div>
    <div class="title">
      {{ page_title}}
    </div>
    <div class="line"></div>
  </div>

  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm"
    label-position="left">
    <el-form-item label="用户昵称" prop="nike_name">
      <el-input v-model="ruleForm.nike_name" placeholder="亲，请输入用户昵称"></el-input>
    </el-form-item>


    <el-form-item label="邮箱" prop="email">
      <el-input v-model="ruleForm.email" placeholder="亲，请输入邮箱"></el-input>
    </el-form-item>

    <el-form-item v-model="ruleForm.avatar" label="头像" prop="avatar">
      <div v-if="ruleForm.avatar">
        <el-image style="width: 200px; height: 40px" :src="ruleForm.avatar" :preview-src-list="[ruleForm.avatar]"
          fit="cover" />

      </div>


      <el-button class="avatar_card" @click="dialogConfig.is_show=true">

        <img v-if="selected.cover_path" :src="selected.cover_path" alt="" class="cover_img">
        <!-- <el-icon v-else class="cover_card_icon"><Plus /></el-icon> -->
        <svg-icon class="svg_icon" style="width: 1em; height: 1em; margin-right: 8px;" icon-class="image_list" />
      </el-button>

      <ArticleCoverList :key="dialogConfig.is_show" :is_show="dialogConfig.is_show"
        @close="dialogConfig.is_show = false" @success="SelectCover"></ArticleCoverList>

    </el-form-item>


    <el-form-item label="密码" prop="password">
      <el-input v-model="ruleForm.password" type="password" placeholder="亲，请输入密码" show-password>
      </el-input>
    </el-form-item>


    <el-form-item label="再次密码" prop="again_password">
      <el-input v-model="ruleForm.again_password" type="password" placeholder="亲，请再次输入密码" show-password>
      </el-input>
    </el-form-item>

    <el-form-item label="启用" prop="is_pulled">
      <el-switch v-model="ruleForm.is_pulled" inline-prompt active-text="是" inactive-text="否" />
    </el-form-item>

    <el-form-item label="角色" prop="role">
      <el-select v-model="ruleForm.role" placeholder="请选择">
        <el-option v-for="item in options_role_data" :key="item.role" :label="item.label" :value="item.role" />
      </el-select>

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
  import { sendMsg } from '@/components/cross_tag_msg/crossTagMsg.js';
  import userModuleApi from "@/api/backend/user.js";//api接口



  const route = useRoute();
  const router = useRouter();
  //使用 provide inject 代替getCurrentInstance
  const $verify = inject('$verify');
  const $message = inject('$message');





  //表单ref
  const ruleFormRef = ref();
  //初始化添加数据
  const ruleForm = reactive({
    user_id: 0,
    nike_name: "",
    email: "",
    cover: "",
    password: "",
    again_password: "",
    role: "",
    is_pulled: false,

  })
  /*封面 开始*/

  // dialogConfig 控制显示/隐藏封面图片列表
  const dialogConfig = reactive({
    is_show: false,
  })

  //接收子组件emit('success',id,path)，确认选中的封面图片id
  function SelectCover(cover_id, cover_path) {
    // console.log('SelectCover id='+cover_id); 
    // console.log('SelectCover path='+cover_path); 

    selected.cover_id = cover_id;
    selected.cover_path = cover_path;


  }

  //封面数据初始化
  const selected = reactive({
    cover_id: '',
    cover_path: '',
  })

  /*封面 结束*/

  //两次密码一致性校验      第二次输入需和第一次输入一致
  const checkPassword = (rule, value, callback) => {
    // console.log(login_form_data.password);
    if (value !== ruleForm.password) {
      callback(new Error(rule.message));
    } else {
      callback();
    }
  }

  //校验
  const rules = {
    email: [
      { required: true, message: "请输入邮箱" },
      { max: 50, message: "邮箱长度超限" },
      // { validator: proxy.$verify.email, message: "邮箱格式有误" },
      { validator: $verify.email, message: "邮箱格式有误" },

    ],
    password: [
      { required: true, message: "请输入密码" },
      { validator: $verify.password, message: "密码至少包含大写字母、小写字母、数字和特殊字符中的三种，并且长度至少为8位‌15。" },

    ],
    again_password: [
      { required: true, message: "请再次输入密码" },
      { validator: checkPassword, message: "两次输入密码不一致" },
      { validator: $verify.password, message: "密码至少包含大写字母、小写字母、数字和特殊字符中的三种，并且长度至少为8位‌15。" },

    ],
    check_code: [
      { required: true, message: "请输入图片验证码" },
    ]
  };

  //提交修改数据
  function clickSubmit() {
    //valid 类型：布尔值 。fields 没有通过校验的字段，类型：对象
    ruleFormRef.value.validate((valid, fields) => {
      if (valid) {
        console.log("表单数据:", ruleForm)
        // 处理提交逻辑
        userModuleApi.clickSubmitAddAndEditData(ruleForm)
          .then(response => {
            //把修改或添加消息广播出去
            // const msg_content=response.action_success_data;
            if (route.query.action == "edit") {
              //模拟
              let msg_content = {
                user_id: route.query.id ? Number(route.query.id) : 1,
                nike_name: "edit-user",
                avatar: "/logo.png",
                email: "xxx@qq.com",
                role: 1,
                is_pulled: ruleForm.is_pulled === true ? 1 : 0,
                account_status: "edit-user",
                created_time: "1687938191",
                update_time: "1728874350",
              }


              sendMsg('edit-user', msg_content);
              $message('修改成功', 'success');

            } else if (route.query.action == "add") {
              //模拟
              let msg_content = {
                user_id: 999,
                nike_name: "add-user",
                avatar: "/logo.png",
                email: "xxx@qq.com",
                role: 1,
                is_pulled: ruleForm.is_pulled === true ? 1 : 0,
                account_status: "add-user",
                created_time: "1687938191",
                update_time: "1687938191",
              }


              sendMsg('add-user', msg_content);
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
    userModuleApi.getEditCurrentIdData(edit_current_id_data)
      .then(response => {

        ruleForm.user_id = response.user_id;
        ruleForm.nike_name = response.nike_name;
        ruleForm.email = response.email;
        ruleForm.avatar = response.avatar;
        ruleForm.password = response.password;
        ruleForm.again_password = response.again_password;
        ruleForm.role = response.role;
        ruleForm.is_pulled = response.is_pulled == 1 ? true : false;

        //模拟数据 id=route.query.id
        ruleForm.menu_id = route.query.id;

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

  }


  //选择器数据
  const options_role_data = ref([]);

  // 获取页面框架数据
  function getAddAndEditPageLayoutData() {


    userModuleApi.getPageLayoutData({})
      .then(response => {

        options_role_data.value = response.options_role_data;
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

  }

  const page_title = ref('');
  onMounted(() => {


    if (Object.keys(route.query).length > 0) {
      //如果是action=="edit"，那么获取当前编辑id数据
      if (route.query.action == "edit") {
        getEditCurrentIdData(route.query);
        getAddAndEditPageLayoutData();
        page_title.value = '编辑用户';
      } else if (route.query.action == "add") {
        getAddAndEditPageLayoutData();
        page_title.value = '添加用户';
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


<style scoped>
  .page_title_container {
    display: flex;
    align-items: center;
    /* 垂直居中 */
    justify-content: space-between;
    /* 水平间隔 */
    height: 100px;

    /* 容器高度 */
    .title {
      text-align: center;
      flex: 1;
      /* 占据剩余空间 */
    }

    .line {
      flex: 1;
      /* 占据剩余空间 */
      border-top: 2px solid #999999;
      /* 横线样式 */
      margin: 0 10px;
      /* 横线外边距 */
    }
  }
</style>