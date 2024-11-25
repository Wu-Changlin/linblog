<template>
	<div class="header-container">
		<header class="mask-paper">

			<a aria-current="page" href="/" id="link-guide">
				<img crossorigin="anonymous" class="header-logo" style="pointer-events:none;" :src="parentPageLogData">

			</a>

			<div style="margin-left: 30px;" >

				<svg-icon v-show="is_collapse_side_menu"   @click="isCollapse()"class="svg-icon" icon-class="Expand" />
				<svg-icon v-show="!is_collapse_side_menu" @click="isCollapse()" class="svg-icon" icon-class="Fold" />
			
			</div>


			<!-- 右边主题图标 -->
			<div class="header-container-right-icon">

				<!-- <button class="reds-button-new large primary has-icon pure-icon"> -->
				<div class="right-item">
					<NavTheme></NavTheme>
				</div>
				<div class="right-item">
					<div>管理员</div>
				</div>


				<!-- </button> -->

			</div>
		</header>
	</div>



</template>

<script setup>
	import { ref, reactive, onMounted, onUnmounted, watch, computed, inject, provide } from "vue";
	import { useRouter, useRoute } from "vue-router";
	import NavTheme from '@/components/nav_theme.vue';
	import { debounce, throttle } from '@/hooks/debounceAndThrottle.js';



	const router = useRouter();
	const route = useRoute();


	//接受父页面数据(目前有3个页面传值layout.vue、search.vue、article.vue)
	const props = defineProps({
		parentPageLogData: {
			type: String,
			default: "/logo.png",
		},


	});


	// 提供数据


const is_collapse_side_menu = inject('isCollapseSideMenu');
//  来自公共页admin 修改当前侧边栏菜单折叠或展开的方法
const parentUpdateIsCollapseSideMenuFunction = inject('updateIsCollapseSideMenuFunction');



// 设置侧边栏折叠状态
	function isCollapse(){
		console.log('is_collapse_side_menu:',is_collapse_side_menu.value)
		is_collapse_side_menu.value=!is_collapse_side_menu.value;
		parentUpdateIsCollapseSideMenuFunction(is_collapse_side_menu.value);
		
	}


</script>


<style scoped>

	.header-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		height: 72px;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 11;
		align-items: center;
		background-color: var(--bg);

		box-shadow: 0 0px 0px 6px rgba(7, 17, 27, 0.05);
		.mask-paper {
			background-color: var(--bg);

			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;

			height: 72px;
			/* padding: 0 16px 0 16px; */
			padding: 0;
			margin: 0;

			.header-logo {
				flex: 1;
				width: auto;
				height: 40px;

				/* justify-content: space-between; */


			}


			.header-container-right-icon {
				display: flex;
				justify-content: space-between;
				align-items: center;
				user-select: none;
				-webkit-user-select: none;
				/* right: 10px; */
				margin-left: auto;
				background-color: var(--bg);

				.right-item {

					display: flex;
					justify-content: center;
					align-items: center;
					padding: 0 5px;
					cursor: pointer;
					-webkit-user-select: none;
					user-select: none;
					background-color: var(--bg);

				}

			}

		}
	}
</style>