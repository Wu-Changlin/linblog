<template>
  <div class="tag-container">

    <div class="content-container">
      <div class="tag-content">
        <div :class=" {'tag-item':true,'active':data.tagActive==item.tag_id?true:''}"
          v-for="(item, index) in data.show_tag_data" :key="index" @click="clickTag(item.tag_id)">
          {{ item.tag_name }}
        </div>
      </div>
    </div>

    <!-- 上下指向图标 开始-->
    <div class="arrow-more-tag-bnt-container" v-if="data.tagBtn" @click="clickTagBtn()">
      <div>
        <svg-icon class="svg-icon" :icon-class="data.tagBtnType?'arrow-up':'arrow-down'" />
      </div>
    </div>
    <!-- 上下指向图标 结束-->



  </div>


    <!-- 点击显示更多 开始-->
    <div class="arrow-more-tag-container" :style="{display:data.tagWrap?'block':'none'}">

      <div class="arrow-more-tag-content-container">
        <div class="tag-content">
          <div :class=" {'tag-item':true,'active':data.tagActive==item.tag_id?true:''}"
            v-for="(item, index) in data.show_arrow_more_tag_data" :key="index" @click="clickTag(item.tag_id)"> {{
            item.tag_name }}</div>
        </div>
      </div>

    </div>
    <!-- 点击显示更多 结束-->
  <div style="visibility:hidden; position: absolute;top:-9999px;left:-9999px;">
    <div class="tag-container">

      <div class="content-container">
        <div class="tag-content" ref="tagWithRet" style="overflow: hidden;">
          <div class="tag-item" v-for="(item, index) in data.list" :key="index"> {{ item.tag_name }}</div>
        </div>
      </div>

    </div>
  </div>





</template>


