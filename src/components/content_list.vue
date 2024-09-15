<template>
  
  <div class="feeds-page">
  
    
   
    <ContentTag></ContentTag>
    
   
    <div class="loading-container"></div>

    <div class="feeds-container">

     
      <ContentCarouselImg></ContentCarouselImg>
      <Waterfall></Waterfall>
    </div>

   

  </div>

</template>


<script setup>
import { reactive ,ref} from 'vue';
import { useRouter } from "vue-router";
import ContentTag from '@/components/content_tag.vue';
import ContentCarouselImg from '@/components/content_carousel_img.vue';
import Waterfall from '@/components/waterfall.vue'



const router = useRouter();

</script>

<style  scoped>



.feeds-page {
  flex: 1;
  padding-top: 72px;
  width: 100%;
  margin: 0 auto;
  padding-left: 12px;
  padding-right: 12px;
  max-width: 1260px;
  /* 修改盒子大小属性 */
  /* box-sizing: border-box; */
 

  .feeds-container {
    position: relative;
    transition: width 0.5s;
    margin: 0 auto;
    width: 100%;

  }
}




</style> 