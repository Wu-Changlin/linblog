<template>
  <div class="tag-container" ref="tagContainerRef">

    <div class="content-container">
      <div class="tag-content" ref="showTagContentRef">
        <div :class="{'tag-item':true,'active':data.active_tag_name==item.tag_name?true:''}"
          v-for="(item, index) in data.show_tag_data" :key="index" @click="clickTag(item)">
          {{ item.tag_name }}
        </div>

        <!-- 上下指向图标 开始-->
        <div class="tag-item" v-if="data.show_more_tag_btn" @click="clickTagBtn()">
          <div>
            <svg-icon class="svg-icon" :icon-class="data.more_tag_icon?'arrow-up':'arrow-down'" />
          </div>
        </div>
        <!-- 上下指向图标 结束-->

      </div>
    </div>
  </div>

  <!-- align-items: center; -->

  <div class="tag-fixed" :style="{display: is_fixed ? 'block' : 'none'}">
    <div class="tag-container-fixed">

      <div class="content-container-fixed">
        <div class="tag-content-fixed" ref="showTagContentRef">
          <div :class="{'tag-item-fixed':true,'active':data.active_tag_name==item.tag_name?true:''}"
            v-for="(item, index) in data.show_tag_data" :key="index" @click="clickTag(item)">
            {{ item.tag_name }}
          </div>
  
          <!-- 上下指向图标 开始-->
          <div class="tag-item-fixed" v-if="data.show_more_tag_btn" @click="clickTagBtn()">
            <div>
              <svg-icon class="svg-icon" :icon-class="data.more_tag_icon?'arrow-up':'arrow-down'" />
            </div>
          </div>
          <!-- 上下指向图标 结束-->
  
        </div>
      </div>
    </div>
  </div>


  <!-- 点击显示更多 开始-->
  <div class="arrow-more-tag-container" :style="{display:data.show_more_tag_container?'block':'none'}">

    <div class="arrow-more-tag-content-container">
      <div class="arrow-more-tag-content">
        <div :class=" {'arrow-more-tag-item':true,'active':data.active_tag_name==item.tag_name?true:''}"
          v-for="(item, index) in data.show_arrow_more_tag_data" :key="index" @click="clickTag(item)"> {{
          item.tag_name }}</div>
      </div>
    </div>

  </div>
  <!-- 点击显示更多 结束-->

  <!-- 隐藏标签栏 开始-->


  <div class="hidden-tag-container" style="visibility:hidden;">

    <div class="hidden-content-container">
      <div class="hidden-tag-content" ref="hiddenTagContentRef">

        <div class="hidden-tag-item" ref="hiddenTagItemRef" v-for="(item, index) in data.list" :key="index">
          {{ item.tag_name }}
        </div>

      </div>
    </div>

  </div>

  <!-- 隐藏标签栏 结束-->

</template>


