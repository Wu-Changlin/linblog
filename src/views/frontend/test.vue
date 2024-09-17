
<template>


    <div class="feeds-page">
	
	  
  
        <div  style="margin-top: 72px;">
          <ContentTag></ContentTag>
    
        </div>
        
    
    
        <div class="feeds-container">
          <!-- <ContentCarouselImg></ContentCarouselImg> -->
        


    <transition name="scale-down" mode="out-in">
  <!-- 骨架屏 开始-->
      <div v-if="is_loading" key="loading" class="waterfall-skeleton" ref="waterfallSkeletonContainerRef">
        
        <div
        class="item"
         v-for="(item, index)  in 5" 
         :key="item"
        :style="{ backgroundColor: '#f0f9f4', width:skeleton_width + 'px'}" >
          <Skeleton bg="#e4e4e4" :width="skeleton_width + 'px'" :height="skeleton_height + 'px'" animated /><!-- 图片占位 -->
          <Skeleton bg="#e4e4e4" :width="skeleton_width + 'px'" height="24px" animated style="margin-top: 12px;" /><!-- 标题占位 -->
          <Skeleton bg="#e4e4e4" width="120px" height="24px" animated style="margin: 12px 0px;" /><!-- 作者 -->
        </div>
        
      </div>
  
  <!-- 骨架屏 结束-->
   <!-- 渲染内容 开始-->
        <Waterfall  v-else  key="waterfall-container" class="waterfall-container" v-if="list.length>0" :list="list" :breakpoints="breakpoints" style="background-color: var(--bg);"
          :delay="300">
          <template #item="{ item,index }">
            <div class="waterfall-card">
      
              <LazyImg class="lazy-img" :url="item.src" style="border-radius: 8px" @click="goViewAticle(item.id)" />
      
      
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


</div>



</div>

  
  </template>
  
  <script setup>
    import { reactive, ref, onMounted, onUnmounted } from 'vue';
    import axios from 'axios';
    import { useRouter } from "vue-router";
    import { LazyImg, Waterfall } from "vue-waterfall-plugin-next";
    import "vue-waterfall-plugin-next/dist/style.css";
    import Skeleton from '@/components/skeleton.vue';


  import ContentTag from '@/components/content_tag.vue';
//   import ContentCarouselImg from '@/components/content_carousel_img.vue';

  
    const router = useRouter();
    const is_loading=ref(true)
    const list = ref([]);
  
    onMounted(() => {
      // 假设JSON文件与组件在同一目录下
      // import('./mock-data.json').then(res => {
      //   items.value = res.data;
      // }).catch(error => {
      //   console.error('Error fetching mock data:', error);
      // });
  
      // 如果你想使用axios来模拟请求，可以这样做
      axios.get('/data/frontend/index.json', { responseType: 'json' })
        .then(response => {
          setTimeout(() => {
             list.value = response.data; // 数据加载完毕，关闭骨架屏
             is_loading.value=false;
          }, 3000); // 假设加载时间是3秒
  
        })
        .catch(error => {
  
          console.error('Error fetching mock data:', error);
        });
  
  
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
        router.push({ name: 'article', query: { id: article_id }, key: new Date().getTime() });
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
            skeleton_width.value = (skeleton_container_width - 50) / 5;
            skeleton_height.value = skeleton_width.value;
            return 5;
  
          case (skeleton_container_width > 1192 && skeleton_container_width <= 1424):
            skeleton_width.value = (skeleton_container_width - 50) / 5;
            skeleton_height.value = skeleton_width.value;
            return 5;
  
          case (skeleton_container_width > 960 && skeleton_container_width <= 1192):
            skeleton_width.value = (skeleton_container_width - 50) / 4;
            skeleton_height.value = skeleton_width.value;
            return 4;
  
          case (skeleton_container_width > 696 && skeleton_container_width <= 960):
            skeleton_width.value = (skeleton_container_width - 50) / 3;
            skeleton_height.value = skeleton_width.value;
            return 3;
  
          case (skeleton_container_width > 400 && skeleton_container_width <= 696):
            skeleton_width.value = (skeleton_container_width - 50) / 2;
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
      window.removeEventListener('resize', skeletonHandleResize);
    });
  
  
  </script>
  
  
  <style scoped>
  
  
  
    .waterfall-card {
      position: relative;
  
      .lazy-img {
        cursor: pointer;
  
      }
  
  
  
      .card-img-mask-stats{
      position: absolute;
        padding: 3px 3px;
        bottom: 90px;
        left: 0;
        z-index: 2;
        box-sizing: border-box;
        /* padding: 0px 8px 0px; */
        width: 100%;
        height: 20px;
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
  
  
      }
  
  
  
  
      .footer {
        padding: 12px;
  
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
      max-width: 1260px;
      height: auto;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      transition: all 0.3s ease;
     
      .item {
        width: 236px;
        margin-left: 5px;
        margin-right: 5px;
        margin-bottom: 10px;
          /* padding: 0px 8px 0px; */
         
          background-color: red;
        .skeleton~.skeleton {
        
    background-color: yellow;
  
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