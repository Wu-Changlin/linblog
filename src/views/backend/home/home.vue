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