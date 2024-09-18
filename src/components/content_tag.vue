<template>




      <div class="tag-container">

        <div class="content-container">
          <div class="tag-content">
            <div :class=" {'tag-item':true,'active':data.active_tag_id==item.tag_id?true:''}"
              v-for="(item, index) in data.show_tag_data" :key="index" @click="clickTag(item)">
              {{ item.tag_name }}
            </div>

            <!-- 上下指向图标 开始-->
            <div class="tag-item" v-if="data.tagBtn" @click="clickTagBtn()">
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
            <div :class=" {'arrow-more-tag-item':true,'active':data.active_tag_id==item.tag_id?true:''}"
              v-for="(item, index) in data.show_arrow_more_tag_data" :key="index" @click="clickTag(item)"> {{
              item.tag_name }}</div>
          </div>
        </div>

      </div>
      <!-- 点击显示更多 结束-->

      <!-- 隐藏标签栏 开始-->
     
 
        <div class="hidden-tag-container" style="visibility:hidden; position: absolute;top:-9999px;left:-9999px;">

          <div class="hidden-content-container">
            <div class="hidden-tag-content" ref="hiddenTagContentRet" style="overflow: hidden;">

              <div class="hidden-tag-item"  ref="hiddenTagItemRet" v-for="(item, index) in data.list" :key="index">
                {{ item.tag_name }}
              </div>

            </div>
          </div>

        </div>
  
      <!-- 隐藏标签栏 结束-->
 
</template>


<script setup>
  import { reactive, ref, nextTick, onMounted, onUnmounted, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  import Skeleton from '@/components/skeleton.vue'

  
const route = useRoute();//用于获取当前路由的信息。返回的是当前路由的路由对象，包含了当前路由的各种信息
const router = useRouter();//进行路由的导航操作。返回的是路由的实例，可以进行各种路由操作。


// 当我们需要根据当前路由的信息来决定组件的渲染逻辑时，可以使用useRoute；而当我们需要进行路由跳转、导航等操作时，则应该使用useRouter。

  const hiddenTagContentRet = ref(null);//获取隐藏标签容器dom宽度，用于计算每行显示标签数量
  const hiddenTagItemRet = ref(null); // 创建一个引用
  const data = reactive({
    tagHeight: 0,
    tagBtn: false,
    tagNoWrap: false,
    tagBtnType: false,
    tagWrap: false,
    active_tag_id: 1,//默认选中tag_id=1
    show_tag_count: 0,//页面实际渲染标签数量
    show_tag_data: [],//页面实际渲染标签数据
    show_arrow_more_tag_data: [],//显示更多标签数据
    tag_item_dom_width_count: 0,//统计标签dom宽度
    list: [],
    showAll: false,

  })




  function clickTag(item) {
    // console.log('tag_id:', tag_id);
    data.active_tag_id = item.tag_id;

    // console.log('clickTag-active_tag_id:',data.active_tag_id);

    //  /index ===>  /index?tag_id=Java  路由携参跳转（当前页只添加路由参没有跳转）
    router.push({name: current_route_name.value, query: { tag_id: item.tag_name}, key: new Date().getTime() });

    data.tagWrap = false;//关闭显示更多标签数据
    data.tagBtnType = false;//指向下折叠false

  }
  const is_loading = ref(true)
  // 使用ref来存储watch返回的函数 监听hiddenTagContentRet.value，执行maxItemsPerLines函数
  const stopHiddenTagContentRetWatch = ref(null);

  const current_route_name=ref('index');
  onMounted(() => {
    //     console.log('挂载完毕');
    current_route_name.value = route.name;//获取当前路由的名称

    fetchTag();

    //监听窗口响应式每行最多标签数量
    window.addEventListener('resize', maxItemsPerLines);//监听窗口缩放
    //初始化每行最多标签数量
    //  maxItemsPerLines();
  })


  const fetchTag=async()=>{
  // 如果你想使用axios来模拟请求，可以这样做
  axios.get('/data/frontend/content_tag.json', { responseType: 'json' })
      .then(response => {
      
        data.list = response.data; // 数据加载完毕，关闭骨架屏
        maxItemsPerLines();
        
      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });
  }

  onUnmounted(() => {
    window.removeEventListener('resize', maxItemsPerLines);
    // stopHiddenTagContentRetWatch.value(); // 如果watch返回了一个停止监听的函数，调用它
  })//离开页面时移除监听窗口缩放

  //每行最多标签数量
  function maxItemsPerLines() {
    nextTick(()=>{

      ////标签容器宽度
      let tag_container_width = hiddenTagContentRet.value.offsetWidth
     
      const tagItem = hiddenTagItemRet.value; // 获取所有 <div> 元素的引用
    
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

      data.show_tag_count = tag_item_count;//赋值，页面实际渲染标签数量
      data.tag_item_dom_width_count = tag_item_width_count;//赋值，页面标签dom总宽度
      // console.log('data.show_tag_data:',data.show_tag_data);
      if (data.tag_item_dom_width_count <= tag_container_width) {//判断标签dom小于等于标签容器dom宽（没有溢出），隐藏指向图标容器  
        data.show_tag_data = data.list;
        data.tagBtn = false; //隐藏指向图标容器  
      } else {//溢出标签容器dom，显示指向图标容器
        //截取页面渲染所需标签数据
        data.show_tag_data = data.list.slice(0, data.show_tag_count);
         //显示指向图标容器
        data.tagBtn = true;
        //截取指向更多标签数据
        data.show_arrow_more_tag_data = data.list.slice(data.show_tag_count, data.list.length);

      }
      // console.log('data.show_tag_data', data.show_tag_data);
    }


          //  divElements.forEach((element) => {
          //     totalWidth += element.offsetWidth; // 累加每个 <div> 元素的宽度 offsetWidth 返回元素的宽度（包括元素宽度、内边距和边框，不包括外边距）
           
          //       // console.log('element.offsetWidth:',element.offsetWidth);
          //     });
   


    })
  

    // let tag_container_width = tagContainer.offsetWidth;//标签容器宽度
    // //减去指向图标的宽度  
    // tag_container_width = tag_container_width;


   

  }


  //点击标签按钮事件；下折叠false，上展开true。    
  function clickTagBtn() {
    //取反值
    data.tagBtnType = !data.tagBtnType;
    if (data.tagBtnType) {

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
    max-width: 1244px;
    background-color: var(--bg);

    .content-container {
      /* backdrop-filter: blur(20px); */
      /* width: calc(100vw - 24px); */
      width: 100%;
      /* max-width: 1244px; */
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
      width: 100%;
      /* max-width: 1244px; */
      /* overflow: hidden; */
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


  }



  /* 隐藏标签栏 渲染全部标签*/
  .hidden-tag-container {
   
    justify-content: space-between;
    align-items: center;
    user-select: none;
    -webkit-user-select: none;
    position: absolute;
   
    width: 100%;
    max-width: 1244px;
    background-color: var(--bg);

    .hidden-content-container {
      /* backdrop-filter: blur(20px); */
      width: 100%;
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
    
    max-width: 1255px;/* 防止元素溢出 */
    .arrow-more-tag-content-container {
      overflow: hidden;
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


  /* 骨架屏缩放动画 */
  .scale-down-enter-active, .scale-down-leave-active {
  transition: all 0.8s ease;
}
 
.scale-down-enter-from, .scale-down-leave-to {
  opacity: 0;
  transform: scale(0.8);
} 
</style>