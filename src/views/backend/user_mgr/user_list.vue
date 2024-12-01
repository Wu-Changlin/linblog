<template>
  <div class="feeds-page">
    <div class="feeds-container">
      <BackendContentTabs></BackendContentTabs>

  <Table  v-if="flag" :parentPageTableData="user_list_data" :parentPagePaginationData="pagination_data" 
  :tableHeader="table_header"  @getPaginationChangeData="getChildPaginationChangeData" 
  @batchRemoveCurrentActiveIds="batchRemoveChildCurrentActiveIds"  @deleteCurrentActiveId="deleteChildCurrentActiveId"> 
    
  <!-- 搜索区域 开始-->
    <template #query>
      <el-form :inline="false" class="flex-form" :model="query_form_data" @keyup.enter="queryInputData()">
        <!-- <div style="display: flex;flex-direction: column;"> -->
        <el-form-item label="用户昵称">
          <el-input v-model="query_form_data.nick_name" placeholder="搜索用户昵称">
          </el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="query_form_data.email" placeholder="搜索邮箱">
          </el-input>
        </el-form-item>

        <el-form-item label="角色">
          <el-select  v-model="query_form_data.role" placeholder="请选择">
            <el-option v-for="item in options_role_data" :key="item.role" :label="item.label" :value="item.role" />
          </el-select>
        </el-form-item>

        <el-form-item class="el-form-item-button">
    
          <el-button type="primary" @click="queryInputData()">查询</el-button>
          <el-button type="primary" @click="resetPageData()">重置</el-button>
 
        
        </el-form-item>
      <!-- </div> -->
      </el-form>
    </template>
<!-- 搜索区域 结束-->
    <template #add>
      <el-button type="primary"  @click="clickGotoAddAndEditPage(0,'add')">添加用户</el-button>
    </template>
    <template #edit="active_data">
      <el-button size="small" type="primary"  @click="clickGotoAddAndEditPage(active_data,'edit')">编辑</el-button>
    </template>

    <!-- 图片列特殊处理 开始-->
<template #avatar="scope">

<el-image class="table_img" :src="scope.row.avatar" />
            
</template>
<!-- 图片列特殊处理 结束-->

    
  </Table>


</div>


</div>
</template>

<script setup>
import { ref,reactive,inject,onMounted,onUnmounted,computed} from "vue";
import {useRoute,useRouter}  from "vue-router";
import BackendContentTabs from "@/components/backend/backend_content_tabs.vue";  
import ArticleCoverList from '@/components/backend/article_cover_list.vue';
import Table from "@/components/backend/table.vue";
import {listenMsg} from '@/components/cross_tag_msg/crossTagMsg.js';
import userModuleApi from "@/api/backend/user.js";//api接口


const route=useRoute();
const router=useRouter();

  //使用 provide inject 代替getCurrentInstance
  const $verify = inject('$verify');
const $message = inject('$message');

/*操作表格数据 开始*/ 

function batchRemoveChildCurrentActiveIds(active_ids){
  console.log('batchRemoveChildCurrentActiveIds(active_ids):',active_ids)

}

function deleteChildCurrentActiveId(active_id){
  console.log('deleteChildCurrentActiveId(active_id):',active_id)

}


//点击跳转到添加/编辑页面(同一页面)
function clickGotoAddAndEditPage(current_active_data,actions){

  
//获取页面名称前缀：使用slice方法，是从开始到"_"的位置之。
let prefix_name  = route.name.slice(0, route.name.indexOf('_'));

let router_name=prefix_name+'_add_edit';
let routeUrl ='';
let query_data={};

//如果存在当前选中id，那么当前选中id赋值到query_data中。
if(current_active_data){
  query_data.id =current_active_data.active_data;
}
query_data.action=actions;
routeUrl = router.resolve({ name: router_name, query:query_data, key: new Date().getTime() });
 //  console.log('routeUrl',routeUrl);
window.open(routeUrl.href, '_blank');//打开新窗口

}
/*操作表格数据 结束*/ 

//表头  //scopedSlot 自定义插槽的名字
const table_header= ref([]);
//选择器数据
const options_role_data = ref([]);

