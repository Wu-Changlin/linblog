<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm"
    label-position="left">
    <el-form-item label="标签名" prop="tag_name">
      <el-input v-model="ruleForm.tag_name" placeholder="亲，请输入用户名称"></el-input>
    </el-form-item>

    <el-form-item label="关键词" prop="tag_keywords">
      <el-input v-model="ruleForm.tag_keywords" placeholder="亲，请输入关键词"></el-input>
    </el-form-item>

    <el-form-item label="描述" prop="tag_description">
      <el-input v-model="ruleForm.tag_description" placeholder="亲，请输入描述">
      </el-input>
    </el-form-item>

    <el-form-item label="下架" prop="is_pulled">
      <el-switch v-model="ruleForm.is_pulled" inline-prompt active-text="是" inactive-text="否" />
    </el-form-item>

    <el-form-item label="所属栏目" prop="role">
      <el-select @change="selectColumnInfo" v-model="ruleForm.menu_id" placeholder="请选择">
        <el-option v-for="item in menu_data" :key="item.menu_id" :label="item.menu_title" :value="item.menu_id" />
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
  import { sendMsg } from '@/components/crossTagMsg.js';


  const route = useRoute();
  const router = useRouter();
  //使用 provide inject 代替getCurrentInstance
  const $verify = inject('$verify');
  const $getData = inject('$getData');
  const $postData = inject('$postData');
  const $message = inject('$message');

  //表单ref
  const ruleFormRef = ref();
  //初始化添加数据
  const ruleForm = reactive({
    tag_id: 0,
    menu_id: 0,
    menu_name: "",
    menu_title: "",
    tag_name: "",
    tag_keywords: "",
    tag_description: "",
    is_pulled: false,
  })


  
    //栏目选择器的选中值
    function selectColumnInfo(val) {

      // 查找相等id返回menu_title。find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
      const current_active_menu_id_data = menu_data.value.find(menu => menu.menu_id === ruleForm.menu_id);
      ruleForm.menu_title=current_active_menu_id_data.menu_title;
      // console.log('ruleForm. ruleForm.menu_title:',ruleForm.menu_title)
      // console.log('selectColumnInfo（val） =',val)
    }


  //校验
  const rules = {
    email: [
      { required: true, message: "请输入邮箱" },
      { maxlength: 150, message: "邮箱长度超限" },
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
        $postData('/data/backend/edit_tag_data.json', ruleForm)
          .then(response => {
            //把修改或添加消息广播出去
            // const msg_content=response.action_success_data;
            if (route.query.action == "edit") {
              //模拟
              let msg_content = {
                tag_id: route.query.id ? Number(route.query.id) : 1,
                menu_id: ruleForm.menu_id,
                menu_name: ruleForm.menu_name,
                menu_title: ruleForm.menu_title,
                tag_name:ruleForm.tag_name ,
                tag_keywords: ruleForm.tag_keywords,
                tag_description: ruleForm.tag_description,
                is_pulled: ruleForm.is_pulled === true ? 1 : 0,
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
                menu_name: ruleForm.menu_name,
                menu_title: ruleForm.menu_title,
                tag_name:ruleForm.tag_name ,
                tag_keywords: ruleForm.tag_keywords,
                tag_description: ruleForm.tag_description,
                is_pulled: ruleForm.is_pulled === true ? 1 : 0,
                account_status: "edit-tag",
                created_time: "1687938191",
                update_time: "1728874350",
              }


              sendMsg('add-tag', msg_content);
              $message('添加成功', 'success');

            }


          })
          .catch(error => {
            // console.log(' getPageLayoutData()=>error:',error)
            $message('请求未找到', 'error');
            // $message('请求未找到', 'error');
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
    $postData('/data/backend/edit_tag_data.json', edit_current_id_data)
      .then(response => {

        ruleForm.tag_id = response.tag_id;
        ruleForm.menu_id = response.menu_id;
        ruleForm.menu_name = response.menu_name;
        ruleForm.menu_title = response.menu_title;

        ruleForm.tag_name = response.tag_name;
        ruleForm.tag_keywords = response.tag_keywords;
        ruleForm.tag_description = response.tag_description;
        ruleForm.is_pulled = response.is_enable == 1 ? true : false;

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
  const menu_data = ref([]);

  // 获取页面框架数据
  function getAddOrEditPageLayoutData() {


    $getData('/data/backend/tag_page_layout_data.json')
      .then(response => {

        menu_data.value = response.menu_data;

      })
      .catch(error => {
        // console.log(' getPageLayoutData()=>error:',error)
        $message('请求未找到', 'error');
        // $message('请求未找到', 'error');
      });

  }


  onMounted(() => {


    if (Object.keys(route.query).length > 0) {
      //如果是action=="edit"，那么获取当前编辑id数据
      if (route.query.action == "edit") {
        getEditCurrentIdData(route.query);
        getAddOrEditPageLayoutData();
      } else if (route.query.action == "add") {
        getAddOrEditPageLayoutData();
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