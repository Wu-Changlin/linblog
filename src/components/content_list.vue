<template>
  
  <div class="feeds-page">
  
    

    <div  style="margin-top: 72px;">
      <ContentTag></ContentTag>

    </div>
    


    <div class="feeds-container">
      <slot></slot>
      <!-- 注意这里的插槽，用于存放兄弟组件 如轮播图组件-->
    
      <Waterfall></Waterfall>
    </div>

   

  </div>

</template>


<script setup>
import { reactive ,ref} from 'vue';
import { useRouter } from "vue-router";
import ContentTag from '@/components/content_tag.vue';
import Waterfall from '@/components/waterfall.vue'


const router = useRouter();

</script>

<style  scoped>



.feeds-page {
  flex: 1;
  /* padding-top: 72px; */
  width: 100%;
  margin: 0;
  /* padding:0px 12px; */
  /* max-width: 1244px; */
  /* 修改盒子大小属性 */
  padding:0px 12px;
  background-color: var(--bg);

  .feeds-container {
    /* top: 72px; */
    position: relative;
    margin: 0;
    /* width: 100% - 24px; */
    transition: width 0.5s;
    padding-top: 72px;
    background-color: var(--bg);
    /* max-width: 1236px; */
  }

 
}






</style> 