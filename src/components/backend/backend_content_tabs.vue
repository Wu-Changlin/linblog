<template>

  <div style="padding-top: 72px;"></div>
  <div class="tags">

    <div style="margin-left: 10px;">
      <el-tag v-for="(menu_path,menu_title) in parent_page_tabs_list_data" :key="menu_path" :closable="menu_path!=='/admin/home'"
        :effect="route.path===menu_path?'dark':'plain'"  @click="clickMenu(menu_path)">
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



	const parent_page_tabs_list_data = inject('tabs_list_data');

  console.log('parent_page_tabs_list_data:',parent_page_tabs_list_data)



  	//侧边栏菜单点击
	function clickMenu(menu_path) {
//路由跳转
router.push({ path: menu_path })
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
    margin: 0px 12px;
    background-color: var(--bg);
    /* height: 72px; */
  }

  .el-tag {
    margin-right: 10px;
    cursor: pointer;
  }
</style>