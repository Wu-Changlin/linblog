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
  import { reactive ,ref,onMounted} from 'vue';
  import { useRouter } from "vue-router";
  import axios from 'axios';
  import ContentTag from '@/components/content_tag.vue';
//   import ContentCarouselImg from '@/components/content_carousel_img.vue';
  import Waterfall from '@/components/waterfall.vue';
  
  
  
  const router = useRouter();

  const flag=ref(false);
  const is_loading = ref(true);

  const index_tag_data=ref();
  const index_article_list_data=ref();



  
    // const fetchTag=async()=>{
  // // 如果你想使用axios来模拟请求，可以这样做
  // axios.get('/data/frontend/content_tag.json', { responseType: 'json' })
  //     .then(response => {

  //       data.list = response.data; // 数据加载完毕，关闭骨架屏
  //       maxItemsPerLines();

  //     })
  //     .catch(error => {

  //       console.error('Error fetching mock data:', error);
  //     });
  // }
  
//获取菜单导航栏   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
onMounted(() => {
    // 假设JSON文件与组件在同一目录下
    // import('./mock-data.json').then(res => {
    //   items.value = res.data;
    // }).catch(error => {
    //   console.error('Error fetching mock data:', error);
    // });
   
    // 如果你想使用axios来模拟请求，可以这样做
    axios.get('/data/frontend/index.json', { responseType: 'json' })
      .then(response => {
        // setTimeout(() => {
          console.log('index');
			index_tag_data.value = response.data.tag_data; // 标签数据
			index_article_list_data.value = response.data.article_list_data; // // 博文列表数据
			flag.value=true;
			is_loading.value=false;
			// console.log('111index_article_list_data:',index_article_list_data)
        // }, 3000); // 假设加载时间是3秒
		

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

  
  
  axios.post('/data/frontend/click_tag_all_article.json', { current_tag_id:active_tag_id, page: 1 }, { responseType: 'json' })
      .then(response => {
        // setTimeout(() => {
        console.log('getChildClickTag');
        index_article_list_data.value = response.data.article_list_data; // // 博文列表
     
        // current_page.value= response.data.current_page; //当前页数  

        //点击标签返回随机数量数据
        let sliced_start = Math.floor(Math.random() * 5);
        const data_count =  index_article_list_data.value.length;
        index_article_list_data.value =  index_article_list_data.value.slice(sliced_start, data_count);
       
       console.log("sliced_start, data_count:",sliced_start,',', data_count);

        is_loading.value = false;
        // is_loading.value=false;
        // }, 3000); // 假设加载时间是3秒


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
	/* max-width: 1244px; */
	/* 修改盒子大小属性 */
	padding:0px 12px;
	background-color: var(--bg);
  
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