<template>

    <div class="feeds-page">
        <div class="feeds-container">

            <div> 贡献日历 </div>
            <div> 文章动态 </div>
        </div>


    </div>

</template>

<script setup>
    import { reactive, ref, onMounted, onUpdated, inject, watch, nextTick } from 'vue';
    import { useRoute, useRouter } from "vue-router";
    import ContentTag from '@/components/content_tag.vue';
    //   import ContentCarouselImg from '@/components/content_carousel_img.vue';
    import Waterfall from '@/components/waterfall.vue';
    import Footer from '@/components/footer.vue';
    import { debounce, throttle } from '@/hooks/debounceOrThrottle.js';


    const route = useRoute();
    const router = useRouter();
    
    onMounted(() => {
        setMeta();
      // 你的逻辑代码
    });
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
            /* background-color: var(--bg); */
            /* max-width: 1236px; */
            min-height: 100%;

        }

    }



</style>