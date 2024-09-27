<template>
  <!-- <div class="search-page" ref="getSearchKeywordMatchRef"  @scroll="onReachBottom"> -->
  <div class="search-page" @scroll="onReachBottom">
     <!-- 搜索结果栏 开始-->
    <div class="search-container">

       <div  class="search-content-container">
        <div  class="search-content-container-content">
          <div class="text-left"> <h3>关键词：{{search_page_search_keyword}} </h3></div>
          <div class="line"></div>
          <div class="text-right"> <span>结果：找到{{ search_keyword_count}}个</span></div>
        </div>
       </div>
      <!-- 搜索结果内容 开始-->
    <Waterfall   :parentPageArticleListData="search_page_search_article_list_data"  :isloading="is_loading"></Waterfall>
    <!-- 搜索结果内容 结束-->     
      
    </div>
    <!--  搜索结果栏 结束-->

    <!-- 没有更多数据占位 开始-->
    <div  v-if="is_last_page">
      <EmptyState :height="`200px`" :imgUrl="'/empty-state.png'" :imgWidth="`128px`" :imgHeight="`128px`">
        <template #content>
          <span style="padding-bottom: 16px;">没有更多数据了</span>
        </template>
      </EmptyState>
    </div>
    <!-- 没有更多数据占位 结束-->
  </div>
  </template>
  
  <script setup>
      import { ref, reactive,onMounted, provide ,watch,onUnmounted} from "vue";
      import { useRoute } from 'vue-router';
      import axios from "axios";
  import TagCount from '@/components/tag_count.vue';
  import Waterfall from '@/components/waterfall.vue';
  import EmptyState from '@/components/empty_state.vue';
  import { debounce, throttle} from '@/hooks/debounce_throttle.js';

const route = useRoute();

const search_page_search_keyword=ref('');
const search_keyword_count=ref(0);
const search_keyword_match_data_page=ref(1);
const total_pages=ref(0); //总页数
const current_page=ref(1);//当前页数
const is_last_page=ref(false);//最后一页显示没有更多数据。（再次搜索需初始化，否则因没有更多数据占位导致页面无法滚动到底部，上拉加载更多失效）

const is_loading = ref(true);
const search_page_search_article_list_data=ref([]);//关键词文章列表
//获取搜索关键字匹配结果   总页数>=当前页数 ，模拟时总页数没有axios赋值，随机数赋值
function getSearchKeywordMatchData(){
  is_last_page.value=false;//初始化,防止上拉加载更多失效。
	axios.post('/data/frontend/search_keyword.json',{search_keyword:search_page_search_keyword.value}, { responseType: 'json' })
      .then(response => {
        // setTimeout(() => {
          search_keyword_count.value = response.data.search_keyword_count; // 博文数量
          total_pages.value = response.data.total_pages; //总页数
          current_page.value= response.data.current_page; //当前页数
          search_page_search_article_list_data.value = response.data.search_keyword_article_list_data; // 博文列表
          //模拟多次搜索返回随机数量
          let sliced_start = Math.floor(Math.random() * 5);
          
          total_pages.value = sliced_start; //总页数
          const data_count=search_page_search_article_list_data.value.length;
          search_page_search_article_list_data.value=search_page_search_article_list_data.value.slice(sliced_start, data_count);
          search_keyword_count.value = data_count-sliced_start; // 博文数量

          is_loading.value=false;
        // }, 3000); // 假设加载时间是3秒
		

      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });
}


const isNextPageLoading=ref(false);

