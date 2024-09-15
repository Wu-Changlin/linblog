<template>
 
    
    <transition name="scale-down" mode="out-in">
        <!-- 骨架屏 开始-->
            <div v-if="is_loading" key="loading" class="content-banner-skeleton" ref="contentBannerSkeletonContainerRef">
              <!-- <div class="home-skeleton"  :style=" {height: home_skeleton_height + 'px'}" ref="skeletonContainerRef"> -->
              
                <Skeleton bg="#e4e4e4" :width="skeleton_width + 'px'" :height="skeleton_height + 'px'" animated /><!-- 图片占位 -->
                
               
            </div>
<!-- 骨架屏 结束-->
 <!-- 轮播图 开始-->
            <div v-else class="carousel-container">
                <div class="carousel-content" @mouseover="pauseTimer" @mouseout="resumeTimer">
                    <div class="carousel-inner" :style="{'transform': `translateX(-${data.active_carousel_index * 100}%)` }">
                        <div class="item"  v-for="index in data.list" >
                            <img    :src="index.image" >
                        </div> 
                    </div>
                </div>
                <div class="vui-carousel" ref='dotsList' :style="{'--b-color':data.list[data.active_carousel_index].vui_carousel_color}">
            
                    <div class="l-box">
                        <div class="title">{{data.list[data.active_carousel_index].title}}</div>
                        
                    </div>
        
                    <div class="r-box">
                        
                        <ul class="dots">
                            <li :class="[index==data.active_carousel_index?'pacman':'dot',data.is_prev?'l':'']" v-for="(item,index) in data.list"  @click="jumpToSlide(index)">
                                <!-- 吃豆人 -->
                                <div v-if="index==data.active_carousel_index"></div>
                                <div v-if="index==data.active_carousel_index"></div>
                            </li>
                        </ul>
                    </div>
        
                </div>
            </div>
 <!-- 轮播图 结束-->
</transition>
         
</template>


<script setup>
import { ref, reactive,onMounted,onUnmounted } from 'vue'
import axios from 'axios';
 import Skeleton from '@/components/skeleton.vue'
    const data=reactive( {
        active_carousel_index:0, //当前轮播下标
        is_prev:false, //是否点击上一张(控制吃豆人朝向)
        // 轮播图数据(json格式)
        list:[{}]
    })



  




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
    axios.get('/data/frontend/content_carousel_img.json', { responseType: 'json' })
      .then(response => {
        setTimeout(() => {
            data.list = response.data; // 数据加载完毕，关闭骨架屏
           is_loading.value=false;
        }, 3000); // 假设加载时间是3秒

      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });


    // //控制骨架屏尺寸
    skeletonHandleResize(); // 初始化尺寸
    window.addEventListener('resize', skeletonHandleResize);

  });



//   轮播图骨架屏
  const contentBannerSkeletonContainerRef = ref();
  const skeleton_width = ref(1200);
  const skeleton_height = ref(675); // 默认高度
  // const skeleton_item= ref(5);

  function skeletonHandleResize() {
    if (contentBannerSkeletonContainerRef.value) {
      const skeleton_container_width = contentBannerSkeletonContainerRef.value.offsetWidth;
      
      skeleton_width.value =skeleton_container_width;
      skeleton_height.value = skeleton_width.value * 0.5625;
    //   console.log('skeleton_container_width:',skeleton_container_width,',skeleton_width.value:',skeleton_width.value,',skeleton_height.value:',skeleton_height.value)
      // switch

      // skeleton_width.value = `${width}px`;
      // skeleton_height.value = `${height}px`;
    }
  }




  onUnmounted(() => {
    window.removeEventListener('resize', skeletonHandleResize);
  });


    //放映幻灯片
    function showSlide() {
        
        data.active_carousel_index.value >= data.list.length - 1 ? 0 : data.active_carousel_index;
        
    }

    //上一张
    function prevSlide() {
        if (data.active_carousel_index > 0) {
            data.active_carousel_index--;
        } else {
            data.active_carousel_index = data.list.length - 1;
        }
        data.is_prev=true;
        showSlide();
    }

    //下一张
    function nextSlide() {
        if (data.active_carousel_index < data.list.length - 1) {
            data.active_carousel_index++;
        } else {
            data.active_carousel_index = 0;
        }
        data.is_prev=false;
        showSlide();
    }

    let timer = setInterval(nextSlide, 3000);

    //暂停
    function pauseTimer() {
        clearInterval(timer);
    }

    
    //重新开始
    function resumeTimer() {
        timer = setInterval(nextSlide, 3000);
    }

    
    // 切换banner 参数:index=轮播下标(点击指示器时,该值为对应的轮播下标),is_prev=是否上一张(true为上一张,false为下一张)
    function jumpToSlide(index) {
            // 停止轮播
        clearInterval(timer);
        // 点击时轮播下标小于当前轮播下标时,则为上一张,吃豆人向左
        if(index<data.active_carousel_index){
            data.is_prev=true;
        }else{// 默认是下一张,吃豆人向右
            data.is_prev=false;
        }
        // 设置当前轮播下标
        data.active_carousel_index = index;
        resumeTimer();
        // console.log('data.active_carousel_index:'+data.active_carousel_index)
    }


