<template>
  <div class="container" @scroll="onReachBottom">
		<NavBar :parentPageLogData="search_page_log"  :parentPageArticleCount="search_page_article_count" :parentPageArticleListData="search_page_article_list_data"></NavBar>

    <div class="main-content with-side-bar">
  <!-- <div class="search-page" ref="getSearchKeywordMatchRef"  @scroll="onReachBottom"> -->
  <div class="search-page">
    <!-- 搜索结果栏 开始-->
    <div class="search-container">

      <div class="search-content-container">
        <div class="search-content-container-content">
          <div class="text-left">
            <h3>关键词：{{search_page_search_keyword}} </h3>
          </div>
          <div class="line"></div>
          <div class="text-right"> <span>结果：找到{{ search_keyword_count}}个</span></div>
        </div>
      </div>
      <!-- 搜索结果内容 开始-->
      <Waterfall :parentPageArticleListData="search_page_search_article_list_data" :isLoading="is_loading" :isNextPageLoading="is_next_page_loading"></Waterfall>
      <!-- 搜索结果内容 结束-->

    </div>
    <!--  搜索结果栏 结束-->

    <!-- 没有更多数据占位 开始-->
    <div v-if="is_no_more_data">
      <EmptyState :height="`200px`" :imgUrl="'/empty-state.png'" :imgWidth="`128px`" :imgHeight="`128px`">
        <template #content>
          <span style="padding-bottom: 16px;">没有更多数据了</span>
        </template>
      </EmptyState>
    </div>
    <!-- 没有更多数据占位 结束-->
  </div>
  
  </div>
  <FloatingBtnSets  :parentPageMenuData="search_page_menu_list_data"></FloatingBtnSets>
</div>


</template>

<script setup>
  import { ref, reactive, onMounted, provide, watch, onUnmounted } from "vue";
  import { useRoute } from 'vue-router';
  import axios from "axios";
  import TagCount from '@/components/tag_count.vue';
  import Waterfall from '@/components/waterfall.vue';
  import EmptyState from '@/components/empty_state.vue';
  import { debounce, throttle } from '@/hooks/debounce_throttle.js';
  import NavBar from "@/components/nav_bar.vue";
  import FloatingBtnSets from "@/components/floating_btn_sets.vue";



  const search_page_article_count=ref(0);
const search_page_article_list_data=ref();
//获取搜索关键字匹配所用数据源  提供一个获取数据的方法
const getSearchKeywordMatchArticleListData= ()=>{
	axios.get('/data/frontend/all_article.json', { responseType: 'json' })
      .then(response => {
        // setTimeout(() => {
          search_page_article_count.value = response.data.article_count; // 博文数量
          search_page_article_list_data.value = response.data.article_list; // 博文列表
        // }, 3000); // 假设加载时间是3秒
		

      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });
}


// 使用 provide 向下传递方法
provide('getSearchKeywordMatchArticleListData', getSearchKeywordMatchArticleListData);

const search_page_log=ref();
const search_page_menu_list_data=ref();

