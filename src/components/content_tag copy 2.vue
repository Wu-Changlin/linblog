<template>

  <transition name="scale-down" mode="out-in">
    <!-- 骨架屏 开始-->
        <div v-if="is_loading" key="loading" class="content-tag-skeleton" ref="contentTSkeletonContainerRef" style="display: flex;">
          <!-- <div class="home-skeleton"  :style=" {height: home_skeleton_height + 'px'}" ref="skeletonContainerRef"> -->
          
            <Skeleton bg="#e4e4e4" width="1260px" height="72px" animated /><!-- 图片占位 -->
            
           
        </div>
        <div v-else>

        
  <div  class="tag-container">

    <div class="content-container">
      <div class="tag-content">
        <div :class=" {'tag-item':true,'active':data.tagActive==item.tag_id?true:''}"
          v-for="(item, index) in data.show_tag_data" :key="index" @click="clickTag(item.tag_id)">
          {{ item.tag_name }}
        </div>

        <!-- 上下指向图标 开始-->
    <div class="tag-item"   v-if="data.tagBtn" @click="clickTagBtn()">
      <div>
        <svg-icon class="svg-icon" :icon-class="data.tagBtnType?'arrow-up':'arrow-down'" />
      </div>
    </div>
    <!-- 上下指向图标 结束-->

      </div>
    </div>
  </div>


    <!-- 点击显示更多 开始-->
    <div class="arrow-more-tag-container" :style="{display:data.tagWrap?'block':'none'}">

      <div class="arrow-more-tag-content-container">
        <div class="arrow-more-tag-content">
          <div :class=" {'arrow-more-tag-item':true,'active':data.tagActive==item.tag_id?true:''}"
            v-for="(item, index) in data.show_arrow_more_tag_data" :key="index" @click="clickTag(item.tag_id)"> {{
            item.tag_name }}</div>
        </div>
      </div>

    </div>
    <!-- 点击显示更多 结束-->

    <!-- 隐藏标签栏 开始-->
  <div style="visibility:hidden; position: absolute;top:-9999px;left:-9999px;">
   
      <div class="hidden-tag-container">

        <div class="hidden-content-container">
          <div class="hidden-tag-content" ref="hiddenTagContentRet"  style="overflow: hidden;">
         
            <div class="hidden-tag-item" v-for="(item, index) in data.list" :key="index">
              {{ item.tag_name }}
            </div>

          </div>
        </div>
    
      </div>
  </div>
  <!-- 隐藏标签栏 结束-->
</div>
</transition>
</template>


