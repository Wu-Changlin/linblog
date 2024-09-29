<template>
	<div class="container">
		<NavBar  :parentPageLogData="layout_page_log" :parentPageArticleCount="layout_page_article_count" :parentPageArticleListData="layout_page_article_list_data"></NavBar>
		
		<div class="main">
			<SideBar :parentPageMenuData="layout_page_menu_list_data"></SideBar>

			<div class="main-content with-side-bar">	
				<router-view />
			</div>

			<FloatingBtnSets :parentPageMenuData="layout_page_menu_list_data"></FloatingBtnSets>
			<!-- <Footer></Footer> -->
			
		</div>
		
		
	</div>


</template>


<script setup>
import { reactive, ref,onMounted,provide} from 'vue';
import axios from 'axios';
import { useRouter } from "vue-router";
import NavBar from "@/components/nav_bar.vue";
import SideBar from "@/components/side_bar.vue";
import FloatingBtnSets from "@/components/floating_btn_sets.vue";
import Footer from "@/components/footer.vue";


const layout_page_article_count=ref(0);
const layout_page_article_list_data=ref();
// //获取搜索关键字匹配所用数据源  提供一个获取数据的方法
const getSearchKeywordMatchArticleListData= ()=>{
	axios.get('/data/frontend/all_article.json', { responseType: 'json' })
      .then(response => {
        // setTimeout(() => {
			layout_page_article_count.value = response.data.article_count; // 博文数量
			layout_page_article_list_data.value = response.data.article_list; // 博文列表
        // }, 3000); // 假设加载时间是3秒
		

      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });
}



// 使用 provide 向下传递方法
provide('getSearchKeywordMatchArticleListData', getSearchKeywordMatchArticleListData);

const layout_page_log=ref();
const layout_page_menu_list_data=ref();
//获取log和菜单导航栏   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
function getLayoutLogOrMenuListData(){
	    // 如果你想使用axios来模拟请求，可以这样做
	axios.get('/data/frontend/page_components.json', { responseType: 'json' })
      .then(response => {
        
			layout_page_log.value = response.data.log_data; // log
			layout_page_menu_list_data.value = response.data.menu_data; // 菜单数据
     
			getSearchKeywordMatchArticleListData();
	

      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });

}

onMounted(() => {
	//获取log和菜单导航栏（外加搜索匹配关键字数据）   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
	getLayoutLogOrMenuListData();
   
  });




</script>

<style scoped>



.container {
	padding: 0;
	max-width: 1728px;
	background-color: var(--bg);  /* fff*/
	margin: 0 auto;
	

	.main {
	display: flex;
	
	.main-content {
		width: 100%;	
		
	}

	.main-content {
		@media screen and (min-width: 960px) and (max-width: 1191px) {
		padding-left: calc(-6px + 25vw);
		}

		@media screen and (min-width: 1192px) and (max-width: 1423px) {
		padding-left: calc(-4.8px + 20vw);
		}

		@media screen and (min-width: 1424px) and (max-width: 1727px) {
		padding-left: calc(-5.33333px + 16.66667vw);
		}

		@media screen and (min-width: 1728px) {
		padding-left: 282.66667px;
		}
	}
	}
}



</style>