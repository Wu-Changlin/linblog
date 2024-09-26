<template>

  <div class="search-page">
    <div class="search-container">
      <!-- 搜索结果栏 开始-->
     
       <div v-if="search_page_search_article_list_data.length>0" class="search-content-container">
        <div  class="search-content-container-content">
          <div class="text-left"> <h3>关键词：{{search_page_search_keyword}} </h3></div>
          <div class="line"></div>
          <div class="text-right"> <span>结果：找到{{ search_keyword_count}}个</span></div>
        </div>
       </div>


<div>
  <Waterfall style="padding-top: 72px;" v-if="search_page_search_article_list_data.length>0" :parentPageArticleListData="search_page_search_article_list_data"  :isloading="is_loading"></Waterfall>
  <EmptyState v-else :height="`568px`" :title="`没有搜索结果`" :imgUrl="'/empty-state.png'"/>
</div>
        
       
   
      <!--  搜索结果栏 结束-->
    </div>
   
  </div>
  </template>
  
  <script setup>
      import { ref, reactive,onMounted, provide ,watch,onUnmounted} from "vue";
      import { useRoute } from 'vue-router';
      import axios from "axios";
  import TagCount from '@/components/tag_count.vue';
  import Waterfall from '@/components/waterfall.vue';
  import EmptyState from '@/components/empty_state.vue';

const route = useRoute();

const search_page_search_keyword=ref('');
const search_keyword_count=ref(0);

const is_loading = ref(true);
const search_page_search_article_list_data=ref([]);//关键词文章列表
//获取搜索关键字匹配所用数据源  提供一个获取数据的方法
function getSearchKeywordMatchData(){
	axios.post('/data/frontend/search_keyword.json',{search_keyword:search_page_search_keyword.value}, { responseType: 'json' })
      .then(response => {
        // setTimeout(() => {
          search_keyword_count.value = response.data.search_keyword_count; // 博文数量
          search_page_search_article_list_data.value = response.data.search_keyword_article_list_data; // 博文列表

          is_loading.value=false;
        // }, 3000); // 假设加载时间是3秒
		

      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });
}



// 使用ref来存储watch返回的函数 监听路由传参keyword
const stopKeywordWatch = ref(null);

   onMounted(() => {
    search_page_search_keyword.value = route.query.keyword;
      // console.log('onMounted, search_content.value :', search_content.value );
       // 设置一个watch监听器
       // 立即监听，并存储取消监听的函数
       stopKeywordWatch.value = watch(
       () => route.query.keyword,
       (newValue, oldValue) => {
        if(newValue){//如有路由传参更新,那么重新赋值
          search_page_search_keyword.value = newValue;
          getSearchKeywordMatchData();
          // console.log('newValue <= oldValue :',newValue,'<=' ,oldValue,',search_content:',search_content.value);
        }
       
        
       },
       // { immediate: true }
     );

     getSearchKeywordMatchData();
   
   });
   



   
  
   onUnmounted(() => {
      
    stopKeywordWatch.value(); // 如果watch返回了一个停止监听的函数，调用它
   });

 



  let tag_name=ref('');
  let tag_number=ref(0);
  // console.log('tag_name',tag_name);

  function clickTag(activity_tag_id,activity_tag_name){
    // console.log('activity_tag_id',activity_tag_id,',activity_tag_name:',activity_tag_name);
    tag_name.value=activity_tag_name;
  }
  
  //爷组件 孙子组件传值  直接把数据传递出去给孙子传
  /* 孙组件向爷爷组件传值:
  步骤:
  
  1.爷爷先定义一个空的函数(或者是响应式数据、响应式对象)传递给孙子
  
  2.孙子使用inject接收
  
  3.孙子使用按钮等函数中调用爷爷传递过来的函数,()中传递要传递的数据
  
  3.爷爷当初定义的空函数中参数写value,获得的就是孙子传递过来的值 (或者监听响应式数据、响应式对象的变化进行下一步操作，如作为参数去请求接口)
  */
  //爷组件传值 子组件以 inject接收
  



  </script>
  
  <style scoped>
  
  .search-page {
    overflow-x: hidden;/* 禁止容器x轴方向滚动 */
  
  }
  .search-container {
      overflow-x: hidden;/* 禁止容器x轴方向滚动 */
      display: flex;
      flex-direction: column;
      padding: 0 12px;
      padding-top: 72px;
      width: 100%;

    }


    /* 动态栏 开始*/
    .search-content-container {
        display: flex;
        width: 100%;
        max-width:1260px;
        user-select: none;
        -webkit-user-select: none;
        align-items: center;
        justify-content: center;
        
        .search-content-container-content {
          display: flex;
          align-items: center;
          padding: 20px;
          width: 100%;

          .text-left {
            text-align: left;
            margin-right: 10px; /* 可根据需要调整间距 */
          }
          
          .line {
            flex-grow: 1; /* 占据中间的空白部分 */
            border-top: var(--borderWidth-thin, 1px) solid var(--borderColor-default) !important; /* 横线样式 */
            margin: 0 10px; /* 可根据需要调整间距 */
          }
          
          .text-right {
            text-align: right;
            margin-left: 10px; /* 可根据需要调整间距 */
          }

       
        }  

  }

/* 动态栏 结束*/

     
</style>
  