<script setup>
  import { reactive, ref, nextTick, onMounted, onUnmounted } from 'vue';
  import axios from 'axios';
 import Skeleton from '@/components/skeleton.vue'
  import { useRouter } from "vue-router";
  const router = useRouter();

  const hiddenTagContentRet = ref(null);//获取隐藏标签容器dom宽度，用于计算每行显示标签数量

  const data = reactive({
    tagHeight: 0,
    tagBtn: false,
    tagNoWrap: false,
    tagBtnType: false,
    tagWrap: false,
    tagActive: 1,//默认选中tag_id=1
    show_tag_count: 0,//页面实际渲染标签数量
    show_tag_data: [],//页面实际渲染标签数据
    show_arrow_more_tag_data: [],//显示更多标签数据
    tag_item_dom_width_count: 0,//统计标签dom宽度
    list:[{}],
    showAll: false,

  })


  function clickTag(tag_id) {
    // console.log('tag_id:', tag_id);
    data.tagActive = tag_id;
  }
  const is_loading=ref(true)
 

  onMounted(() => {
    //     console.log('挂载完毕');
 

     // 如果你想使用axios来模拟请求，可以这样做
     axios.get('/data/frontend/content_tag.json', { responseType: 'json' })
      .then(response => {
       
            data.list = response.data; // 数据加载完毕，关闭骨架屏
           is_loading.value=false;
           console.log(' is_loading:');

      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });

      //
      nextTick(()=>{
        maxItemsPerLines();
      })

    //监听窗口响应式每行最多标签数量
    window.addEventListener('resize', maxItemsPerLines);//监听窗口缩放
       //初始化每行最多标签数量
      //  maxItemsPerLines();
  })


  onUnmounted(() => {
    window.removeEventListener('resize', maxItemsPerLines)
  })//离开页面时移除监听窗口缩放

  //每行最多标签数量
  function maxItemsPerLines() {

    setTimeout(() => {
      console.log(' maxItemsPerLines');
      

   
   console.log(' hiddenTagContentRet.value:', hiddenTagContentRet.value.offsetWidth);
   
   
   const tagContainer = hiddenTagContentRet.value;              //标签容器dom
   const tagItem = Array.from(tagContainer.children); //标签容器内所有子项标签dom
  console.log('tagContainer.offsetWidth:',tagContainer.offsetWidth);



   let tag_container_width = tagContainer.offsetWidth;//标签容器宽度

   tag_container_width=tag_container_width-46;
  

   let tag_item_width_count = 0;
   let tag_item_count = 0;
   let i = 0;
   const all_tag_item_num = tagItem.length;//标签个数
  
   if (all_tag_item_num > 0) {
    
     for (i; i < all_tag_item_num; i++) {
       const tag_item_dom = tagItem[i];                    //标签容器dom
       tag_item_width_count += tag_item_dom.offsetWidth;//标签宽度相加
       
       if (tag_item_width_count <= tag_container_width) {//判断标签dom宽度和小于等于标签容器宽度，标签数量加1
      
         // console.log('i:',i,',offsetWidth:',tag_item_dom.offsetWidth,',tag_item_width_count:',tag_item_width_count);
         tag_item_count += 1;
       }
     }
     
     data.show_tag_count=tag_item_count;//赋值，页面实际渲染标签数量
     data.tag_item_dom_width_count=tag_item_width_count;//赋值，页面标签dom总宽度
     // console.log('data.show_tag_data:',data.show_tag_data);
     if (data.tag_item_dom_width_count <= tag_container_width) {//判断标签dom小于等于标签容器dom宽（没有溢出），隐藏指向图标容器  
       data.show_tag_data = data.list;
       data.tagBtn = false; //隐藏指向图标容器  
     } else {//溢出标签容器dom，显示指向图标容器
       //截取页面渲染所需标签数据
       data.show_tag_data = data.list.slice(0, data.show_tag_count);
       data.tagBtn = true; //显示指向图标容器

     }
    
   }


        }, 100); // 假设加载时间是3秒
    
 

  }




  //点击标签按钮事件；下折叠false，上展开true。    
  function clickTagBtn() {
    //取反值
    data.tagBtnType = !data.tagBtnType;
    if (data.tagBtnType) {

      if (data.tag_item_dom_width_count > hiddenTagContentRet.value.offsetWidth) {//判断标签dom总宽度大于标签容器dom宽度（有溢出），截取指向更多标签数据
        //截取指向更多标签数据
        data.show_arrow_more_tag_data = data.list.slice(data.show_tag_count, data.list.length);
      }
      // console.log('data.tag_item_dom_width_count', data.tag_item_dom_width_count);
      // console.log('data.show_arrow_more_tag_data', data.show_arrow_more_tag_data);
      data.tagWrap = true;
    } else {

      data.tagWrap = false;
    }

  };

</script>

<style scoped>


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
       right:10px ;
      background-color: var(--bg);

      .svg-icon {
        /* justify-content: center;
        align-items: center; */
        width: 16px;
        height: 16px;
      }
    }




  }



  /* 隐藏标签栏 渲染全部标签*/
  .hidden-tag-container {
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
   
    .hidden-content-container {
      /* backdrop-filter: blur(20px); */
      /* width: calc(100vw - 24px); */
      width: 100%;
      /* max-width: 1261px; */
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

    .hidden-tag-content {
        display: flex;
        color: var(--text);
        /*这是关键属性，flex模式允许换行 */
        /* flex-wrap: wrap; */

        .active {
          background-color: rgba(0, 0, 0, 0.03);
          border-radius: 999px;
          color: var(--text);
        }

        .hidden-tag-item {
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

  }



  /* 指向更多标签 开始*/
.arrow-more-tag-container {
    margin-top: 72px;
    display: none;
    display: flex;
    position: fixed;
    background-color: var(--bg);
    /* transform: translateY(100%); */
    z-index: 10;
    width: 100%;
    max-width: 1260px;
    /* max-width: 1285px; */

    .arrow-more-tag-content-container {

      display: flex;
      position: absolute;
      user-select: none;
      -webkit-user-select: none;
      align-items: center;
      font-size: 16px;
      background-color: var(--bg);
      color: var(--text);
      height: 40px;
      white-space: nowrap;
      height: auto;

      .arrow-more-tag-content {
        display: flex;
        color: var(--text);
        /*这是关键属性，flex模式允许换行 */
        flex-wrap: wrap;

        .active {
          background-color: rgba(0, 0, 0, 0.03);
          border-radius: 999px;
          color: var(--text);
        }

        .arrow-more-tag-item {
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
    }

  }
/* 指向更多标签 结束*/

</style>