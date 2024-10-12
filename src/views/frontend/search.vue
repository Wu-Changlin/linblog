<template>
  <div class="search-page-container">
		<NavBar :parentPageLogData="search_page_log"  :parentPageArticleCount="search_page_article_count" :parentPageArticleListData="search_page_article_list_data"></NavBar>
    <div class="main">
    <div class="main-content with-side-bar">
  <!-- <div class="search-page" ref="getSearchKeywordMatchRef"  @scroll="onReachBottom"> -->
  <div class="search-page" ref="getSearchKeywordMatchRef"  @scroll="onReachBottom">
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
    <FloatingBtnSets  :parentPageMenuData="search_page_menu_list_data"></FloatingBtnSets>
 
  </div>
 
  </div>
</div>
</div>


</template>

<script setup>
  import { ref, reactive, onMounted, provide, watch, onUnmounted,inject } from "vue";
  import { useRoute } from 'vue-router';
  import TagCount from '@/components/tag_count.vue';
  import Waterfall from '@/components/waterfall.vue';
  import EmptyState from '@/components/empty_state.vue';
  import { debounce, throttle } from '@/hooks/debounce_throttle.js';
  import NavBar from "@/components/nav_bar.vue";
  import FloatingBtnSets from "@/components/floating_btn_sets.vue";
  



const $getData = inject('$getData');
const $postData = inject('$postData');
const $message = inject('$message');

  const search_page_article_count=ref(0);
const search_page_article_list_data=ref();
//获取搜索关键字匹配所用数据源  提供一个获取数据的方法
const getSearchKeywordMatchArticleListDataFunction= ()=>{
	$getData('/data/frontend/all_article.json', { responseType: 'json' })
      .then(response => {
        // setTimeout(() => {
          search_page_article_count.value = response.article_count; // 博文数量
          search_page_article_list_data.value = response.article_list; // 博文列表
        // }, 3000); // 假设加载时间是3秒
		

      })
      .catch(error => {

        $message('请求未找到', 'error');
      });
}


// 使用 provide 向下传递方法
provide('getSearchKeywordMatchArticleListDataFunction', getSearchKeywordMatchArticleListDataFunction);

const search_page_log=ref();
const search_page_menu_list_data=ref();