<script setup>
  import { reactive, ref, nextTick, onMounted, getCurrentInstance, onUnmounted, watch, inject, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import Skeleton from '@/components/skeleton.vue'
  import { debounce, throttle } from '@/hooks/debounceOrThrottle.js';

  const route = useRoute();//用于获取当前路由的信息。返回的是当前路由的路由对象，包含了当前路由的各种信息
  const router = useRouter();//进行路由的导航操作。返回的是路由的实例，可以进行各种路由操作。

  const props = defineProps({
    parentPageTagData: {//父页面传标签数据
      type: Array
    },
    // currentActiveTagId:{
    //   type: [String, Number],
    //   default: 0,
    //   required: true
    // },
    currentActiveTagName: {
      type: String
    }
  });




  //注入来自layout页面的当前选中标签id
  const layout_page_current_active_tag_id = inject('currentActiveTagId');

  // 当我们需要根据当前路由的信息来决定组件的渲染逻辑时，可以使用useRoute；而当我们需要进行路由跳转、导航等操作时，则应该使用useRouter。

  const hiddenTagContentRef = ref(null);//获取隐藏标签容器dom宽度，用于计算每行显示标签数量
  const hiddenTagItemRef = ref(null); // 创建一个标签dom引用
  const showTagContentRef = ref(null);// 创建一个实际渲染标签容器dom引用
  const data = reactive({
    show_more_tag_btn: false,
    more_tag_icon: false,
    show_more_tag_container: false,
    active_tag_id: 0,//默认选中tag_id=0
    active_tag_name: '',//默认选中tag_name=''
    show_tag_count: 0,//页面实际渲染标签数量
    show_tag_data: [],//页面实际渲染标签数据
    show_arrow_more_tag_data: [],//显示更多标签数据
    tag_item_dom_width_count: 0,//统计标签dom宽度
    list: [],

  })

  //把父页面所传数据赋值到当前页面的data.list(赋值仅执行1次)
  if (props.parentPageTagData) {
    data.list = props.parentPageTagData;
  }

  // //把父页面所传当前选中标签id数据赋值到当前页面的data.list(赋值仅执行1次) 目前来自来自layout页面（公共）提供(provide)当前选中标签id数据(inject('currentActiveTagId'))
  //   if(props.currentActiveTagId){
  //      // 使用计算属性确保id是数字类型，原因在html元素的任何attributes都会被解析成string
  //   const numericId = computed(() => Number(props.currentActiveTagId));
  //     data.active_tag_id=numericId.value;
  //   }
  //把父页面所传当前选中标签名数据赋值到当前页面的data.list(赋值仅执行1次)
  if (props.currentActiveTagName) {
    // console.log('props.currentActiveTagName:',props.currentActiveTagName)
    data.active_tag_name = props.currentActiveTagName;
  }

  // const i=ref(0)
  // watch(
  //     () => props.parentPageTagData,
  //     (newValue, oldValue) => {
  //       i.value++;
  //       console.log(`第${i.value}次，接受父页parentPageTagData`,':',props.parentPageTagData);

  //       if (newValue) {//如有路由传参更新,那么重新赋值
  //                }


  //     },
  //     { immediate: true }
  //   );

  //传递事件
  const emit = defineEmits(['childClickTag'])


  // 注入来自layout页面（公共）提供修改当前选中标签id的方法
  const updateCurrentActiveTagIdFunction = inject('updateCurrentActiveTagIdFunction');

  //点击标签
  function clickTag(item) {
    // console.log('tag_id:', tag_id);
    data.active_tag_name = item.tag_name;
    emit('childClickTag', item.tag_id, item.tag_name);//把子页面选中的标签id和标签名称传到父页面
    //使用来自layout页面（公共）提供修改当前选中标签id的方法修改选中标签id值，用于菜单栏页（导航栏）获取选中标签id数据来添加选中样式
    updateCurrentActiveTagIdFunction(item.tag_id);
    //  /index ===>  /index?tag_id=Java  路由携参跳转（当前页只添加路由参没有跳转）
    router.push({ name: current_route_name.value, query: { tag_id: item.tag_name }, key: new Date().getTime() });

    data.show_more_tag_container = false;//关闭显示更多标签数据容器
    data.more_tag_icon = false;//指向下折叠false

  }

  //使用 provide inject 代替getCurrentInstance
  const $message = inject('$message');

  //每行最多标签数量
  function maxItemsPerLines() {
    // nextTick(() => {
    data.show_tag_data = [];
    data.show_arrow_more_tag_data = [];
    data.show_tag_count = 0;
    // data.more_tag_icon = false;//指向下折叠false
    //如果计算标签数量dom对象为空，直接返回(！！！注意开发期间出现dom引用undefined，重复渲染？同一打印出现在不同位置)
    // console.log('!hiddenTagContentRef.value:',!hiddenTagContentRef.value,',hiddenTagContentRef.value:',hiddenTagContentRef);
    if(!hiddenTagContentRef.value){$message('数据加载出错', 'error');return;}
    // children返回的是元素节点，不包含文本节点，而childNodes则返回所有子节点，包括元素节点和文本节点。(childNodes.length children.length)
    //如果没有子节点，直接返回
    if(!hiddenTagContentRef.value.children.length){$message('空数据', 'error');return;}

    //标签容器宽度
    let tag_container_width = 0;
    // tag_container_width= hiddenTagContentRef.value.offsetWidth;
    tag_container_width = tagContainerRef.value.offsetWidth;
    const tagItem = hiddenTagItemRef.value; // 获取所有 <div> 元素的引用

    //减去指向图标的宽度 46px
    tag_container_width = tag_container_width - 46;
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
        data.show_more_tag_btn = false; //隐藏指向图标容器  

        data.show_more_tag_container = false; //关闭显示更多标签数据容器
        data.more_tag_icon = false;//指向图标恢复默认值（指向箭头）
      } else {//溢出标签容器dom，显示指向图标容器
        //截取页面渲染所需标签数据
        data.show_tag_data = data.list.slice(0, data.show_tag_count);
        //截取指向更多标签数据
        data.show_arrow_more_tag_data = data.list.slice(data.show_tag_count, data.list.length);
        //显示指向图标容器
        data.show_more_tag_btn = true;

      }

    }
  }


  //点击更多标签按钮事件；下折叠false，上展开true。    
  function clickTagBtn() {
    //取反值
    data.more_tag_icon = !data.more_tag_icon;
    if (data.more_tag_icon) {

      data.show_more_tag_container = true;//开启显示更多标签数据容器
    } else {

      data.show_more_tag_container = false;//关闭显示更多标签数据容器
    }

  };
  const current_route_name = ref('index');

  //标签容器dom
  const tagContainerRef = ref(null);

  //设置固定定位 
  const is_fixed = ref(false);
  function handleScroll() {
    /**
       * getBoundingClientRect().bottom 获取元素底部边缘与视口边缘的距离。
       * 吸顶元素距离顶部的条件值（项目需求是0）当元素距离浏览器顶部的高度小于或等于0时吸顶，反之取消吸顶（大于0）
       * getBoundingClientRect().top 获取元素的上边缘到视口上边缘的距离
       * (当吸顶或者取消吸顶时，出现元素内容吸顶上移或取消吸顶下沉；原因：吸顶内容和原有内容同时出现在视窗。
       * 解决：当元素底部边缘与视口边缘的距离+元素高度（初始化）时吸顶小于或等于0时吸顶，反之取消吸顶（大于0）)
       */

       data.show_more_tag_container = false; //关闭显示更多标签数据容器
       data.more_tag_icon = false;//指向图标恢复默认值（指向箭头）
       const tabOffsetTop = tagContainerRef.value.getBoundingClientRect().top;
    if((tabOffsetTop + tagContainerRef.value.clientHeight)<0){
      is_fixed.value = true;
    }else{
      is_fixed.value = false;
    }

    //获取标签栏元素底部边缘与视口边缘的距离。
    // const tabOffsetBottom = tagContainerRef.value.getBoundingClientRect().bottom;
    // if(tabOffsetBottom <0){
    //   is_fixed.value = true;
    // }else{
    //   is_fixed.value = false;
    // }
    // slide-down
  }

  onMounted(() => {
    //如果路由有查询参数tag_id，那么参数值赋值选中标签名变量。
    //(点击归档页标签统计栏的标签（路由携参?tag_id=标签名称跳转和来自父页面的当前选中标签id）)
    // if(route.query.tag_id){
    //   data.active_tag_name=route.query.tag_id;
    // }
    current_route_name.value = route.name;//获取当前路由的名称

    // fetchTag();
    nextTick(() => {
      //初始化每行最多标签数量
      maxItemsPerLines();
    })
    //监听窗口响应式每行最多标签数量
    window.addEventListener('resize', throttle(() => { maxItemsPerLines() }, 100));//监听窗口缩放 加节流
    //吸顶效果
    window.addEventListener("scroll", handleScroll, true);
  })


  onUnmounted(() => {
    //离开页面时移除监听窗口响应式每行最多标签数量
    window.removeEventListener('resize', maxItemsPerLines);
    //吸顶效果
    window.removeEventListener('scroll', handleScroll);
    // stopHiddenTagContentRetWatch.value=null; // 如果watch返回了一个停止监听的函数，调用它
  })

