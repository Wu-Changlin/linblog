<template>
	<div class="container">
		<NavBar :parentPageLogData="layout_page_log" :parentPageArticleCount="layout_page_article_count"
			:parentPageArticleListData="layout_page_article_list_data"></NavBar>

		<div class="main">
			<SideBar :parentPageMenuData="layout_page_menu_list_data"></SideBar>

			<div class="main-content with-side-bar">
				<router-view />

			</div>

			<FloatingBtnSets :parentPageMenuData="layout_page_menu_list_data"></FloatingBtnSets>

		</div>


	</div>


</template>


<script setup>
	import { reactive, ref, onMounted, onUpdated, onBeforeUpdate, provide, inject,computed ,onUnmounted} from 'vue';
	import {useRoute, useRouter } from "vue-router";
	import NavBar from "@/components/nav_bar.vue";
	import SideBar from "@/components/side_bar.vue";
	import FloatingBtnSets from "@/components/floating_btn_sets.vue";
	import Footer from "@/components/footer.vue";
	import layoutModuleApi from "@/api/frontend/layout.js";//api接口
	import useMetaInfo from '@/hooks/useMetaInfo.js';//设置页面meta元数据，标题、关键词、描述
	import { useMenuStore } from '@/stores/useMenuStore.js';//临时存储活跃菜单id  会话级
	
	const route= useRoute();

	//使用 provide inject 代替getCurrentInstance
	const $message = inject('$message');

	const layout_page_article_count = ref(0);
	const layout_page_article_list_data = ref();
	// 获取搜索关键字匹配所用数据源  提供一个获取数据的方法
	const getSearchKeywordMatchArticleListDataFunction = () => {
		layoutModuleApi.getSearchKeywordMatchArticleListDataFunction({})
			.then(response => {
				// setTimeout(() => {
				layout_page_article_count.value = response.article_count; // 博文数量
				layout_page_article_list_data.value = response.article_list; // 博文列表
				// }, 3000); // 假设加载时间是3秒

			})
	}
	// 使用 provide 向下传递方法
	provide('getSearchKeywordMatchArticleListDataFunction', getSearchKeywordMatchArticleListDataFunction);

	// 修改当前选中标签id 开始

	const current_active_tag_id = ref(0);
	// 提供数据
	provide('currentActiveTagId', current_active_tag_id);

	// 修改当前选中标签id的方法
	function updateCurrentActiveTagIdFunction(new_active_tag_id) {
		current_active_tag_id.value = new_active_tag_id;
	}

	// 暴露方法(修改当前选中标签id的方法)供子组件调用
	provide('updateCurrentActiveTagIdFunction', updateCurrentActiveTagIdFunction);

	// 修改当前选中标签id 结束

	// 修改当前选中菜单id 开始

	
	const current_active_active_menu_id = ref(1);

	
	
	// 提供数据
	provide('currentActiveMenuId', current_active_active_menu_id);

	
	// 修改当前选中菜单id的方法
	function updateCurrentActiveMenuId(new_active_menu_id) {
		// current_active_active_menu_id.value = new_active_menu_id;
		current_active_active_menu_id.value = new_active_menu_id;
		// console.log('current_active_active_menu_id.value:',current_active_active_menu_id.value)
	}


	// 暴露方法(修改当前选中菜单id的方法)供子组件调用
	provide('updateCurrentActiveMenuId', updateCurrentActiveMenuId);

	// 修改当前选中菜单id 结束

	//current_active_menu_name=计算属性来获取路由的名称
	const current_active_menu_name = computed(() => route.name);

	// 提供数据，当前路由的名称
	provide('currentActiveMenuName', current_active_menu_name);

	const layout_page_log = ref();
	const layout_page_menu_list_data = ref();
	//获取log和菜单导航栏   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
	function getLayoutLogOrMenuListData() {

		layoutModuleApi.getLayoutLogOrMenuListData({})
			.then(response => {

				layout_page_log.value = response.log_data; // log
				layout_page_menu_list_data.value = response.menu_data; // 菜单数据
				getSearchKeywordMatchArticleListDataFunction();//匹配关键字数据源
				// console.log('layout_page_menu_list_data:', response);
			})
	}

	// 修改当前页面meta元数据，标题、关键词、描述  开始

	// meta元数据，标题、关键词、描述 
	const current_meta_title = ref('');
	const current_meta_keywords = ref('');
	const current_meta_description = ref('');

	// 调用封装函数使用@unhead/vue的useHead修改页面meta元数据
	useMetaInfo(current_meta_title,current_meta_keywords,current_meta_description);

	// 提供数据
	provide('current_meta_title', current_meta_title);
	provide('current_meta_keywords', current_meta_keywords);
	provide('current_meta_description', current_meta_description);



	// 修改当前页面meta元数据，标题、关键词、描述的方法。接收子路由页面的新值 
	function updateCurrentMetaInfoFunction(new_current_meta_info) {
		current_meta_title.value=new_current_meta_info.meta_title;
		current_meta_keywords.value=new_current_meta_info.meta_keywords;
		current_meta_description.value=new_current_meta_info.meta_description;
    // console.log(`updateCurrentMetaInfoFunction:meta_title=${meta_title},meta_keywords=${meta_keywords},meta_description=${meta_description}`)
	}

	// 暴露方法(修改当前页面meta元数据，标题、关键词、描述的方法 )供子组件调用
	provide('updateCurrentMetaInfoFunction', updateCurrentMetaInfoFunction);

	// 修改当前页面meta元数据，标题、关键词、描述  结束


	onMounted(() => {
		
		//获取log和菜单导航栏（外加搜索匹配关键字数据）   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
		getLayoutLogOrMenuListData();
	});


	
// 实例
const menuStore = useMenuStore();

// 组件销毁前调用方法移除sessionStorage
onUnmounted(() => {
	menuStore.removeStoreMenuId();
});


</script>

<style scoped>
	* {
		/*启用滚动功能 */
		-ms-overflow-style: none;
		/* 适用于 Internet Explorer 和旧版 Edge */
		scrollbar-width: none;
		/* 适用于 Firefox */
		-webkit-scrollbar: none;
		/* WebKit 内核浏览器（如 Chrome 和 Safari）中的滚动条*/
	}

	.container {
		padding: 0;
		max-width: 1728px;
		background-color: var(--bg);
		/* fff*/
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