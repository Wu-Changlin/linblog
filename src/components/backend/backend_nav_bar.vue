<template>
	<div class="header-container">
		<header class="mask-paper">
			<a aria-current="page" href="/" class="router-link-exact-active"
				id="link-guide">
				<img crossorigin="anonymous" class="header-logo" style="pointer-events:none;" :src="parentPageLogData">
			</a>

			<!-- 右边主题图标 -->
			<div  class="header-container-right-icon">
				<!-- <button class="reds-button-new large primary has-icon pure-icon"> -->
				<NavTheme></NavTheme>
				<!-- </button> -->

			</div>
		</header>
	</div>



</template>

<script setup>
	import { ref, reactive, onMounted, onUnmounted, watch, computed, inject, provide } from "vue";
	import { useRouter, useRoute } from "vue-router";
	import NavTheme from '@/components/nav_theme.vue';
	import { debounce, throttle } from '@/hooks/debounce_throttle.js';



	const router = useRouter();
	const route = useRoute();


		//接受父页面数据(目前有3个页面传值layout.vue、search.vue、article.vue)
		const props = defineProps({
		parentPageLogData: {
			type: String,
			default: "/logo.png",
		},
		

	});

	
</script>


<style scoped>
	.match-title {
		white-space: nowrap;
		/* （ 默认 normal 自动换行） */

		/*2. 超出的部分隐藏*/
		overflow: hidden;

		/*3. 文字用省略号替代超出的部分*/
		text-overflow: ellipsis;
		padding: 3px;
	}

	.match-content {
		padding-left: 3px;
		/* 缩进2个字符 */
		text-indent: 2em;

	}

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
		background: var(--bg);


		.mask-paper {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			max-width: 1728px;
			height: 72px;
			/* padding: 0 16px 0 16px; */
			padding: 0;
			margin: 0;

			.header-logo {
				flex: 1;
				width: auto;
				height: 32px
			}

			/* 移除输入框在点击时边框的变化 */
			input:focus,
			input:hover {
				outline: none;
			}

			.input-box {
				height: 40px;
				position: fixed;
				left: 50%;
				transform: translate(-50%);

				@media screen and (max-width: 695px) {
					width: calc(-24px + 100vw);
					width: 0;
				}

				@media screen and (min-width: 960px) and (max-width: 1191px) {
					width: calc(-36px + 50vw);
				}

				@media screen and (min-width: 1192px) and (max-width: 1423px) {
					width: calc(-33.6px + 40vw);
				}

				@media screen and (min-width: 1424px) and (max-width: 1727px) {
					width: calc(-42.66667px + 33.33333vw);
				}

				@media screen and (min-width: 1728px) {
					width: 533.33333px;
				}

				.search-input {
					padding: 0 84px 0 16px;
					width: 100%;
					height: 100%;
					font-size: 16px;
					line-height: 120%;
					color: var(--color-primary-label);
					background: var(--color-active-background);
					border: none;
					border-radius: 999px;

					@media screen and (max-width: 695px) {

						padding: 0
					}
				}

				.search-input.minWidthShowSearchClass {
					padding: 0 84px 0 16px
				}


				.input-button {
					position: absolute;
					right: 0;
					top: 0;
					display: flex;
					align-items: center;
					justify-content: center;
					height: 100%;
					color: var(--color-secondary-label);

					@media screen and (max-width: 695px) {

						opacity: 0
					}

					.search-icon {
						width: 40px;
						height: 100%;
						display: flex;

						align-items: center;
						justify-content: center;
						cursor: pointer;
						color: var(--color-secondary-label);

					}


					.close-icon {
						width: 40px;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						cursor: pointer;
						color: var(--color-secondary-label);
					}


				}


				.input-button.minWidthShowSearchClass {
					opacity: 1
				}


			}

			.input-box.minWidthShowSearchClass {
				position: relative;
				left: 0;
				transform: translate(0);
				width: 100%;
				margin-left: 20px
			}



			.header-container-right-icon {
				display: block;
				right: 30px;

				position: fixed;

			}


			.reds-button-new {
				height: 40px !important;
				color: var(--color-secondary-label);
				font-size: 16px;
				line-height: 120%;
				padding: 0 16px;
				background: transparent;
				border: none;
				background-color: transparent;

			}

			.reds-button-new:hover {
				background: var(--color-active-background);
				border-radius: 999px;
				color: var(--color-primary-label)
			}

			.reds-button-new .reds-button-new-box {
				font-weight: 400
			}

			.cancel-btn {
				margin-left: 12px
			}

			.min-width-search-icon {
				cursor: pointer;
				padding-right: 10px;
				display: none
			}

			@media screen and (max-width: 695px) {
				.min-width-search-icon {
					display: block;
					position: fixed;
					right: 52px
				}
			}



			.reds-button-new-box {
				display: flex;
				align-items: center;
				justify-content: center;
				position: relative;
				font-weight: 500
			}

			.reds-icon {
				display: inline-block;
				vertical-align: middle;
				fill: currentColor;

			}





			.select-container {
				width: 100%;
				height: 300px;
				margin-top: 10px;
				background-color: var(--bg);
				border-radius: 5px;
				border: 1px solid var(--bg);
				border-radius: 6px;
				border: 1px solid #E4E7ED;
				/* border: 1px solid red; */
				transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
				z-index: 12;
				overflow-y: auto;
				overflow-x: hidden;
				display: flex;
				position: fixed;
				display: none;
			}

			.select-list {
				margin-top: 10px;
				background-color: var(--bg);
				z-index: 12;
				border-radius: 5px;
				/* border: 1px solid #E4E7ED; */
				/* transform: translate(-100%, -30%); */
				border-radius: 6px;
			}

			.select-list>ul {
				margin: 0;
				padding: 0;

			}

			.select-container li {
				/* width:68px; */
				/* height: 50px; */
				height: auto;
				padding: 5px;
				/* line-height:34px; */
				white-space: nowrap;
				background-color: var(--bg);
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				list-style: none;
				cursor: pointer;
				text-align: start
			}

			.select-container li:hover {
				background-color: var(--color-active-background);
				border-radius: 999px;
				color: var(--txt);

			}


		}
	}
</style>