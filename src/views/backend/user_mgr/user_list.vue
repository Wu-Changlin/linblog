<template>


  <div class="feeds-page">
    <div class="feeds-container">

        




  <!-- <el-button type="primary"  @click="addUserDialog">添加用户</el-button>
  <el-button type="primary"  @click="editUserDialog">编辑用户</el-button> -->



  

  <Table  v-if="flag" :parentPageTableData="user_list_data" :parentPagePaginationData="pagination_data" :tableHeader="tableHeader"  @batchRemoveCurrentActiveIds="batchRemoveChildCurrentActiveIds"   @deleteCurrentActiveId="deleteChildCurrentActiveId"> 

    <template #add>
      <el-button type="primary"  @click="clickGotoAddOrEditPage(0)">添加用户</el-button>
    </template>
    <template #edit="active_data">
      <el-button size="small" type="primary"  @click="clickGotoAddOrEditPage(active_data)">编辑</el-button>
    </template>
   


    <!-- 图片列特殊处理 start-->
<template #avatar="scope">

<el-image class="gvb_table_avatar" :src="scope.row.avatar" />
            
</template>
<!-- 图片列特殊处理 end-->

    
  </Table>


</div>


</div>
</template>

<script setup>
import { ref,reactive,inject,onMounted } from "vue";
import {useRoute,useRouter}  from "vue-router";
import ArticleCoverList from '@/components/backend/article_cover_list.vue'
import Table from "@/components/backend/table.vue";

const route=useRoute();
const router=useRouter();

  //使用 provide inject 代替getCurrentInstance
  const $verify = inject('$verify');
  const $getData = inject('$getData');
const $postDta = inject('$postDta');
const $message = inject('$message');

/*操作表格数据 开始*/ 

function batchRemoveChildCurrentActiveIds(active_ids){
  console.log('batchRemoveChildCurrentActiveIds(active_ids):',active_ids)

}

function deleteChildCurrentActiveId(active_id){
  console.log('deleteChildCurrentActiveId(active_id):',active_id)

}


//点击跳转到添加/编辑页面(同一页面)
function clickGotoAddOrEditPage(current_active_data){

  
//获取页面名称前缀：使用slice方法，是从开始到"_"的位置之。
let prefix_name  = route.name.slice(0, route.name.indexOf('_'));

let router_name=prefix_name+'_add_edit';
//如果存在当前选中id，那么携参跳转到添加/编辑页面。
if(current_active_data){
let  article_id =current_active_data.active_data;
  let routeUrl = router.resolve({ name: router_name, query: { id: article_id }, key: new Date().getTime() });
  //  console.log('routeUrl',routeUrl);
  window.open(routeUrl.href, '_blank');//打开新窗口
}else{//跳转到添加页面。
router.push({ name: router_name,key: new Date().getTime() });

}

}
/*操作表格数据 结束*/ 

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
    { validator: $verify.email, message: "邮箱格式有误" },
  ],
  password:[
    { required: true, message: "请输入密码" },
    { validator: $verify.password, message: "格式包含字母、数字、特殊字符，9-18位" },

  ],
  again_password:[
    { required: true, message: "请再次输入密码" },
    { validator: checkPassword, message: "两次输入密码不一致" },
    { validator: $verify.password, message: "格式包含字母、数字、特殊字符，9-18位" },
  ],
  resource:[
  { required: true, message: "请选择角色" },
  ]
  
})
  




  const user_list_data = ref();
  const total_pages = ref(0); //总页数
  const current_page = ref(1);//当前页数
  const flag = ref(false);

const pagination_data = reactive({
  current_page: 1, //当前页数
  current_page_limit: 10, // 每页显示个数选择器的选项设置
  total_count: 0, //总个数
})


  // "total_pages":2,
//   "total_count":12,
//   "current_page":1,
//   "current_page_limit":10,
  //获取数据（内容标签栏数据、博文列表数据（瀑布流组件））  
  function getUserListPageData() {

$getData('/data/backend/user_list.json')
  .then(response => {
    user_list_data.value=response.user_list_data;
    pagination_data.current_page=response.current_page;
    pagination_data.current_page_limit=response.current_page_limit;
    pagination_data.total_count=response.total_count;
  
    console.log('user_list_data',user_list_data.value)

    

    flag.value = true;
    // is_loading.value = false;

  })
  .catch(error => {
    $message('请求未找到', 'error');
    // $message('请求未找到', 'error');
  });
}



onMounted(() => {

  getUserListPageData();

});



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
