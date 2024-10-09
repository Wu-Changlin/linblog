<template>
    <div>

        <Table :tableHeader="tableHeader"> 
            <template #search>
                搜索
            </template>


            <template #filter>
                查找
            </template>

            <!-- 图片列特殊处理 start-->
            <template #avatar="articel_cover">

            <el-image class="gvb_table_avatar" :src="scope.row.articel_cover" />
                
            </template>
            <!-- 图片列特殊处理 end-->


        </Table>    
    </div>

    
</template>

<script setup>
import { ref,reactive,getCurrentInstance } from "vue";
import Table from "@/components/backend/table.vue";
const {proxy}	= getCurrentInstance();





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
showAddUserDialog:false,
dialog_title:'',
})






</script>

<style lang="scss" scoped>
   
</style>
