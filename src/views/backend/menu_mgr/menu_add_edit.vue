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
    <el-form-item label="展示名称" prop="menu_title">
      <el-input v-model="ruleForm.menu_title" placeholder="亲，请输入展示名称"></el-input>
    </el-form-item>


    <el-form-item label="路由Name" prop="menu_name">
      <el-input v-model="ruleForm.menu_name" placeholder="亲，请输入路由Name"></el-input>
    </el-form-item>



    <el-form-item label="路由Path" prop="menu_path">
      <el-input v-model="ruleForm.menu_path" placeholder="亲，请输入路由Path">
      </el-input>
    </el-form-item>

    <!-- 选择根目录显示 开始-->
    <div v-if="ruleForm.parent_id===0"> 

    <el-form-item label="菜单关键词" prop="menu_keywords">
      <el-input v-model="ruleForm.menu_keywords" placeholder="亲，请输入菜单关键词">
      </el-input>
    </el-form-item>
  

    <el-form-item label="菜单描述" prop="menu_description">
      <el-input v-model="ruleForm.menu_description" placeholder="亲，请输入菜单描述">
      </el-input>
    </el-form-item>

  </div>
    <!-- 选择根目录显示 结束-->

    <el-form-item label="业务层面" prop="business_level">
      <el-select v-model="ruleForm.business_level" placeholder="请选择">
        <el-option v-for="(item, index) in options_business_level_data" :key="item.business_level" :label="item.label"
          :value="item.business_level" />
      </el-select>

    </el-form-item>


    <el-form-item label="图标" prop="icon">
      <!-- 选择器 开始-->
      <el-select v-model="ruleForm.icon" placeholder="请选择">
        <!-- 选中回显数据 开始-->
        <template #prefix>
          <!-- 将前置插槽数据设置为label的值  显示图标-->
          <svg-icon v-if="ruleForm.icon" :icon-class="ruleForm.icon" />
        </template>
        <!-- 选中回显数据 结束-->
        <!--选择区 开始-->
        <el-option v-for="(item, index) in options_icon_data" :key="item" :label="item" :value="item">
          <div slot="default" style="display: flex; align-items: center;">
            <svg-icon :icon-class="item" />
            <div style="margin-left: 10px;"> {{ item }}</div>
          </div>
        </el-option>

        <!--选择区 结束-->

      </el-select>
      <!-- 选择器 结束-->

    </el-form-item>


    <el-form-item label="父节点" prop="parent_id">
      <el-select v-model="ruleForm.parent_id" placeholder="请选择">
        <el-option v-for="(item, index) in options_parent_id_data" :key="item.menu_id" :label="item.menu_title"
          :value="item.menu_id" />
      </el-select>

    </el-form-item>

    <el-form-item label="下架" prop="is_pulled">
      <el-radio-group v-model="ruleForm.is_pulled">
        <el-radio v-for="(item,index) in is_pulled_data" :key="index" :value="item.is_pulled"> {{
          item.label }}</el-radio>
      </el-radio-group>
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
  import menuModuleApi from "@/api/backend/menu.js";//api接口

  const route = useRoute();
  const router = useRouter();
  //使用 provide inject 代替getCurrentInstance
  const $verify = inject('$verify');
  const $message = inject('$message');





  //表单ref
  const ruleFormRef = ref();
  //初始化添加数据
  const ruleForm = reactive({
    menu_id: 0,
    menu_name: "",
    menu_title: "",
    menu_path: "",
    icon: "",
    business_level: "",
    parent_id: 0,
    is_pulled: 2,
    action:'',
    menu_keywords:'',
    menu_description:''
  })

  //校验
  const rules = {
    email: [
      { required: true, message: "请输入邮箱" },
      { max: 50, message: "邮箱长度超限" },
      // { validator: proxy.$verify.email, message: "邮箱格式有误" },

    ],
    password: [
      { required: true, message: "请输入密码" },

    ],

  };

  //提交修改数据
  function clickSubmit() {
    //valid 类型：布尔值 。fields 没有通过校验的字段，类型：对象
    ruleFormRef.value.validate((valid, fields) => {
      if (valid) {
        console.log("表单数据:", ruleForm)
        // 处理提交逻辑
        menuModuleApi.clickSubmitAddOrEditData(ruleForm)
          .then(response => {
            //把修改或添加消息广播出去
          
            // const msg_content=response.action_success_data;
            if (route.query.action == "edit") {
              //模拟
              

              let msg_content = {
                menu_id: route.query.id ? Number(route.query.id) : 1,
                menu_name: ruleForm.menu_name,
                menu_title: ruleForm.menu_title,
                menu_path: ruleForm.menu_path,
                icon: ruleForm.icon,
                business_level: ruleForm.business_level,
                parent_id: ruleForm.parent_id,
                is_pulled:ruleForm.is_pulled,
                created_time: "1687938191",
                update_time: "1687938191",
                delete_time: "1687938191"
              }

              console.log('msg_content:',msg_content);
              sendMsg('edit-menu', msg_content);
              $message('修改成功', 'success');

            } else if (route.query.action == "add") {
              //模拟
              let msg_content = {
                menu_id: 999,
                menu_name: ruleForm.menu_name,
                menu_title: ruleForm.menu_title,
                menu_path: ruleForm.menu_path,
                icon: ruleForm.icon,
                business_level: ruleForm.business_level,
                parent_id: ruleForm.parent_id,
                is_pulled: ruleForm.is_pulled,
                created_time: "1687938191",
                update_time: "1687938191",
                delete_time: "1687938191"
              }

              sendMsg('add-menu', msg_content);
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


  // 获取编辑id数据
  function getEditCurrentIdData(edit_current_id_data) {
    menuModuleApi.getEditCurrentIdData(edit_current_id_data)
      .then(response => {

        ruleForm.menu_id = response.menu_id;
        ruleForm.menu_title = response.menu_title;
        ruleForm.menu_name = response.menu_name;
        ruleForm.menu_path = response.menu_path;
        ruleForm.icon = response.icon;
        ruleForm.business_level = response.business_level;
        ruleForm.parent_id = response.parent_id;
        ruleForm.is_pulled = response.is_pulled;

        //模拟数据 id=route.query.id
        // ruleForm.menu_id = route.query.id;

      })
      .catch(error => {
        // console.log(' getPageLayoutData()=>error:',error)
        $message('请求未找到', 'error');
        // $message('请求未找到', 'error');
      });

  }



  //选择器数据
  const options_business_level_data = ref([])
  const options_parent_id_data = ref([]);
  const options_icon_data = ref([]);
  const is_pulled_data=ref();



  // 获取页面框架数据
  function getAddAndEditPageLayoutData() {
    menuModuleApi.getPageLayoutData({'method':'getAddAndEditPageLayoutData'})
      .then(response => {
        options_business_level_data.value = response.options_business_level_data;
        options_parent_id_data.value = response.options_parent_id_data;
        options_icon_data.value = response.options_icon_data;
        is_pulled_data.value=response.is_pulled_data;
        // unshift()方法将一个或多个元素添加到数组的开头，并返回新数组的长度。

        const root_directory = {
          menu_id: 0,
          menu_title: "根目录"
        }

        options_parent_id_data.value.unshift(root_directory)

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

  const page_title=ref('');
  onMounted(() => {


    if (Object.keys(route.query).length > 0) {
      //如果是action=="edit"，那么获取当前编辑id数据
      if (route.query.action == "edit") {
        // 字符串值转数字值
        let id_string_to_number=Number(route.query.id);
        // 拼接数据
        let edit_current_id_data={
          'id':id_string_to_number
        }
        getEditCurrentIdData(edit_current_id_data);
        getAddAndEditPageLayoutData();
        page_title.value='编辑菜单';
        ruleForm.action = "edit";//编辑操作
      } else if (route.query.action == "add") {
        getAddAndEditPageLayoutData();
        page_title.value='添加菜单';
        ruleForm.action = "add";//添加操作
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