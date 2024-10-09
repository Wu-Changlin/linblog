<template>

  <div style="padding-top: 72px;"></div>
   <div class="tags">
 <el-tag
 v-for="(tag,index) in tags"
 :key="tag.menu_name"
 :closable="tag.menu_name!=='admin'"
 :effect="route.name===tag.menu_name?'dark':'plain'"
 >
{{tag.menu_title }}
 </el-tag>
   </div>

</template>


<script setup>
  import { reactive, ref, nextTick, onMounted, getCurrentInstance, onUnmounted, watch, inject, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { debounce, throttle } from '@/hooks/debounce_throttle.js';

  const route=useRoute();
  const router=useRouter();

  const tags=ref([
    {
          "menu_id": 30,
          "menu_title": "首页",
          "menu_name": "admin",
          "menu_path": "/admin",
         

    },
    {
          "menu_id": 90,
          "menu_title": "页",
          "menu_name": "sss",
          "menu_path": "/sss",
          

    }
])



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
.tags{
    margin:20px 0 0 20px;
    height: 72px;
}
.el-tag{
    margin-right:10px;
}
</style>