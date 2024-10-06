<template>
	<div class="container">
		<BackendNavBar  :parentPageLogData="layout_page_log"  :parentPageArticleListData="layout_page_article_list_data"></BackendNavBar>
		
		<div class="main">
			<SideBar :parentPageMenuData="layout_page_menu_list_data"></SideBar>

			<div class="main-content with-side-bar">	
				<router-view />
				
			</div>

		</div>
		
		
	</div>


</template>


<script setup>
import { reactive, ref,onMounted,provide,getCurrentInstance} from 'vue';
import { useRouter } from "vue-router";
import BackendNavBar from "@/components/backend/backend_nav_bar.vue";
import SideBar from "@/components/side_bar.vue";
import FloatingBtnSets from "@/components/floating_btn_sets.vue";
import Footer from "@/components/footer.vue";
const { proxy } = getCurrentInstance();//axios 代理

// 修改当前选中菜单id 结束


const layout_page_log=ref();
const layout_page_menu_list_data=ref();
//获取log和菜单导航栏   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
function getLayoutLogOrMenuListData(){

	proxy.$get("/data/frontend/layout.json")
	.then(response => {
        layout_page_log.value = response.log_data; // log
		layout_page_menu_list_data.value = response.menu_data; // 菜单数据

		
    })
	.catch(error => {
        console.log('eeror:',error)
proxy.$Message('请求未找到', 'error');
});



}


onMounted(() => {

	//获取log和菜单导航栏（外加搜索匹配关键字数据）   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
	getLayoutLogOrMenuListData();
   
  });



</script>

<style scoped>

*{ /*启用滚动功能 */
    padding: 0;
    margin: 0;
    -ms-overflow-style: none; /* 适用于 Internet Explorer 和旧版 Edge */
    scrollbar-width: none; /* 适用于 Firefox */
    -webkit-scrollbar:none;/* WebKit 内核浏览器（如 Chrome 和 Safari）中的滚动条*/ 
}

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