//获取log和菜单导航栏   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
function getLayoutLogOrMenuListData(){
      // 如果你想使用axios来模拟请求，可以这样做
      axios.get('/data/frontend/page_components.json', { responseType: 'json' })
      .then(response => {
        // setTimeout(() => {
			search_page_log.value = response.data.log_data; // log
			search_page_menu_list_data.value = response.data.menu_data; // 菜单数据
        // }, 3000); // 假设加载时间是3秒
		
		// setTimeout(() => {
			//在组件挂载后调用方法获取数据
			getSearchKeywordMatchArticleListData();
		// }, 3000); // 延迟3秒

      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });

}



  const route = useRoute();

  const search_page_search_keyword = ref('');
  const search_keyword_count = ref(0);
  const search_keyword_match_data_page = ref(1);
  const total_pages = ref(0); //总页数
  const current_page = ref(1);//当前页数
  const is_no_more_data = ref(false);//最后一页显示没有更多数据。（再次搜索需初始化，否则因没有更多数据占位导致页面无法滚动到底部，上拉加载更多失效）

  const is_loading = ref(true);
  const search_page_search_article_list_data = ref([]);//关键词文章列表
  
  //获取搜索关键字匹配结果   总页数>=当前页数 ，模拟时总页数没有axios赋值，随机数赋值
  function getSearchKeywordMatchData() {
    is_no_more_data.value = false;//初始化,防止上拉加载更多失效。
    axios.post('/data/frontend/search_keyword.json', { search_keyword: search_page_search_keyword.value }, { responseType: 'json' })
      .then(response => {
        // setTimeout(() => {
        search_keyword_count.value = response.data.search_keyword_count; // 博文数量
        total_pages.value = response.data.total_pages; //总页数
        current_page.value = response.data.current_page; //当前页数
        search_page_search_article_list_data.value = response.data.search_keyword_article_list_data; // 博文列表
        //模拟多次搜索返回随机数量
        let sliced_start = Math.floor(Math.random() * 5)+1;

        total_pages.value = sliced_start; //总页数
        const data_count = search_page_search_article_list_data.value.length;
        search_page_search_article_list_data.value = search_page_search_article_list_data.value.slice(sliced_start, data_count);
        search_keyword_count.value = data_count - sliced_start; // 博文数量

        for (let i = 0; i < search_keyword_count.value; i++) {
          search_page_search_article_list_data.value[i]['title'] = `总页数:${total_pages.value},第${current_page.value}页：` + search_page_search_article_list_data.value[i]['title'];
        }

        is_loading.value = false;
        // }, 3000); // 假设加载时间是3秒


      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });
  }


  const is_next_page_loading = ref(false);
  
  // is_no_more_data
  //触底上拉加载更多数据
  function onReachBottom(event) {
    if (is_no_more_data.value) return;//如果显示没有更多数据占位图（页面已渲染最后一页），那么

    //总页数>=当前页数 ，模拟时当前页数没有axios赋值，随总页数（总页数是随机数）赋值
    if (total_pages.value > current_page.value) {
      debounce(() => {//防抖

       
        const { scrollTop, scrollHeight, clientHeight, scrollLeft, offsetWidth, scrollWidth } = event.target;
        const isScrolledToBottom = scrollHeight - (scrollTop + clientHeight) <= 1; // 1像素的误差  距离底部小于1像素
        const isScrolledToRight = scrollWidth - (scrollLeft + offsetWidth) <= 1; // 1像素的误差    距离底部小于1像素
        // console.log('isScrolledToBottom:',isScrolledToBottom,',isScrolledToRight:',isScrolledToRight)
        if (isScrolledToBottom && !is_next_page_loading.value) {
          // is_next_page_loading.value = true;
          // setTimeout(() => {
          //   loadMoreItems();
          //   is_next_page_loading.value = false;
          // }, 1000); // 模拟网络请求延迟

          is_next_page_loading.value = true;

          console.log('is_next_page_loading.value :',is_next_page_loading.value )
           setTimeout(() => {
            getSearchKeywordMatchNextPageData();//获取下一页数据
            
          }, 3000); // 模拟网络请求延迟
         
          console.log('false-is_next_page_loading.value :',is_next_page_loading.value )
        }


      }, 1000);


    }else{//如果当前页数=总页数，那么显示没有更多数据占位图
      is_no_more_data.value = true;//显示没有更多数据
    }

  }
  //根据触底数据判断获取搜索关键字匹配结果下一页   
  function getSearchKeywordMatchNextPageData() {
    current_page.value++;//当前页数加一
    axios.post('/data/frontend/search_keyword.json', { search_keyword: search_page_search_keyword.value, page: search_keyword_match_data_page.value }, { responseType: 'json' })
      .then(response => {
        // setTimeout(() => {

        let search_page_search_article_list_data_next = response.data.search_keyword_article_list_data; // 博文列表
        // current_page.value= response.data.current_page; //当前页数  

        //模拟多次搜索返回随机数量
        let sliced_start = Math.floor(Math.random() * 5);
        const data_count = search_page_search_article_list_data_next.length;
        let sliced_array = search_page_search_article_list_data_next.slice(sliced_start, data_count);
        for (let i = 0; i < sliced_array.length; i++) {
          sliced_array[i]['title'] = `总页数:${total_pages.value},第${current_page.value}页：` + sliced_array[i]['title'];
        }
        search_page_search_article_list_data.value = [...search_page_search_article_list_data.value, ...sliced_array]

       
        if (current_page.value == total_pages.value) {//如果当前页数=总页数，那么显示没有更多数据占位图
          is_no_more_data.value = true;//显示没有更多数据
        }

        is_next_page_loading.value = false;//取消加载中动画
      


      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });


  }


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
        if (newValue) {//如有路由传参更新,那么重新赋值
          search_page_search_keyword.value = newValue;
          getSearchKeywordMatchData();
          // console.log('newValue <= oldValue :',newValue,'<=' ,oldValue,',search_page_search_keyword:',search_page_search_keyword.value);
        }


      },
      { immediate: true }
    );

    //获取log和菜单导航栏（外加搜索匹配关键字数据）   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
    getLayoutLogOrMenuListData()


  });

  

  onUnmounted(() => {
    stopKeywordWatch.value = null; // 如果watch返回了一个停止监听的函数，调用它
  });

</script>

<style scoped>


.container {
	padding: 0;
	max-width: 1728px;
	background-color: var(--bg);  /* fff*/
	margin: 0 auto;
  height: 100vh;
  

	.main {
	    display: flex;
	
        .main-content {
            width: 100%;	
            
        }
	}
}

  .search-page {
	display: flex;
    overflow-x: hidden;/* 禁止容器x轴方向滚动 */
    flex-direction: column;
	  flex-wrap:wrap;
	padding-top: 72px;
	width: 100%;
	margin: 0 auto;
	padding-left: 12px;
	padding-right: 12px;
   

  }
  .search-container {
      overflow-x: hidden;/* 禁止容器x轴方向滚动 */
      display: flex;
      flex-direction: column;
	  flex-wrap:wrap;
      /* padding: 0 12px;
      padding-top: 72px;
      width: 100%; */
        
	}

  /* 动态栏 开始*/
  .search-content-container {
    display: flex;
    width: 100%;
    max-width: 1260px;
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
        margin-right: 10px;
        /* 可根据需要调整间距 */
      }

      .line {
        flex-grow: 1;
        /* 占据中间的空白部分 */
        border-top: var(--borderWidth-thin, 1px) solid var(--borderColor-default) !important;
        /* 横线样式 */
        margin: 0 10px;
        /* 可根据需要调整间距 */
      }

      .text-right {
        text-align: right;
        margin-left: 10px;
        /* 可根据需要调整间距 */
      }


    }

  }

  /* 动态栏 结束*/
</style>