//获取log和菜单导航栏   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
function getLayoutLogOrMenuListData(){
      // 如果你想使用axios来模拟请求，可以这样做
      $getData('/data/frontend/layout.json', { responseType: 'json' })
      .then(response => {
        // setTimeout(() => {
			search_page_log.value = response.log_data; // log
			search_page_menu_list_data.value = response.menu_data; // 菜单数据
        // }, 3000); // 假设加载时间是3秒
		
		// setTimeout(() => {
			//在组件挂载后调用方法获取数据
			getSearchKeywordMatchArticleListDataFunction();
		// }, 3000); // 延迟3秒

      })
      .catch(error => {

        $message('请求未找到', 'error');
      });

}

  const route = useRoute();

  const search_page_search_keyword = ref('');
  const search_keyword_count = ref(0);
  const search_keyword_match_data_page = ref(1);
  const total_pages = ref(0); //总页数
  const current_page = ref(1);//当前页数
  //没有更多数据占位图（页面已经渲染到最后一页，没有更多数据可以加载渲染。
  //再次搜索需初始化，否则因没有更多数据占位导致页面无法滚动到底部，上拉加载更多功能失效）
  const is_no_more_data = ref(false);
  const is_loading = ref(true);
  const search_page_search_article_list_data = ref([]);//关键词文章列表
  
  //获取搜索关键字匹配结果   总页数>=当前页数 ，模拟时总页数没有axios赋值，随机数赋值
  function getSearchKeywordMatchData() {
    is_no_more_data.value = false;//初始化,防止上拉加载更多失效。
    $postData('/data/frontend/search_keyword.json', { search_keyword: search_page_search_keyword.value }, { responseType: 'json' })
      .then(response => {
     
        search_keyword_count.value = response.search_keyword_count; // 博文数量
        total_pages.value = response.total_pages; //总页数
        current_page.value = response.current_page; //当前页数
        search_page_search_article_list_data.value = response.search_keyword_article_list_data; // 博文列表
        //模拟多次搜索返回随机数量
        let sliced_start = Math.floor(Math.random() * 5)+1;

        total_pages.value = sliced_start; //总页数
        const data_count = search_page_search_article_list_data.value.length;
        search_page_search_article_list_data.value = search_page_search_article_list_data.value.slice(sliced_start, data_count);
        search_keyword_count.value = data_count - sliced_start; // 博文数量

        for (let i = 0; i < search_keyword_count.value; i++) {
          search_page_search_article_list_data.value[i]['title'] = `总页数:${total_pages.value},第${current_page.value}页：` + search_page_search_article_list_data.value[i]['title'];
        }

        is_loading.value=false;

      })
      .catch(error => {

        $message('请求未找到', 'error');
      });
  }

  //博文列表（瀑布流）加载下一页数据占位
  const is_next_page_loading = ref(false);
  

  //触底上拉加载更多数据
  function onReachBottom(event) {
    if (is_loading.value)return;//如果正在加载数据，那么直接返回
    if (is_no_more_data.value) return;//如果显示没有更多数据占位图（页面已渲染最后一页），那么直接返回
    if (is_next_page_loading.value) return;//如果加载下一页数据占位，那么直接返回
   
    //总页数>=当前页数 ，模拟时当前页数没有axios赋值，随总页数（总页数是随机数）赋值
    if (total_pages.value > current_page.value) {
      debounce(() => {//防抖
        const { scrollTop, scrollHeight, clientHeight, scrollLeft, offsetWidth, scrollWidth } = event.target;
        const isScrolledToBottom = scrollHeight - (scrollTop + clientHeight) <= 200; // 200像素的误差  距离底部小于200像素
        // const isScrolledToRight = scrollWidth - (scrollLeft + offsetWidth) <= 1; // 1像素的误差    距离左边小于1像素
        // console.log('isScrolledToBottom:',isScrolledToBottom,',isScrolledToRight:',isScrolledToRight)
        //如果同时满足距离底部小于200像素和is_next_page_loading的反值是true条件，那么执行获取下一页数据
        if (isScrolledToBottom && !is_next_page_loading.value) {
         
          is_next_page_loading.value = true;
          setTimeout(() => {
            getSearchKeywordMatchNextPageData();//获取下一页数据
          },3000) 
         
        }


      }, 1000);


    }else{//如果当前页数=总页数，那么显示没有更多数据占位图
      is_no_more_data.value = true;//显示没有更多数据
    }

  }
  //根据触底数据判断获取搜索关键字匹配结果下一页   
  function getSearchKeywordMatchNextPageData() {
    
    current_page.value++;//当前页数加一
    $postData('/data/frontend/search_keyword.json', { search_keyword: search_page_search_keyword.value, page: search_keyword_match_data_page.value }, { responseType: 'json' })
      .then(response => {
        // setTimeout(() => {

        let search_page_search_article_list_data_next = response.search_keyword_article_list_data; // 博文列表
        // current_page.value= response.current_page; //当前页数  

        //模拟多次搜索返回随机数量
        let sliced_start = Math.floor(Math.random() * 5);
        const data_count = search_page_search_article_list_data_next.length;
        let sliced_array = search_page_search_article_list_data_next.slice(sliced_start, data_count);
        for (let i = 0; i < sliced_array.length; i++) {
          sliced_array[i]['title'] = `总页数:${total_pages.value},第${current_page.value}页：` + sliced_array[i]['title'];
        }
        //数组元素合并
        search_page_search_article_list_data.value = [...search_page_search_article_list_data.value, ...sliced_array]

       
        if (current_page.value == total_pages.value) {//如果当前页数=总页数，那么显示没有更多数据占位图
          is_no_more_data.value = true;//显示没有更多数据
        }

        is_next_page_loading.value = false;//取消加载中动画

      })
      .catch(error => {

        $message('请求未找到', 'error');
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
*{  
 
    -ms-overflow-style: none; /* 适用于 Internet Explorer 和旧版 Edge */
    scrollbar-width: none; /* 适用于 Firefox */
    -webkit-scrollbar:none;/* WebKit 内核浏览器（如 Chrome 和 Safari）中的滚动条*/ 
}
/* 页面内容容器 */
.search-page-container {
	padding: 0;
	background-color: var(--bg);  /* fff*/
	margin: 0;
  width: 100%;

	.main {
	    /* display: flex; */
        .main-content {
            width: 100%;	
            
        }
	}
}

  .search-page {
	/* display: flex; */
  /* position: relative; */
  height: 100vh;
  
	padding-top: 72px;
	width: 100%;
	margin: 0 auto;
	padding-left: 12px;
	padding-right: 12px;
  /* overflow: auto; */
  overflow:auto;

  }
  .search-container {
      width: 100%;
        
	}

  /* 动态栏 开始*/
  .search-content-container {
    display: flex;
    width: 100%;
    /* max-width: 1260px; */
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