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
    <el-form-item label="标签名" prop="tag_name">
      <el-input v-model="ruleForm.tag_name" placeholder="亲，请输入用户昵称"></el-input>
    </el-form-item>

    <el-form-item label="关键词" prop="tag_keywords">
      <el-input v-model="ruleForm.tag_keywords" placeholder="亲，请输入关键词"></el-input>
    </el-form-item>

    <el-form-item label="描述" prop="tag_description">
      <el-input v-model="ruleForm.tag_description" placeholder="亲，请输入描述">
      </el-input>
    </el-form-item>

    <el-form-item label="所属栏目" prop="menu_id">
      <el-radio-group v-model="ruleForm.menu_id" @change="checkColumnRadio">
        <el-radio  v-for="item in options_menu_data" :key="item.menu_id" :value="item.menu_id"> {{
          item.menu_title }}</el-radio>
      </el-radio-group>
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
  import tagModuleApi from "@/api/backend/tag.js";//api接口



  const route = useRoute();
  const router = useRouter();
  //使用 provide inject 代替getCurrentInstance
  const $verify = inject('$verify');
  const $message = inject('$message');

  //表单ref
  const ruleFormRef = ref();
  //初始化添加数据
  const ruleForm = reactive({
    tag_id: 0,
    menu_id: '',
    // menu_name: "",
    menu_title: "",
    tag_name: "",
    tag_keywords: "",
    tag_description: "",
    is_pulled: 2,
   action:''//操作

  })


    //点击栏目单选框选中值
  function checkColumnRadio(val) {
     // 查找相等id返回menu_title。find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
    const current_active_menu_id_data = options_menu_data.value.find(menu => menu.menu_id === ruleForm.menu_id);
      ruleForm.menu_title=current_active_menu_id_data.menu_title;
      // console.log('ruleForm. ruleForm.menu_title:',ruleForm.menu_title)
      // console.log('selectColumnInfo（val） =',val)
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
        tagModuleApi.clickSubmitAddOrEditData(ruleForm)
          .then(response => {
            //把修改或添加消息广播出去
            // const msg_content=response.action_success_data;
            if (route.query.action == "edit") {
              //模拟
              let msg_content = {
                tag_id: route.query.id ? Number(route.query.id) : 1,
                menu_id: ruleForm.menu_id,
                // menu_name: ruleForm.menu_name,
                menu_title: ruleForm.menu_title,
                tag_name:ruleForm.tag_name ,
                tag_keywords: ruleForm.tag_keywords,
                tag_description: ruleForm.tag_description,
                is_pulled: ruleForm.is_pulled,
                account_status: "edit-tag",
                created_time: "1687938191",
                update_time: "1728874350",
              }


              sendMsg('edit-tag', msg_content);
              $message('修改成功', 'success');

            } else if (route.query.action == "add") {
              //模拟
              let msg_content = {
                tag_id: 999,
                menu_id: ruleForm.menu_id,
                // menu_name: ruleForm.menu_name,
                menu_title: ruleForm.menu_title,
                tag_name:ruleForm.tag_name ,
                tag_keywords: ruleForm.tag_keywords,
                tag_description: ruleForm.tag_description,
                is_pulled: ruleForm.is_pulled,
                account_status: "edit-tag",
                created_time: "1687938191",
                update_time: "1728874350",
              }


              sendMsg('add-tag', msg_content);
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
    tagModuleApi.getEditCurrentIdData(edit_current_id_data)
      .then(response => {

        ruleForm.tag_id = response.tag_id;
        ruleForm.menu_id = response.menu_id;
        // ruleForm.menu_name = response.menu_name;
        ruleForm.menu_title = response.menu_title;

        ruleForm.tag_name = response.tag_name;
        ruleForm.tag_keywords = response.tag_keywords;
        ruleForm.tag_description = response.tag_description;
        ruleForm.is_pulled = response.is_pulled;

        //模拟数据 id=route.query.id
        ruleForm.menu_id = route.query.id;

      })
      .catch(error => {
        // console.log(' getPageLayoutData()=>error:',error)
        $message('请求未找到', 'error');
        // $message('请求未找到', 'error');
      });

  }



  //选择器数据
  const options_menu_data = ref([]);
  const is_pulled_data = ref();

  // 获取页面框架数据
  function getAddAndEditPageLayoutData() {
    tagModuleApi.getPageLayoutData({})
      .then(response => {

        options_menu_data.value = response.options_menu_data;
        is_pulled_data.value = response.is_pulled_data;

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
         // 字符串值转数字值
        let id_string_to_number=Number(route.query.id);
        // 拼接数据
        let edit_current_id_data={
          'id':id_string_to_number
        }
        getEditCurrentIdData(edit_current_id_data);
        getAddAndEditPageLayoutData();
 
        page_title.value='编辑标签';
        ruleForm.action = "edit";//编辑操作

      } else if (route.query.action == "add") {
        getAddAndEditPageLayoutData();
        page_title.value='添加标签';
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