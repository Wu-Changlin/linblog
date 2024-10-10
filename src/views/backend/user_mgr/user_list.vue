<template>


  <div class="feeds-page">
    <div class="feeds-container">

        



<div>
  <!-- <el-button type="primary"  @click="addUserDialog">添加用户</el-button>
  <el-button type="primary"  @click="editUserDialog">编辑用户</el-button> -->



  <el-dialog
      v-model="data.showAddUserDialog"
      :rules="rules"
      :showCancel="false"
      @close="closeAddUserDialog()"
      :title="data.dialog_title"
      width="30%" 
    >  
  
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          label-position="left"
  
        >
          <el-form-item label="用户名称" prop="name">
            <el-input v-model="ruleForm.name"  placeholder="亲，请输入用户名称"></el-input>
          </el-form-item>
  
  
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" placeholder="亲，请输入邮箱"></el-input>
          </el-form-item>
  
          <el-form-item v-model="ruleForm.cover" label="头像" prop="cover">
            
            <el-button class="cover_card" @click="dialogConfig.is_show=true">
  
              <img     v-if="selected.cover_path" :src="selected.cover_path" alt="" class="cover_img" >
						<svg-icon v-else style="width: 20;height: 20;" class="reds-icon" icon-class="search" />

  
            </el-button>
                                  
            <ArticleCoverList :key="dialogConfig.is_show" :is_show="dialogConfig.is_show"  @close="dialogConfig.is_show = false" @success="SelectCover"></ArticleCoverList>
  
          </el-form-item>
  
  
          <el-form-item label="密码" prop="password">
            <el-input v-model="ruleForm.password" type="password" placeholder="亲，请输入密码" show-password>
            </el-input>
          </el-form-item>
              
  
          <el-form-item label="再次密码" prop="again_password">
            <el-input v-model="ruleForm.again_password" type="password" placeholder="亲，请再次输入密码" show-password>
            </el-input>
          </el-form-item>
              
          
          <el-form-item label="角色" prop="resource">
            <el-radio-group v-model="ruleForm.resource">
              <el-radio label="1">管理员</el-radio>
              <el-radio label="2">普通用户</el-radio>
            </el-radio-group>
          </el-form-item>
  
        </el-form>
  
  
        <template #footer>
          <div>
            <el-button @click="closeAddUserDialog()">取消</el-button>、
            <el-button type="primary" @click="submitForm()">确认</el-button>
          </div>
        </template>
  
  
  
  </el-dialog>
  

  <Table :tableHeader="tableHeader"> 

    <template #add>
      <el-button type="primary"  @click="addUserDialog()">添加用户</el-button>
    </template>
    <template #edit>
      <el-button type="primary"  @click="editUserDialog()">编辑</el-button>
    </template>
   


    <!-- 图片列特殊处理 start-->
<template #avatar="scope">

<el-image class="gvb_table_avatar" :src="scope.row.avatar" />
            
</template>
<!-- 图片列特殊处理 end-->

    
  </Table>
</div>

</div>


</div>
</template>

<script setup>
import { ref,reactive } from "vue";
import ArticleCoverList from '@/components/backend/article_cover_list.vue'
import Table from "@/components/backend/table.vue";
const {proxy}	= getCurrentInstance();



//表头  //scopedSlot 自定义插槽的名字
const tableHeader= [
        {prop: "id",label: "id",key:"id"},
        {prop: "nike_name",label: "昵称",key:"nike_name"},
        {prop: "avatar",label: "头像",key:"avatar",scopedSlot:"avatar"},
        {prop: "email",label: "邮箱",key:"email"},
        {prop: "role",label: "角色",key:"role"},
        {prop: "account_status",label: "账号状态",key:"account_status"},
        {prop: "ip",label: "登陆ip",key:"ip"},
        {prop: "created_time",label: "创建时间",key:"created_time"},
        {prop: "update_time",label: "更新时间",key:"update_time"},
        {prop: "delete_time",label: "删除时间",key:"delete_time"},
        
];

//封面 start

// dialogConfig 控制显示/隐藏封面图片列表
const dialogConfig = reactive({
  is_show: false,
})

  
//接收子组件emit('success',id,path)，确认选中的封面图片id
function SelectCover(cover_id,cover_path) {
  // console.log('SelectCover id='+cover_id); 
  // console.log('SelectCover path='+cover_path); 

  selected.cover_id=cover_id;
  selected.cover_path=cover_path;


}

//封面数据初始化
const selected=reactive({
  cover_id:'',
  cover_path:'',
})
  
//封面 end




//表格数据
const data=reactive({
    showAddUserDialog:false,
    dialog_title:'',
})
  


//添加用户
function addUserDialog(){
  data.showAddUserDialog=true;
  data.dialog_title="添加用户";
}


//编辑用户
function editUserDialog(){
  data.showAddUserDialog=true;
  data.dialog_title="编辑用户";

}


//添加/编辑用弹窗 start

//表单ref
const ruleFormRef = ref();
  

//表单取消操作
function closeAddUserDialog(){
    ruleFormRef.value.resetFields();//重置表单 防止数据混淆
    data.showAddUserDialog = false; //关闭弹窗
}

//表单确认操作
function submitForm(){
  
  data.showAddUserDialog = false; //关闭弹窗

}
  

//初始化添加数据
const ruleForm=reactive({
  name:"",
  email:"",
  cover:"",
  password:"",
  again_password:"",
  resource:"",

})


//两次密码一致性校验      第二次输入需和第一次输入一致
const checkPassword=(rule,value,callback)=>{
  // console.log(ruleForm.password);
  if(value !== ruleForm.password){
    callback(new Error(rule.message));
  }else{
    callback();
  }
  }


//校验
const rules = reactive({
  name: [
    { required: true, message: '请输入名称'},
    { min: 3, max: 20, message: '长度范围 3 至 20' },
  ],
  email: [
    { required: true, message: "请输入邮箱" },
    { maxlength: 150, message: "邮箱长度超限" },
    { validator: proxy.Verify.email, message: "邮箱格式有误" },
  ],
  password:[
    { required: true, message: "请输入密码" },
    { validator: proxy.Verify.password, message: "格式包含字母、数字、特殊字符，9-18位" },

  ],
  again_password:[
    { required: true, message: "请再次输入密码" },
    { validator: checkPassword, message: "两次输入密码不一致" },
    { validator: proxy.Verify.password, message: "格式包含字母、数字、特殊字符，9-18位" },
  ],
  resource:[
  { required: true, message: "请选择角色" },
  ]
  
})
  
//添加/编辑用弹窗 end
  



</script>

<style scoped>
     .feeds-page {
        flex: 1;
     
        width: 100%;
        margin: 0;
        /* padding:0px 12px; */
        /* max-width: 1260px; */
        /* 修改盒子大小属性 */
        padding: 0px 12px;
        /* background-color: var(--bg); */
        height: 100vh;
        overflow: auto;
        background-color: #eee;
        /* 底部栏内容高度 */
        /* position: relative; */
        .feeds-container {
            /* top: 72px; */
            position: relative;
            margin: 0;
            width: 100%;
            transition: width 0.5s;
            margin-top: 10px;
            /* max-width: 1236px; */
            min-height: 100%;
            

        }

    }
</style>
