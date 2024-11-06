<template>

  <div style="padding-top: 72px;"></div>
  <div class="tags">

    <div style="margin-left: 10px;">
      <el-tag v-for="(menu_path,menu_title) in parent_page_tabs_list_data" :key="menu_path" :closable="menu_path!=='/admin/home'"
        :effect="route.path===menu_path?'dark':'plain'"  @click="clickMenu(menu_path)" @close="handleClose(menu_title)">
        {{menu_title}}
      </el-tag>
    </div>


  </div>

</template>


<script setup>
  import { reactive, ref, nextTick, onMounted, getCurrentInstance, onUnmounted, watch, inject, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { debounce, throttle } from '@/hooks/debounceOrThrottle.js';

  const route = useRoute();
  const router = useRouter();



  // 注入来自admin页面（公共）提供标签数据集
	const parent_page_tabs_list_data = inject('tabs_list_data');

  // 注入来自admin页面（公共）提供Tabs 标签页关闭tag的方法
	const parentPageCloseTagFunction = inject('closeTag');

  // console.log('parent_page_tabs_list_data:',parent_page_tabs_list_data)

  	//点击标签
	function clickMenu(menu_path) {
//路由跳转
router.push({ path: menu_path })
}

//点击关闭标签
function handleClose(menu_title){

  // console.log('关闭menu_title：',menu_title);
// hasOwnProperty()方法返回一个布尔值，如果对象包含指定名称的属性，返回true；否则返回false。
 const exist_status=parent_page_tabs_list_data.value.hasOwnProperty(menu_title);
 //如果存在指定名称的属性，那么调用方法移除该标签
 if(exist_status){
  parentPageCloseTagFunction(menu_title);


 }

}



  onMounted(() => {


  })


  onUnmounted(() => {
    //离开页面时移除监听窗口响应式每行最多标签数量
    // window.removeEventListener('resize', maxItemsPerLines);
    //吸顶效果
    // window.removeEventListener('scroll', handleScroll);
    // stopHiddenTagContentRetWatch.value=null; // 如果watch返回了一个停止监听的函数，调用它
  })

</script>

<style scoped>
  .tags {
    width: 100%;
    height: 70px;
    z-index: 10;
    display: flex;
    position: fixed;
    align-items: center;
    /* margin: 0px 12px; */
    background-color: var(--bg);
    /* height: 72px; */
  }

  .el-tag {
    margin-right: 10px;
    cursor: pointer;
  }
</style>