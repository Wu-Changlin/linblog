<template>

    <div class="side-bar">

        <!-- <ul class="channel-list">
			<li  v-for="(menu,index) in parentPageMenuData">
				<a class="link-wrapper">
	  <svg-icon  class="svg_icon"  style="width: 1em; height: 1em; margin-right: 8px;"  :icon-class="menu.icon" />

					<span class="channel"> {{menu.menu_title}}</span>
				</a>
			</li>
        </ul> -->




		<el-aside width="collapse">
			<!-- <el-menu :collapse="isCollapse"  class="el-menu-vertical"> -->
				<el-menu class="el-menu-vertical">
	
				<!-- <div class="gvb_aside_header flex">
					<div class="gvb_aside_logo">
						<el-icon :size="60" color="red"><Setting /></el-icon>
					</div>
	
					<div class="gvb_aside_title">Lin博客后台系统</div>
				</div> -->
	
				<template   v-for="menu in parentPageMenuData">
					<!-- 判断有无子组件，有继续 -->
					<el-sub-menu  v-if="menu.children.length > 0 " :index="menu.menu_id +''">
						<template #title>
							<svg-icon  class="svg_icon"  style="width: 1em; height: 1em; margin-right: 8px;"  :icon-class="menu.icon" />
							<span>{{ menu.menu_title }}</span>
						</template>
						<!-- 遍历子组件 start-->
						<template   v-for="(sub_menu,item) in menu.children">
						<el-menu-item @click="goto(sub_menu.menu_path)"  :index="sub_menu.menu_id +''">
							<svg-icon  class="svg_icon"  style="width: 1em; height: 1em; margin-right: 8px;"  :icon-class="sub_menu.icon" />
							<span>{{ sub_menu.menu_title }}</span>
						</el-menu-item>
					   </template>
						<!-- 遍历子组件 end-->
					</el-sub-menu>
	
					<!-- 无子组件，继续 -->
					<el-menu-item  v-else   @click="goto(menu.menu_path)" :index="menu.menu_id +''">
						<svg-icon  class="svg_icon"  style="width: 1em; height: 1em; margin-right: 8px;"  :icon-class="menu.icon" />
						<span>{{ menu.menu_title }}</span>
					</el-menu-item>
	
				</template>
							
			</el-menu>
	
		</el-aside>



      </div>


</template>

<script setup>
import { reactive, ref,onMounted ,computed} from 'vue';
import { useRoute,useRouter } from "vue-router";
const route=useRoute();
const router=useRouter();
// menu_name: string //菜单唯一标识，与路由名保持一致
// menu_title: string //菜单显示名称


const props = defineProps({
	parentPageMenuData: {
			type: Array,
},
});

// for(){

// }


//侧边栏菜单点击
function goto(menu_path){
//   console.log(menu_path);
//路由跳转
  router.push({
    path:menu_path
  })
}

//计算属性active_menu_name来获取路由的名称
const active_menu_name = computed(() => route.menu_name);


</script>

<style scoped>

  	.side-bar {
		height: calc(100vh - 72px);
		overflow-y: scroll;
		background-color: var(--bg);
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		padding-top: 16px;
		margin-top: 72px;
		position: fixed;
		overflow: visible;
		overflow-y: auto;
		/* visibility: visible; */
		box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.05);
	
		@media screen and (max-width: 695px) {
			display: none;
			/* visibility: hidden; */
			
		}
		@media screen and (min-width: 696px) and (max-width: 959px) {
			display: none;
			/* visibility: hidden; */
			
		}

		@media screen and (min-width: 960px) and (max-width: 1191px) {
			width: calc(-18px + 25vw);
			margin-left: 12px;
		}

		@media screen and (min-width: 1192px) and (max-width: 1423px) {
			width: calc(-16.8px + 20vw);
			margin-left: 12px;
		}

		@media screen and (min-width: 1424px) and (max-width: 1727px) {
			width: calc(-21.33333px + 16.66667vw);
			margin-left: 16px;
		}

		@media screen and (min-width: 1728px) {
			width: 266.66667px;
			margin-left: 16px;
		}

		

		.channel-list {
			min-height: auto;
			-webkit-user-select: none;
			user-select: none;
			flex-direction: column;/*表示子元素在容器内垂直排列。*/
            justify-content: center; /*表示子元素在容器内垂直居中。*/
			 
			.active-channel {
				background-color: var(--side_bar_active_bg);
				border-radius: 999px;
				color: var(--text)
			}

			li {
				padding-left: 16px;
				min-height: 48px;
				display: flex;
				align-items: center;
				cursor: pointer;
				margin-bottom: 8px;
				color: rgba(51, 51, 51, 0.6);
				


				.link-wrapper {
					display: flex;
					width: 100%;
					height: 48px;
					align-items: center;
				}
				
				&:hover {
					background-color: var(--side_bar_active_bg);
					border-radius: 999px;
					color: var(--text);
				}
			}

			.channel {
				font-size: 16px;
				font-weight: 600;
				margin-left: 12px;
				color: var(--text);
			}
		}

	}

	
	.svg_icon {
		fill: var(--primary)!important;
	}

</style>