function onReachBottom(event){
  if(is_last_page.value)return;

    //总页数>=当前页数 ，模拟时当前页数没有axios赋值，随总页数（总页数是随机数）赋值
    if(total_pages.value>current_page.value){
  debounce(() => {//防抖


  
      current_page.value++;//当前页数加一
      const { scrollTop, scrollHeight, clientHeight, scrollLeft, offsetWidth ,scrollWidth} = event.target;
  const isScrolledToBottom = scrollHeight - (scrollTop + clientHeight) <= 1; // 1像素的误差  距离底部小于1像素
  const isScrolledToRight = scrollWidth - (scrollLeft + offsetWidth) <= 1; // 1像素的误差    距离底部小于1像素
  // console.log('isScrolledToBottom:',isScrolledToBottom,',isScrolledToRight:',isScrolledToRight)
  if (isScrolledToBottom  && !isNextPageLoading.value) {
    // isNextPageLoading.value = true;
    // setTimeout(() => {
    //   loadMoreItems();
    //   isNextPageLoading.value = false;
    // }, 1000); // 模拟网络请求延迟

    isNextPageLoading.value=true;
    getSearchKeywordMatchNextPageData();        

  }


},1000);

 
}
//根据触底数据判断获取搜索关键字匹配结果下一页   
function getSearchKeywordMatchNextPageData(){
 
axios.post('/data/frontend/search_keyword.json',{search_keyword:search_page_search_keyword.value,page:search_keyword_match_data_page.value}, { responseType: 'json' })
      .then(response => {
        // setTimeout(() => {
           
           let search_page_search_article_list_data_next= response.data.search_keyword_article_list_data; // 博文列表
          // current_page.value= response.data.current_page; //当前页数  

          //模拟多次搜索返回随机数量
          let sliced_start = Math.floor(Math.random() * 5);
          const data_count=search_page_search_article_list_data_next.length;
          let sliced_array=search_page_search_article_list_data_next.slice(sliced_start, data_count);
          for(let i=0;i<sliced_array.length;i++){
            sliced_array[i]['title']=`总页数:${total_pages.value},第${current_page.value}页：`+sliced_array[i]['title'];
          }
          search_page_search_article_list_data.value = [...search_page_search_article_list_data.value,...sliced_array]
         
          isNextPageLoading.value=false;
          if(current_page.value==total_pages.value){
            is_last_page.value=true;//显示没有更多数据
          }
          // is_loading.value=false;
        // }, 3000); // 假设加载时间是3秒
		

      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });


}


    // const getSearchKeywordMatchRef_scrollHeight = getSearchKeywordMatchRef.value.scrollHeight || 0;
  //   const getSearchKeywordMatchRef_clientHeight = getSearchKeywordMatchRef.value.clientHeight || 0;
  //   const getSearchKeywordMatchRef_scrollTop = getSearchKeywordMatchRef.value.scrollTop || 0;
  //   const Current_is_to_bottom = getSearchKeywordMatchRef_scrollHeight-getSearchKeywordMatchRef_clientHeight-getSearchKeywordMatchRef_scrollTop;
  //   console.log("getSearchKeywordMatchRef.value:",Current_is_to_bottom);
  //   if(Current_is_to_bottom < 50 && !isNextPageLoading.value){
  //     isNextPageLoading.value=true;
  //       console.log('已到底');
  //       isNextPageLoading.value=false;
  //   }

}


// const getSearchKeywordMatchRef=ref(null);

// 1、clientWidth：对象可见的宽度，不包括滚动条等边线，会随窗口的显示大小改变。

// clientWidth  =  元素width + padding

// 2、scrollWidth：实际内容的宽，不包括边线宽度，会随着对象中内容的多少改变。

// 无滚动时等于clientWidth，有滚动时，需要计算

// 3、offsetWidth：对象的可见宽度，包括滚动条等边线，会随窗口的显示大小改变。

// scrollLeft： 元素滚动条到元素左边的距离。


//clientHeight： 对于没有定义 CSS 或者内联布局盒子的元素为0，同时它是元素内部的高度(单位像素)，包含内边距，但不包括水平滚动条、边框和外边距。

// clientHeight 可以通过 CSS height + CSS padding - 水平滚动条高度 (如果存在)来计算。

// scrollHeight： 是一个只读属性，它是一个元素内容高度的度量，包括由于溢出导致的视图中不可见内容。
// 没有垂直滚动条的情况下，scrollHeight值与元素视图填充所有内容所需要的最小值clientHeight相同。
// 包括元素的padding，但不包括元素的border和margin。scrollHeight也包括 ::before 和 ::after这样的伪元素


// scrollTop 属性可以获取或设置一个元素的内容垂直滚动的像素数。
// 一个元素的 scrollTop 值是这个元素的顶部到它的最顶部可见内容（的顶部）的距离的度量。
// 当一个元素的内容没有产生垂直方向的滚动条，那么它的 scrollTop 值为0。


// 使用ref来存储watch返回的函数 监听路由传参keyword
const stopKeywordWatch = ref(null);

   onMounted(() => {
    search_page_search_keyword.value = route.query.keyword;
      // console.log('onMounted, search_page_search_keyword.value :', search_page_search_keyword.value );
       // 设置一个watch监听器
       // 立即监听，并存储取消监听的函数
       stopKeywordWatch.value = watch(
       () => route.query.keyword,
       (newValue, oldValue) => {
        if(newValue){//如有路由传参更新,那么重新赋值
          search_page_search_keyword.value = newValue;
          getSearchKeywordMatchData();
          // console.log('newValue <= oldValue :',newValue,'<=' ,oldValue,',search_page_search_keyword:',search_page_search_keyword.value);
        }
       
        
       },
        { immediate: true }
     );

    //  getSearchKeywordMatchData();
   
   });
   


   onUnmounted(() => {
      
    stopKeywordWatch.value(); // 如果watch返回了一个停止监听的函数，调用它
   });

  </script>
  
  <style scoped>
  
  .search-page {
    overflow-x: hidden;/* 禁止容器x轴方向滚动 */
    height: 100vh;/*VUE项目中使用@scroll获取不到事件对象，结果undefined。原因没有给父盒子设置固定高度 */
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
  