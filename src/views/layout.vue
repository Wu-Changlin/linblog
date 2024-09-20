<template>
	<div class="container">
		<NavBar  :layoutLogData="layout_log"></NavBar>

		<div class="main">
			<SideBar :layoutMenuData="layout_menu_list_data"></SideBar>

			<div class="main-content with-side-bar">	
				<router-view />
			</div>

			<FloatingBtnSets :layoutMenuData="layout_menu_list_data"></FloatingBtnSets>
			<!-- <Footer></Footer> -->
			
		</div>
		
		
	</div>


</template>


<script setup>
import { reactive, ref,onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from "vue-router";
import NavBar from "@/components/nav_bar.vue";
import SideBar from "@/components/side_bar.vue";
import FloatingBtnSets from "@/components/floating_btn_sets.vue";
import Footer from "@/components/footer.vue";




const layout_log=ref();
const layout_menu_list_data=ref();
//获取菜单导航栏   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
onMounted(() => {
    // 假设JSON文件与组件在同一目录下
    // import('./mock-data.json').then(res => {
    //   items.value = res.data;
    // }).catch(error => {
    //   console.error('Error fetching mock data:', error);
    // });
   
    // 如果你想使用axios来模拟请求，可以这样做
    axios.get('/data/frontend/page_components.json', { responseType: 'json' })
      .then(response => {
        // setTimeout(() => {
			layout_log.value = response.data.log_data; // 数据加载完毕，关闭骨架屏
			layout_menu_list_data.value = response.data.menu_data; // 数据加载完毕，关闭骨架屏
        // }, 3000); // 假设加载时间是3秒
		

      })
      .catch(error => {

        console.error('Error fetching mock data:', error);
      });

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