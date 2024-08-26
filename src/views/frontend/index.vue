<template>
	<div class="container">
		<NavBar :is_show="true"></NavBar>

		<div class="main">
			<SideBar></SideBar>

			<div class="main-content with-side-bar">	
				<CntentList></CntentList>
			</div>


			

			
			<FloatingBtnSets></FloatingBtnSets>
			<Footer></Footer>
			
		</div>
		
		
	</div>


</template>


<script setup>
import NavBar from "@/components/nav_bar.vue";
import SideBar from "@/components/side_bar.vue";
import CntentList from "@/components/content_list.vue";
import FloatingBtnSets from "@/components/floating_btn_sets.vue";
import Footer from "@/components/footer.vue";



import { reactive ,ref,nextTick,onMounted} from 'vue';
    import { useRouter } from "vue-router";
    const router = useRouter();
    const tagRef = ref();//获取元素高度


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