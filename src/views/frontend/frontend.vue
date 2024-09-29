<template>
  
  <div class="feeds-page">
 
    <div  style="margin-top: 72px;">
      <ContentTag :parentPageTagData="frontend_tag_data"  @childClickTag="getChildClickTag" v-if="flag"></ContentTag>

    </div>

    <div class="feeds-container">
      <ContentCarouselImg :parentPageCarouselImgData="frontend_carousel_img_data" :isLoading="is_loading"></ContentCarouselImg>
      <Waterfall  :parentPageArticleListData="frontend_article_list_data"  :isLoading="is_loading"></Waterfall>
    </div>

  </div>

</template>


<script setup>
import { reactive,ref,onMounted,inject,getCurrentInstance} from 'vue';
import {useRoute, useRouter } from "vue-router";
  import ContentTag from '@/components/content_tag.vue';
  import ContentCarouselImg from '@/components/content_carousel_img.vue';
  import Waterfall from '@/components/waterfall.vue';
  const { proxy } = getCurrentInstance();//axios 代理
  const route = useRoute();
  const router = useRouter();

  const flag=ref(false);
  const is_loading = ref(true);

  const frontend_tag_data=ref();
  const frontend_article_list_data=ref();
  const frontend_carousel_img_data=ref();

  //来自父页面的当前选中标签id
  const parent_page_current_active_tag_id = inject('currentActiveTagId');

//获取前端栏页数据（内容标签栏数据、轮播图数据、博文列表数据（瀑布流组件））  
  function getFrontendPageData(){
     proxy.$get('/data/frontend/frontend.json')
      .then(response => {
        // setTimeout(() => {
          frontend_tag_data.value = response.tag_data; 
          frontend_carousel_img_data.value = response.carousel_img_data; 
          frontend_article_list_data.value = response.article_list_data; 
        
			flag.value=true;

			is_loading.value=false;
		
      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });
  }

    //获取把子页面选中的标签id和标签名称传到父页面或者点击归档页标签统计栏的标签（路由携参?tag_id=标签名称跳转和来自父页面的当前选中标签id）
    function getChildClickTag(active_tag_id,active_tag_name){
    
      // flag.value=false; //初始化导致子页面选中的标签id数据出现标签栏闪烁（当前标签栏处于显示状态，出现先隐藏后显示闪烁）
	is_loading.value=true;

     proxy.$post('/data/frontend/frontend.json',{tag_id:active_tag_id,tag_name:active_tag_name})
      .then(response => {
        // setTimeout(() => {
          frontend_tag_data.value = response.tag_data; 
          frontend_article_list_data.value = response.article_list_data; 
          frontend_carousel_img_data.value = response.carousel_img_data;
          const data_count= frontend_article_list_data.value.length;
          for(let i=0;i<data_count;i++)
          {
            frontend_article_list_data.value[i]['title']=`点击${active_tag_name}:`+frontend_article_list_data.value[i]['title']
          }
         
			flag.value=true;//true：显示内容标签栏
   
			is_loading.value=false;
		
      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });

  
  }

  

onMounted(() => {
 
    // 假设JSON文件与组件在同一目录下
    // import('./mock-data.json').then(res => {
    //   items.value = res.data;
    // }).catch(error => {
    //   console.error('Error fetching mock data:', error);
    // });
    // 如果路由没有查询参数tag_id，那么执行getFrontendPageData。
    if(!route.query.tag_id){
      getFrontendPageData();
    }else{
    //如果路由有查询参数tag_id(点击归档页标签统计栏的标签（路由携参?tag_id=标签名称跳转和来自父页面的当前选中标签id）)，
    //那么执行getChildClickTag。
    // ！！！注意：因为标签id设置默认为0，所以后端：如果判断标签id是否为空或空值，那么排除标签id=0的情况。
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