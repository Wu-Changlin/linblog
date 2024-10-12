<template>


  <div class="feeds-page">
    <div class="feeds-container">

        




  <!-- <el-button type="primary"  @click="addUserDialog">添加用户</el-button>
  <el-button type="primary"  @click="editUserDialog">编辑用户</el-button> -->



  

  <Table  v-if="flag" :parentPageTableData="user_list_data" :parentPagePaginationData="pagination_data" 
  :tableHeader="tableHeader"  @getPaginationChangeData="getChildPaginationChangeData" 
  @batchRemoveCurrentActiveIds="batchRemoveChildCurrentActiveIds"  @deleteCurrentActiveId="deleteChildCurrentActiveId"> 


    <template #query>
      <el-form  :model="query_form_data" @keyup.enter="queryInputData()">
        <div style="display: flex;flex-direction: column;">
        <el-form-item>
        <el-input v-model="query_form_data.nike_name" placeholder="搜索用户昵称" style="width: 200px">
        </el-input>
      </el-form-item>
        <el-form-item>
        <el-select  style="width: 200px" v-model="query_form_data.role" placeholder="请选择">
          <el-option v-for="item in options" :key="item.role" :label="item.label" :value="item.role" />
        </el-select>
      </el-form-item>

        <el-form-item>
        <div style="width: 100%;">
          <el-button type="primary" @click="queryInputData()">查询</el-button>
          <el-button type="primary" @click="resetPageData()">重置</el-button>
        </div>
        
        </el-form-item>
      </div>
      </el-form>
    </template>

    <template #add>
      <el-button type="primary"  @click="clickGotoAddOrEditPage(0)">添加用户</el-button>
    </template>
    <template #edit="active_data">
      <el-button size="small" type="primary"  @click="clickGotoAddOrEditPage(active_data)">编辑</el-button>
    </template>
   


    <!-- 图片列特殊处理 start-->
<template #avatar="scope">

<el-image class="table_img" :src="scope.row.avatar" />
            
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
const $postData = inject('$postData');
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
let routeUrl ='';
//如果存在当前选中id，那么携参跳转到添加/编辑页面。
if(current_active_data){
let  article_id =current_active_data.active_data;
  routeUrl = router.resolve({ name: router_name, query: { id: article_id }, key: new Date().getTime() });

}else{//跳转到添加页面。
  routeUrl = router.resolve({ name: router_name,key: new Date().getTime() });

}
 //  console.log('routeUrl',routeUrl);
window.open(routeUrl.href, '_blank');//打开新窗口

}
/*操作表格数据 结束*/ 

//表头  //scopedSlot 自定义插槽的名字
const tableHeader= [
        {prop: "user_id",label: "user_id",key:"user_id"},
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



const options = [
    {
      role: 1,
      label: "管理员",
    },
    {
      role: 2,
      label: "普通用户",
    },
  ];





//保存初始化数据
const init_query_form_data ={
  nike_name: '',
  role: '',
}
//查询当前活动的输入数据，使用reactive变成响应式数据
const query_form_data = reactive({...init_query_form_data});

//重置函数
const resetQueryFormData = () => {
  Object.assign(query_form_data,init_query_form_data)
}



//执行查询当前活动的输入数据
    function queryInputData(){
      // console.log("查询当前活动的输入数据:",query_form_data);
      // 合并
      let query_data={...query_form_data};
    //去除 JavaScript 对象中的空值和空对象
    query_data = removeEmptyValues(query_data);
    //如果有查询数据，那么添加到路由参数。
    if(Object.keys(query_data).length > 0){//Object.keys会转化一个数组，判断非空对象
      query_data.current_page=1; //当前页数  将当前页设置为1，确保每次执行查询都是从第一页开始
      query_data.current_page_limit=10; // 每页显示个数选择器的选项设置   将每页显示个数设置为10，确保每次执行查询都是显示个数为10
      // 执行跳转
      router.push({ name:route.name, query: query_data, key: new Date().getTime() });
      // 获取查询数据
      $postData('/data/backend/query_data.json',query_data)
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

    }else{
      $message('请先输入查询内容', 'warning');
    }

    }



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



function getChildPaginationChangeData(article_pagination){
  console.log('getChildPaginationChangeData(article_pagination):',JSON.stringify(article_pagination));
  flag.value = false;
  // 有效载荷数据
    let payload_data={}; 
    let query_data={...query_form_data};
      //去除 JavaScript 对象中的空值和空对象
      query_data = removeEmptyValues(query_data);
    //如果有查询数据，那么添加到路由参数。
    if(Object.keys(query_data).length > 0){//Object.keys会转化一个数组，判断非空对象
      payload_data=Object.assign(query_form_data,payload_data);
    }

    payload_data=Object.assign(article_pagination,payload_data);
        // 获取查询数据
        $postData('/data/backend/user_list.json',payload_data)
  .then(response => {
    user_list_data.value=response.user_list_data;
    pagination_data.current_page=response.current_page;
    pagination_data.current_page_limit=response.current_page_limit;
    pagination_data.total_count=response.total_count;

   // TODO    需要根据每页显示个数重新计算
     // 模式模式 分页用当前选中值
    let slice_start = Math.floor(Math.random()*10); // 要删除的元素下标
    pagination_data.current_page=article_pagination.current_page;
    pagination_data.current_page_limit=article_pagination.current_page_limit; 



    user_list_data.value = getRandom( user_list_data.value,pagination_data.current_page_limit);
    console.log('getChildPaginationChangeData-user_list_data.value:',user_list_data.value);

    flag.value = true;
    // is_loading.value = false;
  })
  .catch(error => {
// console.log('error:',error)
    $message('请求未找到', 'error');
    // $message('请求未找到', 'error');
  });

}


// 重置页面数据 （点击表单重置按钮）
function resetPageData(){
  router.push({ name:route.name, key: new Date().getTime() });
  //重置函数
  resetQueryFormData();
  //获取页面数据
  getUserListPageData();
}

onMounted(() => {

  
  if(Object.keys(route.query).length > 0){
    console.log(111);
    getChildPaginationChangeData(pagination_data);
  }else{
    getUserListPageData();
  }

});

// 去除 JavaScript 对象中的空值和空对象
function removeEmptyValues(obj) {
    let parsedObj = Object.keys(obj)
    .filter((key) => obj[key] !== null && obj[key] !== undefined && obj[key] !== '')
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
  return parsedObj;
}

function getRandom(array,range) {
    var old_array = array,
      
    //防止超过数组的长度
    range = range > old_array.length?old_array.length:range;
    var newArray = [].concat(old_array), //拷贝原数组进行操作就不会破坏原数组
        valArray = [];
    for (var n = 0; n<range;n++){
             var r = Math.floor(Math.random() * (newArray.length));
        valArray.push(newArray[r]);
        //在原数组删掉，然后在下轮循环中就可以避免重复获取
        newArray.splice(r, 1);
    }
    return valArray;
}



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
