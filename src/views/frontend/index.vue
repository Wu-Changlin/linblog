<template>
  
	<div class="feeds-page" @scroll="layoutPageOnReachBottoms">
	
	  
  
	  <div  style="margin-top: 72px;">
		<ContentTag :parentPageTagData="index_tag_data"  :currentActiveTagName="current_active_tag_name"  @childClickTag="getChildClickTag" v-if="flag"></ContentTag>
  
	  </div>
	  
  
  
	  <div class="feeds-container">
		<!-- <ContentCarouselImg></ContentCarouselImg> -->
		<Waterfall :parentPageArticleListData="index_article_list_data"  :isLoading="is_loading"></Waterfall>
	  </div>
  
    <Footer></Footer>	
	</div>
  
  </template>

  <script setup>
  import { reactive ,ref,onMounted,onUpdated,inject,getCurrentInstance,watch,nextTick} from 'vue';
  import { useRoute,useRouter } from "vue-router";
  import ContentTag from '@/components/content_tag.vue';
//   import ContentCarouselImg from '@/components/content_carousel_img.vue';
  import Waterfall from '@/components/waterfall.vue';
  import Footer from '@/components/footer.vue';
  import { debounce, throttle } from '@/hooks/debounce_throttle.js';


  const { proxy } = getCurrentInstance();//axios 代理
  
  const route = useRoute();
  const router = useRouter();



  const flag=ref(false);
  const is_loading = ref(true);

  const index_tag_data=ref();
  const index_article_list_data=ref();
  const total_pages = ref(0); //总页数
  const current_page = ref(1);//当前页数
  const current_active_tag_id = ref(1);
  const current_active_tag_name = ref('');
  const is_empty_article_list_data = ref(false);
  const is_show_footer_website_approve=ref(false);//是否显示底部备案信息

  //没有更多数据占位图（页面已经渲染到最后一页，没有更多数据可以加载渲染。
  //点击标签需初始化，否则因没有更多数据占位导致页面无法滚动到底部，上拉加载更多功能失效）
  const is_no_more_data = ref(false);
  //博文列表（瀑布流）加载下一页数据占位
  const is_next_page_loading = ref(false);

  //注入来自layout页面的当前选中标签id
  const parent_page_current_active_tag_id = inject('currentActiveTagId');

   // 注入来自layout页面（公共）提供修改当前选中标签id的方法
   const updateCurrentActiveTagIdFunction = inject('updateCurrentActiveTagIdFunction');






  //获取首页栏页数据（内容标签栏数据、博文列表数据（瀑布流组件））  
  function getIndexPageData() {
    is_show_footer_website_approve.value=false;
    proxy.$get('/data/frontend/index.json')
      .then(response => {
       
			index_tag_data.value = response.tag_data; // 标签数据
			index_article_list_data.value = response.article_list_data; // // 博文列表数据

      current_active_tag_id.value = response.current_active_tag_id;
        current_active_tag_name.value = response.current_active_tag_name;
        //使用来自layout页面（公共）提供修改当前选中标签id的方法修改选中标签id值，用于菜单栏页（导航栏）获取选中标签id数据来添加选中样式
updateCurrentActiveTagIdFunction(current_active_tag_id.value);

			flag.value=true;
			is_loading.value=false;
     
      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });
  }






onMounted(() => {
  getIndexPageData(); 
	//   fetchTag();
   console.log(111)
 
  });

  
  //获取子页面选中的标签id数据 
  // NOTE:　首页的标签数据仅展示一页（没有上拉加载更多），目的：显示页面底部备案信息。 
  function getChildClickTag(active_tag_id){
    console.log("getChildClickTag");
	is_loading.value=true;
  proxy.$post('/data/frontend/click_tag_all_article.json', { current_tag_id:active_tag_id, page: 1 })
      .then(response => {
    
        index_article_list_data.value = response.article_list_data; // // 博文列表
        current_active_tag_id.value = response.current_active_tag_id;
        current_active_tag_name.value = response.current_active_tag_name;
        //使用来自layout页面（公共）提供修改当前选中标签id的方法修改选中标签id值，用于菜单栏页（导航栏）获取选中标签id数据来添加选中样式
updateCurrentActiveTagIdFunction(current_active_tag_id.value);
        // current_page.value= response.current_page; //当前页数  

        //点击标签返回随机数量数据
        let sliced_start = Math.floor(Math.random() * 5);
        const data_count =  index_article_list_data.value.length;
        index_article_list_data.value =  index_article_list_data.value.slice(sliced_start, data_count);
       
       console.log("sliced_start, data_count:",sliced_start,',', data_count);

        is_loading.value = false;
        
       

   
      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });


	// console.log('getChildClickTag:',id);
  }







  </script>
  
  <style  scoped>
  .feeds-page {
	flex: 1;
	/* padding-top: 72px; */
	width: 100%;
	margin: 0;
	/* padding:0px 12px; */
	/* max-width: 1260px; */
	/* 修改盒子大小属性 */
	padding:0px 12px;
	background-color: var(--bg);
  height: 100vh;
  overflow: auto;
  /* 底部栏内容高度 */
  margin-bottom: -60px;
	.feeds-container {
	  /* top: 72px; */
	  position: relative;
	  margin: 0;
	  /* width: 100% - 24px; */
	  transition: width 0.5s;
	  padding-top: 72px;
	  background-color: var(--bg);
	  /* max-width: 1236px; */
    min-height: 100%;
    
	}
   
  }
  
  </style> 