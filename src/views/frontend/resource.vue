<template>
  
	<div class="feeds-page">
	
	  
  
	  <div  style="margin-top: 72px;">
		<ContentTag :parentPageTagData="resource_tag_data" :currentActiveTagName="current_active_tag_name"  @childClickTag="getChildClickTag" v-if="flag"></ContentTag>
  
	  </div>
	  
  
  
	  <div class="feeds-container">
		<!-- <ContentCarouselImg></ContentCarouselImg> -->
		<Waterfall :parentPageArticleListData="resource_article_list_data"  :isLoading="is_loading"></Waterfall>
	  </div>
  
	 
  
	</div>
  
  </template>
  
  
  <script setup>
  import { reactive ,ref,onMounted,getCurrentInstance,inject} from 'vue';
  import {useRoute, useRouter } from "vue-router";
  import ContentTag from '@/components/content_tag.vue';
  import Waterfall from '@/components/waterfall.vue';
  const { proxy } = getCurrentInstance();//axios 代理
  
  const router = useRouter();
  const route = useRoute();

  const flag=ref(false);
  const is_loading = ref(true);
  const resource_tag_data=ref();
  const resource_article_list_data=ref();
  const total_pages = ref(0); //总页数
  const current_page = ref(1);//当前页数
  const current_active_tag_id = ref(1);
  const current_active_tag_name = ref('');
  const is_empty_article_list_data = ref(false);

  //没有更多数据占位图（页面已经渲染到最后一页，没有更多数据可以加载渲染。
  //点击标签需初始化，否则因没有更多数据占位导致页面无法滚动到底部，上拉加载更多功能失效）
  const is_no_more_data = ref(false);
  //博文列表（瀑布流）加载下一页数据占位
  const is_next_page_loading = ref(false);

  //注入来自layout页面的当前选中标签id
  const parent_page_current_active_tag_id = inject('currentActiveTagId');

   // 注入来自layout页面（公共）提供修改当前选中标签id的方法
   const updateCurrentActiveTagIdFunction = inject('updateCurrentActiveTagIdFunction');


  function layoutPageOnReachBottom(event) {
    console.log(`${route.name}页面，元素的像素高度：${event.target.clientHeight}`);
  }


//获取资源栏页数据（内容标签栏数据、轮播图数据、博文列表数据（瀑布流组件）） 
  function getResourcePageData(){
  // 如果你想使用axios来模拟请求，可以这样做
  proxy.$get('/data/frontend/resource.json')
        .then(response => {
          // setTimeout(() => {
            resource_tag_data.value = response.tag_data; 
            resource_article_list_data.value = response.article_list_data; 
           
            
          flag.value=true;
          is_loading.value=false;
          console.log('response.tag_data:',response.tag_data)
          // }, 3000); // 假设加载时间是3秒
      

        })
        .catch(error => {

          console.error('Error fetching mock data:', error);
        });
  }


     //获取把子页面选中的标签id和标签名称传到父页面或者点击归档页标签统计栏的标签（路由携参?tag_id=标签名称跳转和来自父页面的当前选中标签id）
     function getChildClickTag(active_tag_id,active_tag_name){
	     // flag.value=false; //初始化导致子页面选中的标签id数据出现标签栏闪烁（当前标签栏处于显示状态，出现先隐藏后显示闪烁）
       is_loading.value=true;

proxy.$post('/data/frontend/resource.json',{tag_id:active_tag_id,tag_name:active_tag_name})
 .then(response => {
   // setTimeout(() => {
     resource_tag_data.value = response.tag_data; 
     resource_article_list_data.value = response.article_list_data; 

     const data_count= resource_article_list_data.value.length;
     for(let i=0;i<data_count;i++)
     {
       resource_article_list_data.value[i]['title']=`点击${active_tag_name}:`+resource_article_list_data.value[i]['title']
     }
    
 flag.value=true;//true：显示内容标签栏

 is_loading.value=false;

 })
 .catch(error => {

   console.error('Error fetching mock data:', error);
 });

  }


onMounted(() => {
    // 如果路由没有查询参数tag_id，那么执行getFrontendPageData。
    if(!route.query.tag_id){
      getResourcePageData();
    }else{
    //如果路由有查询参数tag_id(点击归档页标签统计栏的标签（路由携参?tag_id=标签名称跳转和来自父页面的当前选中标签id）)，
    //那么执行getChildClickTag。
    // ！！！注意：因为标签id设置默认为0，所以资源：如果判断标签id是否为空或空值，那么排除标签id=0的情况。
   let active_tag_name_from_archives_page=route.query.tag_id;
   let active_tag_id_from_archives_page=0;
   //如果有来自父页面的当前选中标签id，那么重新赋值。
   if(parent_page_current_active_tag_id.value){
    active_tag_id_from_archives_page=parent_page_current_active_tag_id.value
   }
      getChildClickTag(active_tag_id_from_archives_page,active_tag_name_from_archives_page);
    }
	//   fetchTag();
  });

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