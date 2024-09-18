<template>

    <div class="side-bar">

        <ul class="channel-list">
			<li  v-for="(menu,index) in layoutMenuData"  :data-menu_path="menu.menu_path" :data-active_menu_path="data.active_menu_path" :class="{'active-channel': data.active_menu_path==menu.menu_path?true:''}"  @click="clickMenu(menu.menu_path)">
				<a class="link-wrapper":href="menu.menu_path">
					<svg-icon  class="svg_icon"  style="width: 1em; height: 1em; margin-right: 8px;"  :icon-class="menu.menu_name" />
					<span class="channel"> {{menu.menu_title}}</span>
				</a>
			</li>
        </ul>

      </div>

</template>

<script setup>
import { reactive, ref,onMounted } from 'vue';
// menu_name: string //菜单唯一标识，与路由名保持一致
// menu_title: string //菜单显示名称


const props = defineProps({
	layoutMenuData: {
			type: Array,
			default:[
						{
						menu_id: 1,
						menu_name: "index",
						menu_title: "首页",
						menu_path: "/",
						},
						{
						menu_id: 2,
						menu_name: "frontend",
						menu_title: "前端",
						menu_path: "/frontend",
						},
						{
						menu_id: 3,
						menu_name: "backend",
						menu_title: "后端",
						menu_path: "/backend",
						},

						{
						menu_id: 4,
						menu_name: "resource",
						menu_title: "资源",
						menu_path: "/resource",
						},

						{
						menu_id: 5,
						menu_name: "archives",
						menu_title: "归档",
						menu_path: "/archives",
						},

						{
						menu_id: 6,
						menu_name: "diary",
						menu_title: "随笔",
						menu_path: "/diary",
						},

					],
    	},
    
});



  const menuInfo = ref(
	
);




const data=reactive( {
	active_menu_path:'/index', 
})





  onMounted(()=>{
    //     console.log('挂载完毕');
		//导航栏菜单选中背景色刷新后消失的原因及解决办法
		data.active_menu_path =  window.location.pathname;
		// console.log('window.location.pathname:',window.location.pathname);
		// window.location.pathname: /archives
		
    })

    
function clickMenu(menu_path){  
	data.active_menu_path=menu_path;
	// console.log('menmenu_nameu_id:',menu_path);
	// console.log('data.active_menu_path:',data.active_menu_path);

}
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
		/* visibility: visible; */

	
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