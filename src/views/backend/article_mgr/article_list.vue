<template>

    
  <div class="feeds-page">
    <div class="feeds-container">
    <div>

        <Table :tableHeader="tableHeader"> 

            <template #add>
              <el-button type="primary"  @click="addArticle()">添加文章</el-button>
            </template>
            <template #edit>
              <el-button type="primary"  @click="editArticle()">编辑</el-button>
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
import { ref,reactive,getCurrentInstance } from "vue";
import Table from "@/components/backend/table.vue";
const {proxy}	= getCurrentInstance();


function addArticle(){

}


function editArticle(){

}


// let routeUrl =''; 
//      routeUrl= router.resolve({ name: 'article', query: { id: article_id },key: new Date().getTime() });
//      if (route.query.keyword) {//搜索结果页携参跳转到博文页
//        routeUrl = router.resolve({ name: 'article', query: { id: article_id ,keyword:route.query.keyword},key: new Date().getTime() });
// 		}  

//     //  console.log('routeUrl',routeUrl);
//      window.open(routeUrl.href, '_blank');//打开新窗口


//表头  //scopedSlot 自定义插槽的名字
const tableHeader= [
    {prop: "id",label: "id",key:"id"},
    {prop: "article_title",label: "标题",key:"article_title"},
    {prop: "articel_introduction",label: "简介",key:"articel_introduction"},
    {prop: "articel_author",label: "作者",key:"articel_author"},
    {prop: "article_column",label: "栏目",key:"article_column"},
    {prop: "articel_cover",label: "封面",key:"articel_cover",scopedSlot:"articel_cover"},
    {prop: "articel_tag",label: "标签",key:"articel_tag"},
    {prop: "created_time",label: "创建时间",key:"created_time"},
    {prop: "update_time",label: "更新时间",key:"update_time"},
    {prop: "delete_time",label: "删除时间",key:"delete_time"},
    
];






//表格数据
const data=reactive({
showAddArticle:false,
dialog_title:'',
})






</script>

<style  scoped>
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
