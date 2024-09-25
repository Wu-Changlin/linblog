
<template>
  <transition name="scale-down" mode="out-in">
<!-- 骨架屏 开始-->
    <!-- <div v-if="is_loading" key="loading" class="waterfall-skeleton" ref="waterfallSkeletonContainerRef"> -->
      <div v-if="isloading" key="loading" class="waterfall-skeleton" ref="waterfallSkeletonContainerRef">
      
      <div
      class="item"
      v-for="(item, index)  in 10" 
      :key="item"
      :data-item='item'
      :data-index='index'
      :style="{background: 'rgba(0, 0, 0, 0.04)', width:skeleton_width + 'px'}" >
     
      <!-- 图片占位 -->
      <Skeleton bg="#e4e4e4" :width="skeleton_width + 'px'" :height="skeleton_height*0.7 + 'px'" animated  style="border-radius: 8px;"/>
      <!-- 标题占位 -->
      <Skeleton bg="#e4e4e4" :width="skeleton_width + 'px'" height="24px" animated style="margin-top: 12px;" />
      <!-- 作者 -->
      <Skeleton bg="#e4e4e4" :width="skeleton_width*0.25 + 'px'" height="24px" animated style="margin: 12px 0px;" />

      </div>
      
    </div>

<!-- 骨架屏 结束-->
 <!-- 渲染内容 开始-->
      <Waterfall  v-else  key="waterfall-container" class="waterfall-container" v-if="data.list.length>0" :list="data.list" :breakpoints="breakpoints" style="background-color: var(--bg);"
        :delay="300">
        <template #item="{ item,index }">
          <div class="waterfall-card">

            <div v-if="!item.url" class="lazy-img-card-mask">

              
            <LazyImg   class="lazy-img"  :url="item.cover" style="border-radius: 8px" @click="goViewAticle(item.id)"/>
          

            <div class="card-img-mask-stats">
              <div class="card-img-mask-stats-left">
                <span class="card-img-mask-stats-item">
                  <div class="card-img-mask-stats-icon"><svg-icon icon-class="visits" /></div>
                  <span class="card-img-mask-stats-text"> {{ item.visits}}</span>
                </span>
                <span class="card-img-mask-stats-item">
                  <div class="card-img-mask-stats-icon"><svg-icon icon-class="zishu" /></div>
                  <span class="card-img-mask-stats-text"> {{ item.word_count}}</span>
                </span>
    
              </div>
    
              <span class="card-img-mask-stats-reading-time">{{ item.read_time}}</span>
    
            </div>
            </div>

            <div v-else class="lazy-img-card-mask">

                <a :href="item.url" target="_blank">
              
                  <LazyImg   class="lazy-img"  :url="item.cover" style="border-radius: 8px"/>
            
                </a>
              </div>
    
            <div class="footer">
              <a class="title"><span>{{ item.title}}</span></a>
              <div class="author-wrapper">
                <a class="author">
                  <svg-icon class="author-avatar" icon-class="author" />
                  <span class="name"> {{ item.author_name}}</span>
                </a>
                <!-- <span class="like-wrapper like-active">
                     <span  class="like-lottie" style="width: 16px; height: 16px;" ></span>
                      <svg-icon class="reds-icon" style="width: 16px; height: 16px;" icon-class="visits"/>
                      <span class="count">12</span>
                    </span> -->
              </div>
            </div>
          </div>
        </template>
      </Waterfall>
       <!-- 渲染内容 结束-->
    

  </transition>

</template>
<script setup>
  import { reactive, ref, onMounted, onUnmounted ,watch,computed} from 'vue';
  import axios from 'axios';
  import {useRoute, useRouter } from "vue-router";
  import { LazyImg, Waterfall } from "vue-waterfall-plugin-next";
  import "vue-waterfall-plugin-next/dist/style.css";
  import Skeleton from '@/components/skeleton.vue';

  const router = useRouter();
  const route = useRoute();
  // const is_loading=ref(true)



  const data = reactive({
    list: [],
  })




  const props = defineProps({
    parentPageArticleListData: {//父页面传标签数据
      type: Array
    },
    isloading:{
      type:Boolean,
      default:true
    }
  });

  // if(props.isloading){
  //   is_loading.value=props.isloading;
  // }
 