</script>

<style scoped>

.tag-fixed{
  width: 100%;
 
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    -webkit-user-select: none;
    flex-flow: row;
    position: fixed;
    z-index: 1001;
    top: 72px;
    animation: headerSlideDown .2s linear forwards;
    .tag-container-fixed {
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    -webkit-user-select: none;
    /* position: fixed; */
    /* position: absolute; */
    z-index: 9;
    width: 100%;
    /* max-width: 1260px; */
    background-color: var(--bg);
    /* animation: headerSlideDown .2s linear forwards; */
    .content-container-fixed {
      /*backdrop-filter: blur(20px); */
      width: 100%;
      /* width: calc(100% - 24px); */
      /* max-width: 1260px; */
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

    .tag-content-fixed {
      display: flex;
      width: 100%;
      /* flex-wrap: wrap; */
      /* width: calc(100% - 24px); */
      color: var(--color-secondary-label);
      background-color: var(--bg);
      /* max-width: 1260px; */
      /* overflow: hidden;*/

      .active {
        background-color: var(--color-active-background) !important;
        border-radius: 999px;
        color: var(--color-primary-label) !important;
      }

      .tag-item-fixed {
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 15px;
        cursor: pointer;
        -webkit-user-select: none;
        user-select: none;
        background-color: var(--bg);


        /*鼠标移入效果*/
        &:hover {
          background-color: var(--color-active-background) !important;
          border-radius: 999px;
          color: var(--color-primary-label) !important;
        }
      }

    }


  }
   
}


  .tag-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    -webkit-user-select: none;
    /* position: fixed; */
    /* position: absolute; */
    z-index: 9;
    width: 100%;
    /* max-width: 1260px; */
    background-color: var(--bg);
    /* animation: headerSlideDown .3s linear forwards; */
    .content-container {
      /*backdrop-filter: blur(20px); */
      width: 100%;
      /* width: calc(100% - 24px); */
      /* max-width: 1260px; */
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
      width: 100%;
      /* flex-wrap: wrap; */
      /* width: calc(100% - 24px); */
      color: var(--color-secondary-label);
      background-color: var(--bg);
      /* max-width: 1260px; */
      /* overflow: hidden;*/

      .active {
        background-color: var(--color-active-background) !important;
        border-radius: 999px;
        color: var(--color-primary-label) !important;
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
        background-color: var(--bg);


        /*鼠标移入效果*/
        &:hover {
          background-color: var(--color-active-background) !important;
          border-radius: 999px;
          color: var(--color-primary-label) !important;
        }
      }

    }


  }

  @keyframes headerSlideDown {
    0% {
        opacity: 0
    }

    to {
        opacity: 1
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
    /* position: absolute; */
    width: 100%;
    /* max-width: 1260px; */
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
    /* margin-top: 72px; */
    display: none;
    display: flex;
    position: fixed;
    background-color: var(--bg);
    /* transform: translateY(100%); */
    width: 100%;
    z-index: 10;
    /* max-width: 1260px; */
    height: 72px;

    /* 防止元素溢出 */
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
        background-color: var(--bg);

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
          background-color: var(--bg);

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
  .scale-down-enter-active,
  .scale-down-leave-active {
    transition: all 0.8s ease;
  }

  .scale-down-enter-from,
  .scale-down-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }
</style>