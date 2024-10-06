<template>

    <div class="feeds-page">




        <div style="padding-top: 72px;"></div>
        <div class="tag-container">
            <div> 用户列表</div>
            <div> 轮播图列表</div>
            <div> 文章列表</div>
            <div> 标签列表</div>
            <div> 图片列表</div>
        </div>

        <div class="feeds-container">

            <div> 贡献日历 </div>
            <div> 文章动态 </div>
        </div>


    </div>

</template>

<script setup>
    import { reactive, ref, onMounted, onUpdated, inject, getCurrentInstance, watch, nextTick } from 'vue';
    import { useRoute, useRouter } from "vue-router";
    import ContentTag from '@/components/content_tag.vue';
    //   import ContentCarouselImg from '@/components/content_carousel_img.vue';
    import Waterfall from '@/components/waterfall.vue';
    import Footer from '@/components/footer.vue';
    import { debounce, throttle } from '@/hooks/debounce_throttle.js';

    const layoutPageOnReachBottomH = ref(null);

    const { proxy } = getCurrentInstance();//组件实例 代理

    const route = useRoute();
    const router = useRouter();


</script>

<style scoped>
    .feeds-page {
        flex: 1;
        /* padding-top: 72px; */
        width: 100%;
        margin: 0;
        /* padding:0px 12px; */
        /* max-width: 1260px; */
        /* 修改盒子大小属性 */
        padding: 0px 12px;
        background-color: var(--bg);
        height: 100vh;
        overflow: auto;

        /* 底部栏内容高度 */
        /* position: relative; */
        .feeds-container {
            /* top: 72px; */
            position: relative;
            margin: 0;
            width: 100%;
            transition: width 0.5s;
            padding-top: 72px;
            background-color: var(--bg);
            /* max-width: 1236px; */
            min-height: 100%;

        }

    }


    .tag-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
        -webkit-user-select: none;
        position: fixed;
        z-index: 9;
        width: 100%;
        max-width: 1260px;
        background-color: var(--bg);

        .content-container {
            /* backdrop-filter: blur(20px); */
            /* width: calc(100vw - 24px); */
            width: 100%;
            max-width: 1260px;
            display: flex;
            position: relative;
            user-select: none;
            -webkit-user-select: none;
            align-items: center;
            font-size: 16px;
            background-color: var(--bg);
            color: var(--text);
            height: 40px;
            white-space: nowrap;
            height: 72px;


        }

        .tag-content {
            display: flex;
            color: var(--text);
            /*这是关键属性，flex模式允许换行 */
            /* flex-wrap: wrap; */

            .active {
                background-color: rgba(0, 0, 0, 0.03);
                border-radius: 999px;
                color: var(--text);
            }

            .tag-item {
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0 15px;
                cursor: pointer;
                -webkit-user-select: none;
                user-select: none;


                /*鼠标移入效果*/
                &:hover {
                    background-color: rgba(0, 0, 0, 0.03);
                    border-radius: 999px;
                    color: var(--text);
                }
            }

        }


        .arrow-more-tag-bnt-container {
            display: block;
            position: relative;
            /* width: 20px; */
            /* max-width: 100%; */
            /* height: 100%; */
            height: 72px;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            -webkit-user-select: none;
            user-select: none;
            right: 10px;
            background-color: var(--bg);

            .svg-icon {
                /* justify-content: center;
        align-items: center; */
                width: 16px;
                height: 16px;
            }
        }




    }
</style>