// 使用ref来存储watch返回的函数
const stopPparentPageArticleListData = ref(null);

//监听父页面所传数据。当有新值时，把父页面所传数据赋值到当前页面的data.list   
stopPparentPageArticleListData.value = watch(
       () =>props.parentPageArticleListData,
       (newValue, oldValue) => {
      
        // console.log('n-props.parentPageArticleListData:',props.parentPageArticleListData)
        if(newValue){//如有父页面所传数据更新,那么把父页面所传数据赋值到当前页面的data.list。取消骨架屏 
          data.list = props.parentPageArticleListData;
          

          // is_loading.value=false;
         
        }
       
        
       },
       { immediate: true }
     );




  onMounted(() => {
    //控制骨架屏尺寸
    skeletonHandleResize(); // 初始化尺寸
    window.addEventListener('resize', skeletonHandleResize);

  });


  //去看博文
  function goViewAticle(article_id) {
    //直接跳转
    // const handleChange = () => {
    //   router.push("/testDemo");
    // };
    //带参数跳转
   
    if (article_id) {
      router.push({ name: 'article', query: { id: article_id },key: new Date().getTime() });

      // router.push({ name: 'article', query: { id: article_id }, key: new Date().getTime() });
    //  let routeUrl = router.resolve({ name: 'article', query: { id: article_id },params: {key: article_id},key: new Date().getTime() });
    // //  console.log('routeUrl',routeUrl);
    //  window.open(routeUrl.href, '_blank');//打开新窗口

     
    } else {
      console.log('非法请求')
    }



  }



  //每行显示个数。如没有符合尺寸，默认选择相近条件。
  const breakpoints = ref({
    1424: {
      rowPerView: 5
    },
    1192: {
      rowPerView: 4
    },
    960: {
      rowPerView: 3
    },
    696: {
      rowPerView: 2
    },
    400: {
      rowPerView: 1
    }

  })



  const waterfallSkeletonContainerRef = ref();
  const skeleton_width = ref(236);
  const skeleton_height = ref(236); // 默认高度
  // const skeleton_item= ref(5);
 //控制骨架屏尺寸
  function skeletonHandleResize() {

    if (waterfallSkeletonContainerRef.value) {
      const skeleton_container_width = waterfallSkeletonContainerRef.value.offsetWidth;

      switch (true) {
        case (skeleton_container_width > 1424):
          skeleton_width.value = (skeleton_container_width - 60) / 5;
          skeleton_height.value = skeleton_width.value;
          return 5;

        case (skeleton_container_width > 1192 && skeleton_container_width <= 1424):
          skeleton_width.value = (skeleton_container_width - 60) / 5;
          skeleton_height.value = skeleton_width.value;
          return 5;

        case (skeleton_container_width > 960 && skeleton_container_width <= 1192):
          skeleton_width.value = (skeleton_container_width - 60) / 4;
          skeleton_height.value = skeleton_width.value;
          return 4;

        case (skeleton_container_width > 696 && skeleton_container_width <= 960):
          skeleton_width.value = (skeleton_container_width - 60) / 3;
          skeleton_height.value = skeleton_width.value;
          return 3;

        case (skeleton_container_width > 400 && skeleton_container_width <= 696):
          skeleton_width.value = (skeleton_container_width - 60) / 2;
          skeleton_height.value = skeleton_width.value;
          return 2;

        default:
          skeleton_width.value = skeleton_container_width - 10;
          skeleton_height.value = skeleton_width.value;
          return 1;
      }


      // switch

      // skeleton_width.value = `${width}px`;
      // skeleton_height.value = `${height}px`;
    }
  }



  onUnmounted(() => {
    window.removeEventListener('resize', skeletonHandleResize);//移除骨架屏监听
    stopPparentPageArticleListData.value(); // 如果watch返回了一个停止监听的函数，调用它
  });


</script>