// 获取页面框架数据
function getPageLayoutData(){

  userModuleApi.getPageLayoutData({})
  .then(response => {
    table_header.value=response.table_header;
    options_role_data.value=response.options_role_data;
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


//保存初始化数据
const init_query_form_data ={
  nick_name: '',
  email:'',
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
      userModuleApi.queryInputData(query_data)
  .then(response => {
    user_list_data.value=response.user_list_data;
    pagination_data.current_page=response.current_page;
    pagination_data.current_page_limit=response.current_page_limit;
    pagination_data.total_count=response.total_count;
  
    // 
// TODO   如果有查询数据，那么过滤表格数据
    let math_role_data= computed(() => {
      return user_list_data.value.filter(user => user.role === query_data.role);
    })
    // console.log('math_role_data:',math_role_data.value);

user_list_data.value=math_role_data.value;

    flag.value = true;
    // is_loading.value = false;

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
  //获取表格数据
  function getUserListPageData() {

  userModuleApi.getUserListPageData(pagination_data)
  .then(response => {
    user_list_data.value=response.user_list_data;
    pagination_data.current_page=response.current_page;
    pagination_data.current_page_limit=response.current_page_limit;
    pagination_data.total_count=response.total_count;
  
    // console.log('user_list_data',user_list_data.value)

    flag.value = true;
    // is_loading.value = false;

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



function getChildPaginationChangeData(article_pagination){

  flag.value = false;
  // 有效载荷数据
    let payload_data={}; 
    let query_data={...query_form_data};
      //去除 JavaScript 对象中的空值和空对象
      query_data = removeEmptyValues(query_data);
    //如果有查询数据，那么合并查询数据。Object.assign如果有同名属性的话，后面的属性值会覆盖前面的属性值。
    if(Object.keys(query_data).length > 0){//Object.keys会转化一个数组，判断非空对象
      payload_data=Object.assign(query_data,payload_data);
    }
    //合并分页数据
    payload_data=Object.assign(article_pagination,payload_data);

      // 执行跳转
router.push({ name:route.name, query: payload_data, key: new Date().getTime() });
        // 获取查询数据
        userModuleApi.getChildPaginationChangeData(payload_data)
  .then(response => {
    user_list_data.value=response.user_list_data;
    pagination_data.current_page=response.current_page;
    pagination_data.current_page_limit=response.current_page_limit;
    pagination_data.total_count=response.total_count;

  
     // 模式模式 分页用当前选中值
    let slice_start = Math.floor(Math.random()*10); // 要删除的元素下标
    pagination_data.current_page=article_pagination.current_page;
    pagination_data.current_page_limit=article_pagination.current_page_limit; 

    // TODO   如果有查询数据，那么过滤表格数据

  if(article_pagination.role){
    // console.log('role-user_list_data.value :',user_list_data.value,  ",article_pagination.role:",article_pagination.role)
     // 计算属性，筛选出查询数据和表格数据相等元素的数据
    let math_role_data= computed(() => {
      return user_list_data.value.filter(user => user.role === article_pagination.role);
    })

    // console.log('math_role_data:',math_role_data.value);


    user_list_data.value=math_role_data.value;
    //  let math_role = user_list_data.value.filter(user => user.role === 1);
    // console.log('user_list_data.value.filter(user => user.role === 1):',user_list_data.value.filter(user => user.role === 1));
    // console.log('math_role :',math_role)

  }

    user_list_data.value = getRandom(user_list_data.value,pagination_data.current_page_limit);
    // console.log('getChildPaginationChangeData-user_list_data.value:',user_list_data.value);

    flag.value = true;
    // is_loading.value = false;
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


// 重置页面数据 （点击表单重置按钮）
function resetPageData(){
  router.push({ name:route.name, key: new Date().getTime() });
  //重置函数
  resetQueryFormData();
  //获取页面数据
  getUserListPageData();
}




/**
* 配置 seo
* @param title 网页标题
* @param key 关键词
* @param des 描述
*/
function setMeta (title,key,des){
let  title_default = "网站名称";
if(title){
title_default += title;
}


key= key  || '默认关键词',
des=  des   || '默认描述',

document.title = title_default;
let meta = document.querySelector('meta[name="keywords"]');

if (meta) {
console.log('meta:',meta)
meta.setAttribute('content', key);
} else {
console.error('No meta tag with name="keywords" found');
}
document.querySelector('meta[name="keywords"]').setAttribute('content', key);
document.querySelector('meta[name="description"]').setAttribute('content', des);
}



onMounted(() => {

  
  if(Object.keys(route.query).length > 0){

    let route_query_str =  JSON.stringify(route.query);


route_query_str= convertStringToNumber(route_query_str);

let route_query_obj =JSON.parse(route_query_str); 
    getChildPaginationChangeData(route_query_obj);
  }else{
    getUserListPageData();
  }
  getPageLayoutData();
// setMeta();
});


// 去除 JavaScript 对象中的空值和空对象
function removeEmptyValues(obj) {
    let parsedObj = Object.keys(obj)
    .filter((key) => obj[key] !== null && obj[key] !== undefined && obj[key] !== '')
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
  return parsedObj;
}

function getRandom(data_array,range) {
    let old_array = data_array;
      
    //防止超过数组的长度
    range = range > old_array.length?old_array.length:range;
    let newArray = [].concat(old_array), //拷贝原数组进行操作就不会破坏原数组
        valArray = [];
    for (let n = 0; n<range;n++){
             let r = Math.floor(Math.random() * (newArray.length));
        valArray.push(newArray[r]);
        //在原数组删掉，然后在下轮循环中就可以避免重复获取
        newArray.splice(r, 1);
    }
    return valArray;
}


/*
使用了正则表达式和replace函数，将引号包围的数字替换为无引号的数字。
*/
function convertStringToNumber(current_string) {
 
  let old_string=current_string
 let new_string = old_string.replace(/"(\d+)"/g, function(match, p1) {
    return  p1;
  });

  return new_string;
}

//监听跨标签消息
const cancelListen= listenMsg((msgInfo)=>{
  if(msgInfo.type==='add-user'){
    // unshift()方法将一个或多个元素添加到数组的开头，并返回新数组的长度。
    user_list_data.value.unshift(msgInfo.content);
  }else if(msgInfo.type==='edit-user'){
    const i=user_list_data.value.findIndex((e)=>e.user_id===msgInfo.content.user_id);
    console.log('msgInfo.content.article_id:',msgInfo.content.article_id,',user_list_data.value[i]:',JSON.stringify(user_list_data.value))
    
    if(i>=0){
      user_list_data.value[i]=msgInfo.content;

    }
  }

  // console.log(`监听到其他标签页的消息：msgInfo.type:${msgInfo.type},msgInfo.content:${msgInfo.content}`)

})


onUnmounted(() => {
  cancelListen;//移除监听跨标签消息
})


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


    .flex-form {
  display: flex;
  flex-wrap: wrap;
}
.flex-form > .el-form-item {
  flex: 0 0 auto; /* 不允许缩放，基于内容宽度 */
  margin: 15px; /* 表单项间隔 */
  width: 220px;
}


.el-form-item-button{
  width: 100% !important;
}
</style>