<script setup>
  import { reactive, ref, nextTick, onMounted, onUnmounted } from 'vue';
  import { useRouter } from "vue-router";
  const router = useRouter();

  const tagWithRet = ref();//获取标签容器dom宽度

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
    tag_item_dom_with_count: 0,//统计标签dom宽度
    list: [
      { tag_id: 1, tag_name: "All" },
      { tag_id: 53, tag_name: "c" },
      { tag_id: 2, tag_name: "C++" },
      { tag_id: 3, tag_name: "Java" },
      { tag_id: 4, tag_name: "Python" },
      { tag_id: 5, tag_name: "PHP" },
      { tag_id: 6, tag_name: "Go" },
      { tag_id: 7, tag_name: "Ruby" },
      { tag_id: 8, tag_name: "Node.js" },
      { tag_id: 9, tag_name: "C#" },
      { tag_id: 10, tag_name: "html" },
      { tag_id: 11, tag_name: "html5" },
      { tag_id: 12, tag_name: "css" },
      { tag_id: 13, tag_name: "css3" },
      { tag_id: 14, tag_name: "js" },
      { tag_id: 15, tag_name: "ts" },
      { tag_id: 16, tag_name: "vue2" },
      { tag_id: 17, tag_name: "vue3" },
      { tag_id: 18, tag_name: "jq" },
      { tag_id: 19, tag_name: "React" },
      { tag_id: 20, tag_name: "Swift" },
      { tag_id: 21, tag_name: "Kotlin" },
      { tag_id: 22, tag_name: "Fortran" },
      { tag_id: 23, tag_name: "MATLAB" },
      { tag_id: 24, tag_name: "r" },
      { tag_id: 25, tag_name: "d" },
      { tag_id: 26, tag_name: "sas" },
      { tag_id: 27, tag_name: "c" },
      { tag_id: 28, tag_name: "C++" },
      { tag_id: 29, tag_name: "Java" },
      { tag_id: 30, tag_name: "Python" },
      { tag_id: 31, tag_name: "PHP" },
      { tag_id: 32, tag_name: "Go" },
      { tag_id: 33, tag_name: "Ruby" },
      { tag_id: 34, tag_name: "Node.js" },
      { tag_id: 35, tag_name: "C#" },
      { tag_id: 36, tag_name: "html" },
      { tag_id: 37, tag_name: "html5" },
      { tag_id: 38, tag_name: "css" },
      { tag_id: 39, tag_name: "css3" },
      { tag_id: 40, tag_name: "js" },
      { tag_id: 41, tag_name: "ts" },
      { tag_id: 42, tag_name: "vue2" },
      { tag_id: 43, tag_name: "vue3" },
      // { tag_id: 44, tag_name: "jq" },
      // { tag_id: 45, tag_name: "React" },
      // { tag_id: 46, tag_name: "Swift" },
      // { tag_id: 47, tag_name: "Kotlin" },
      // { tag_id: 48, tag_name: "Fortran" },
      // { tag_id: 49, tag_name: "MATLAB" },
      // { tag_id: 50, tag_name: "r" },
      // { tag_id: 51, tag_name: "d" },
      // { tag_id: 52, tag_name: "sas" },
    ],
    showAll: false,

  })


  function clickTag(tag_id) {
    console.log('tag_id:', tag_id);
    data.tagActive = tag_id;
  }


  onMounted(() => {
    //     console.log('挂载完毕');
    //初始化每行最多标签数量
    maxItemsPerLines();
    //监听窗口响应式每行最多标签数量
    window.addEventListener('resize', maxItemsPerLines);//监听窗口缩放
  })


  onUnmounted(() => {
    window.removeEventListener('resize', maxItemsPerLines)
  })//离开页面时移除监听窗口缩放

  //每行最多标签数量
  function maxItemsPerLines() {
    const tagContainer = tagWithRet.value;              //标签容器dom
    const tagItem = Array.from(tagContainer.children); //标签容器内所有子项dom
    let tag_container_width = tagContainer.offsetWidth;//标签容器宽度

    console.log('tag_container_width:',tag_container_width);

    let i = 0;
    const tag_item_count = tagItem.length;//标签个数

    if (tag_item_count > 0) {
      data.tag_item_dom_with_count=0;//初始化，防止标签宽度和累加
      for (i; i < tag_item_count; i++) {
        const tag_item_dom = tagItem[i];                    //标签容器dom
        data.tag_item_dom_with_count += tag_item_dom.offsetWidth;//标签宽度相加
        if (data.tag_item_dom_with_count <= tag_container_width) {//判断标签宽度和小于等于标签容器宽度，标签数量加1
          // console.log('tag_item_dom_with_count:',tag_item_dom_with_count);
          data.show_tag_count += 1;
        }
      }
      // console.log('data.show_tag_count:',data.show_tag_count);

      // console.log('data.show_tag_data:',data.show_tag_data);
      if (data.tag_item_dom_with_count <= tag_container_width) {//判断标签dom小于等于标签容器dom（没有溢出），隐藏指向图标容器  
        data.show_tag_data = data.list;
        data.tagBtn = false; //隐藏指向图标容器  
      } else {//溢出标签容器dom，显示指向图标容器
        //截取页面渲染所需标签数据
        data.show_tag_data = data.list.slice(0, data.show_tag_count);
        data.tagBtn = true; //显示指向图标容器

      }

    }



  }




  //点击标签按钮事件；下折叠false，上展开true。    
  function clickTagBtn() {
    //取反值
    data.tagBtnType = !data.tagBtnType;
    if (data.tagBtnType) {

      if (data.tag_item_dom_with_count > tagWithRet.value.offsetWidth) {//判断标签dom大于标签容器dom（有溢出），截取指向更多标签数据
        //截取指向更多标签数据
        data.show_arrow_more_tag_data = data.list.slice(data.show_tag_count, data.list.length);
      }
      // console.log('data.tag_item_dom_with_count', data.tag_item_dom_with_count);
      // console.log('data.show_arrow_more_tag_data', data.show_arrow_more_tag_data);
      data.tagWrap = true;
    } else {

      data.tagWrap = false;
    }

  };

</script>

<style>


  .tag-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    -webkit-user-select: none;
    position: fixed;
    z-index: 1000;
    width: 100%;
    max-width: 1285px;
    .content-container {
      /* backdrop-filter: blur(20px); */
      /* width: calc(100vw - 24px); */
      width: calc(100% - 30px);
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
          padding: 0 16px;
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
      display: flex;
      width: 30px;
      /* height: 100%; */
      height: 72px;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      -webkit-user-select: none;
      user-select: none;
      margin-right: 10px;
      background-color: var(--bg);

      .svg-icon {
        justify-content: center;
        align-items: center;
        width: 16px;
        height: 16px;
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
    z-index: 1007;
    width: 100%;
    max-width: 1285px;

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

      .tag-content {
        display: flex;
        color: var(--text);
        /*这是关键属性，flex模式允许换行 */
        flex-wrap: wrap;

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
          padding: 0 16px;
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