<style scoped>



  .waterfall-card {
    position: relative;

    .lazy-img-card-mask{
      position: relative;

      .lazy-img {
      cursor: pointer;
    }

    .card-img-mask-stats{
    position: absolute;
      padding: 3px 3px;
      bottom: 0px;
      left: 0;
      z-index: 2;
      box-sizing: border-box;
      /* padding: 0px 8px 0px; */
      width: 100%;
      height: 25px;
      border-bottom-right-radius: 6px;
      border-bottom-left-radius: 6px;
      background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .8) 100%);
      color: var(--card_bg);
      font-size: 13px;
      line-height: 18px;
      opacity: 1;
      display: -webkit-flex;
      display: flex;
      align-items: center;
      justify-content: space-between;
      
  
    .card-img-mask-stats-left {
      min-width: 0;
      flex: 1;
      display: -webkit-flex;
      display: flex;
      align-items: center;
      justify-content: flex-start
    }


    .card-img-mask-stats-item {
      margin-right: 12px;
      display: -webkit-flex;
      display: flex;
      align-items: flex-start;
      justify-content: center;

    }

    .card-img-mask-stats-text {
      word-break: keep-all;
    }


    .card-img-mask-stats-icon {
      /* margin-right: 2px; */
      display: flex;
      width: 18px;
      height: 18px;
      /* color: var(--bg); */
      justify-items: center;
      align-items: center;

    }


    .card-img-mask-stats-reading-time{
      display: flex;
      justify-items: center;
      align-items: center;
    }

    .svg-icon{
      width: 18px;
      height: 18px;
    }


	}


    }
 
 




    .footer {
      padding: 12px;


      /* Chrome, Safari, 新版 Edge */
      .title::-webkit-line-clamp {
          -webkit-line-clamp: 2;
      }
      
     /* 旧版 IE */
      .title {
        margin-bottom: 8px;
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        font-weight: 500;
        font-size: 14px;
        line-height: 140%;
        color: var(--text);
      }

      .author-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 20px;
        color: var(--color-secondary-label);
        font-size: 12px;
        transition: color 1s;

        .author {
          display: flex;
          align-items: center;
          /* color: inherit; */
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 12px;

          .author-avatar {
            margin-right: 6px;
            width: 20px;
            height: 20px;
            border-radius: 20px;
            border: 1px solid var(--color-border);
            flex-shrink: 0;
            /* cursor: pointer; */
          }

          .name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;


          }
        }

        .like-wrapper {
          position: relative;

          display: flex;
          align-items: center
        }

        .like-wrapper .count {
          text-wrap: nowrap
        }

        .like-active:hover {
          color: var(--color-primary-label)
        }

        .like-icon.active {
          visibility: hidden
        }

        .like-lottie {
          position: absolute;
          left: 0;
          top: 0;
          transform: scale(1.7)
        }

        .reds-icon {
          display: inline-block;
          vertical-align: middle;
          fill: currentColor;


        }

        .like-wrapper .count {
          margin-left: 2px
        }

      }
    }

  }


  /* 缩放动画 */
  .waterfall-container {
  transition: all 0.3s ease;
  /* animation: grow-in 0.1s forwards; */
}



  /* 骨架屏 */
  .waterfall-skeleton {
    width: 100%;
    max-width: 1244px;
    height: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    transition: all 0.3s ease;
   
    .item {
      width: 236px;
      margin-left: 6px;
      margin-right: 6px;
      margin-bottom: 10px;
      .skeleton~.skeleton {
        display: flex;
        position: relative;
        /* margin: 12px 12px; */
      }
    }
  }



 


  /* 骨架屏缩放动画 */
  .scale-down-enter-active, .scale-down-leave-active {
  transition: all 0.8s ease;
}
 
.scale-down-enter-from, .scale-down-leave-to {
  opacity: 0;
  transform: scale(0.8);
} 

  /* .fade-enter-from,
  .fade-leave-to {
    opacity: 1;
  } */


  /* 骨架屏淡出动画 */
  /* .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 1;
  }

  .fade-enter-to,
  .fade-leave-from {
    opacity: 0;
  } */
</style>