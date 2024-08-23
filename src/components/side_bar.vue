<template>

    <div class="side-bar">
        <ul class="channel-list">
		<li v-for="(site,index) in sideBarInfo"  :class="{'active-channel': site.menu_path == '/'?true:''}">
			<a class="link-wrapper":href="site.menu_path">
			<Star style="width: 1em; height: 1em; margin-right: 8px" />
			<span class="channel"> {{site.menu_chinese_name}}</span>
			</a>
		</li>
        </ul>

      </div>

</template>

<script setup>
import { reactive, ref } from 'vue';

// menu_name: string //菜单唯一标识，与路由名保持一致
// menu_chinese_name: string //菜单显示名称

const sideBarInfo = ref([
    {
        menu_name: "index",
        menu_chinese_name:"首页",
        menu_path: "/",
    },
    {
      menu_name: "frontend",
      menu_chinese_name:"前端",
      menu_path: "/frontend",
    },
    {
      menu_name: "backend",
      menu_chinese_name:"后端",
      menu_path: "/backend",
    },

    {
      menu_name: "resource",
      menu_chinese_name:"资源",
      menu_path: "/resource",
    },

    {
      menu_name: "archives",
      menu_chinese_name:"归档",
      menu_path: "/archives",
    },

    {
      menu_name: "diary",
      menu_chinese_name:"随笔",
      menu_path: "/diary",
    },
    
]);



</script>

<style>
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
				background-color: rgba(0, 0, 0, 0.03);
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
					background-color: rgba(0, 0, 0, 0.03);
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

		.information-container {
			display: inline-block;
			width: 100%;
			color: var(--text);
			font-size: 16px;
			position: absolute;
			bottom: 0;

			.information-pad {
				z-index: 16;
				margin-bottom: 4px;
				width: 100%;

				.container {
					width: 100%;
					background: var(--bg);
					box-shadow:
						0 4px 32px 0 rgba(0, 0, 0, 0.08),
						0 1px 4px 0 rgba(0, 0, 0, 0.04);
					border-radius: 12px;

					.divider {
						margin: 0px 12px;
						list-style: none;
						height: 0;
						border: 1px solid rgba(0, 0, 0, 0.08);
						border-width: 1px 0 0;
					}

					.group-wrapper {
						padding: 4px;

						.group-header {
							display: flex;
							align-items: center;
							padding: 0 12px;
							font-weight: 400;
							height: 32px;
							color: rgba(51, 51, 51, 0.6);
							font-size: 12px;
						}

						.menu-item {
							height: 40px;
							color: rgba(51, 51, 51, 0.8);
							font-size: 16px;
							border-radius: 8px;
							display: flex;
							align-items: center;
							padding: 0 12px;
							font-weight: 400;

							.icon {
								color: rgba(51, 51, 51, 0.3);
								margin-left: auto;
							}

							.component {
								margin-left: auto;
							}

							.multistage-toggle {
								position: relative;
								background: rgba(0, 0, 0, 0.03);
								display: flex();
								padding: 2px;
								border-radius: 999px;
								cursor: pointer;

								.active {
									background: var(--bg);
									box-shadow:
										0 2px 8px 0 rgba(0, 0, 0, 0.04),
										0 1px 2px 0 rgba(0, 0, 0, 0.02);
									color: var(--text);
								}

								.toggle-item {
									border-radius: 999px;
									background: transparent;
									color: rgba(51, 51, 51, 0.6);

									.icon-wrapper {
										width: 24px;
										height: 24px;
										display: flex;
										align-items: center;
										justify-content: center;
										cursor: pointer;
									}
								}
							}
						}
					}
				}
			}

			.information-wrapper {
				-webkit-user-select: none;
				user-select: none;
				cursor: pointer;
				position: relative;
				margin-bottom: 20px;
				height: 48px;
				width: 100%;
				display: flex;
				font-weight: 600;
				align-items: center;
				border-radius: 999px;
			}
		}
	}
</style>