</script>

<style scoped>


 /* 骨架屏 */
 .content-banner-skeleton {
    padding: 0;
    width: 100%;
    margin: 0 auto;
    max-width: 1200px;
    margin-top: 72px;
    transition: all 0.3s ease;
    margin-bottom: 5px;


      .skeleton~.skeleton {
        display: flex;
        position: relative;
        
      }
    /* } */
    
  }


  /* 骨架屏缩放动画 */
  .scale-down-enter-active, .scale-down-leave-active {
  transition: all 0.3s ease;
}
 
.scale-down-enter-from, .scale-down-leave-to {
  opacity: 0;
  transform: scale(0.3);
} 


    .carousel-container{
        padding: 0;
        width: 100%;
        margin: 0 auto;
        max-width: 1200px;
        margin-top: 72px;
    }
    /* 轮播图 开始*/
    .carousel-content{
        width: 100%;
        height: 0;
        /* 宽高比 16/9 */
        padding-top: 56.25%;
        position: relative;
        overflow: hidden; 
    }
    
    .carousel-inner{
        width: 100%;
        position:absolute;
        inset: 0;
        display: flex;
        transition: transform 1s ease-in-out;
       
    }
    
    
    .item {
        flex: 0 0 100%; 
        
    }
    
    .carousel-inner img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }
    
    
    /* 轮播图底部交互 开始*/
    .vui-carousel {
        display:flex ;
         /* 计算底部区域高度 */
        height:100%;
        /* --b-color是自定义属性，接口返回进行动态赋值 */
        --b-color: #000;
        background-color: var(--b-color); 
        color: var(--text);
        /* 相对定位 */
        position: relative;
    } 
    
    
    
    /* 图片底部的渐变部分 */
    .vui-carousel::before{
        content: "";
        width: 100%;
        height: 50px;
        /* 背景渐变（透明——底部区域同色，上到下） */
        background: linear-gradient(to bottom,transparent,var(--b-color));
        /* 绝对定位 位置上移它的高度 */
        position: absolute;
        top: -50px;
    }
    
    /* 底部区域的左侧部分 */
    .vui-carousel .l-box{
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 12px;
        width: 100%;
    }
    
    .vui-carousel .title{
        width: 100%;
        font-size: 18px;
        line-height: 25px;
        /* 标题不换行，溢出显示省略号 */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .vui-carousel .dots{
        display: flex;
        margin-top: 13px;
        margin-right: 0;
    }
    /* 指示器（小圆点） */
    .vui-carousel li{
        width: 8px;
        height: 8px;
        background-color:rgba(128, 128, 128, 0.7);
        margin: 4px;
        border-radius: 50%;
        cursor: pointer;
    }
    /* 指示器选中态（吃豆人） */
    .vui-carousel li.pacman{
        position: relative;
        width: 14px;
        height: 14px;
        background-color: transparent;
        margin-top: 1px;
    }
    /* 吃豆人由两个div组成 */
    .vui-carousel li.pacman div{
        width: 0;
        height: 0;
        border: 7px solid  var(--vui_carousel_bg);
        border-radius: 50%;
        border-right-width: 7px;
        border-right-color: transparent;
        /* 绝对定位 两个重合 */
        position: absolute;
    }
    /* 吃豆人朝向左 */
    .vui-carousel li.pacman.l{
        transform: rotate(180deg);
    }
    /* 接下来分别为吃豆人的两个部分设置动画 */
    .vui-carousel li.pacman div:nth-child(1){
        /* 执行动画：动画名 时长 线性的 停留在最后一帧 */
        animation: pacman1 0.75s linear forwards;
    }
    .vui-carousel li.pacman div:nth-child(2){
        animation: pacman2 0.75s linear forwards;
    }
    /* 底部区域的右侧部分 */
    .vui-carousel .r-box{
        display: flex;
        margin-right: 10px;
    }
    
    
    /* 定义吃豆人动画 */
    @keyframes pacman1 {
        0%{
            transform: rotate(360deg);
        }
        40%{
            transform: rotate(270deg);
        }
        60%{
            transform: rotate(360deg);
        }
        100%{
            transform: rotate(270deg);
        }
    }
    @keyframes pacman2 {
        0%{
            transform: rotate(0deg);
        }
        40%{
            transform: rotate(90deg);
        }
        60%{
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(90deg);
        }
    }
    
    /* 轮播图底部交互 结束*/
    
    /* 轮播图 结束*/
    
    
    
    
    </style>