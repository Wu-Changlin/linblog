<template>
  
	<div class="feeds-page">
	
	  
  
	  <div  style="margin-top: 72px;">
		<ContentTag :parentPageTagData="index_tag_data"  @childClickTag="getChildClickTag" v-if="flag"></ContentTag>
  
	  </div>
	  
  
  
	  <div class="feeds-container">
		<!-- <ContentCarouselImg></ContentCarouselImg> -->
		<Waterfall :parentPageArticleListData="index_article_list_data"  :isLoading="is_loading"></Waterfall>
	  </div>
  
	 
  
	</div>
  
  </template>
  
  
  <script setup>
  import { reactive ,ref,onMounted,getCurrentInstance} from 'vue';
  import { useRouter } from "vue-router";
  import ContentTag from '@/components/content_tag.vue';
//   import ContentCarouselImg from '@/components/content_carousel_img.vue';
  import Waterfall from '@/components/waterfall.vue';
  const { proxy } = getCurrentInstance();//axios 代理
  
  
  const router = useRouter();

  const flag=ref(false);
  const is_loading = ref(true);

  const index_tag_data=ref();
  const index_article_list_data=ref();

  function layoutPageOnReachBottom(event) {
    console.log(`${route.name}页面，元素的像素高度：${event.target.clientHeight}`);
  }
  
//获取首页栏页数据（内容标签栏数据、博文列表数据（瀑布流组件））  
onMounted(() => {
   
  proxy.$get('/data/frontend/index.json')
      .then(response => {
       
			index_tag_data.value = response.tag_data; // 标签数据
			index_article_list_data.value = response.article_list_data; // // 博文列表数据
			flag.value=true;
			is_loading.value=false;
			

      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });


	//   fetchTag();
  });


  
  //获取子页面选中的标签id数据 
  // NOTE:　首页的标签数据仅展示一页（没有上拉加载更多），目的：显示页面底部备案信息。 
  function getChildClickTag(active_tag_id){
	is_loading.value=true;
  proxy.$post('/data/frontend/click_tag_all_article.json', { current_tag_id:active_tag_id, page: 1 })
      .then(response => {
    
        index_article_list_data.value = response.article_list_data; // // 博文列表
     
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
  
	.feeds-container {
	  /* top: 72px; */
	  position: relative;
	  margin: 0;
	  /* width: 100% - 24px; */
	  transition: width 0.5s;
	  padding-top: 72px;
	  background-color: var(--bg);
	  /* max-width: 1236px; */
	}
  
   
  }
  
  </style> 