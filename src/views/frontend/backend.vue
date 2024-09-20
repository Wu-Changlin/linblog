<template>
  
  <div class="feeds-page">
  
    

    <div  style="margin-top: 72px;">
      <ContentTag :parentPageTagData="backend_tag_data"  @childClickTag="getChildClickTag" v-if="flag"></ContentTag>

    </div>
    


    <div class="feeds-container">
      <ContentCarouselImg :parentPageCarouselImgData="backend_carousel_img_data" :isloading="is_loading"></ContentCarouselImg>
      <Waterfall  :parentPageArticleListData="backend_article_list_data"  :isloading="is_loading" style="margin-top: 10px;" ></Waterfall>
    </div>

   

  </div>

</template>


<script setup>
import { reactive,ref,onMounted } from 'vue';
import { useRouter } from "vue-router";
import axios from 'axios';
  import ContentTag from '@/components/content_tag.vue';
  import ContentCarouselImg from '@/components/content_carousel_img.vue';
  import Waterfall from '@/components/waterfall.vue';
  
  
  
  const router = useRouter();

  const flag=ref(false);
  const is_loading = ref(true);

  const backend_tag_data=ref();
  const backend_article_list_data=ref();
  const backend_carousel_img_data=ref();


  
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
    axios.get('/data/frontend/backend.json', { responseType: 'json' })
      .then(response => {
        // setTimeout(() => {
          backend_tag_data.value = response.data.tag_data; 
          backend_article_list_data.value = response.data.article_list_data; 
          backend_carousel_img_data.value = response.data.carousel_img_data; 
          
        flag.value=true;
        is_loading.value=false;
        console.log('response.data.tag_data:',response.data.tag_data)
        // }, 3000); // 假设加载时间是3秒
		

      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });


	//   fetchTag();
  });

  
  //获取子页面选中的标签id数据
  function getChildClickTag(id){
	is_loading.value=true;
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