<template>
	<div class="header-container">
		<header class="mask-paper">
			<a v-if="show_right_search==false" aria-current="page" href="/" class="router-link-exact-active"
				id="link-guide">
				<img crossorigin="anonymous" class="header-logo" style="pointer-events:none;"
					src="@/assets/img/logo.png">
			</a>

			<div :class="{'input-box':true,'minWidthShowSearchClass':show_right_search?true:''}">
				<input type="text" 
					v-model="search_keyword"
					@input="handleInput()"
					:class="{'search-input':true,'minWidthShowSearchClass':show_right_search?true:''}"
					placeholder="请输入搜索内容" />
				<div :class="{'input-button':true,'minWidthShowSearchClass':show_right_search?true:''}">


					<div class="close-icon" v-show="search_keyword" @click="search_keyword = ''">
						<svg-icon style="width: 20;height: 20;" class="reds-icon" icon-class="close" />
					</div>

					<div class="search-icon" @click="goSearch()">
						<svg-icon style="width: 20;height: 20;" class="reds-icon" icon-class="search" />
					</div>
				</div>

				<div v-if="show_input_focus" style="display: flex;position: fixed;z-index: 12;width: 100%;height: 300px;">
					
					<div class="select-container">
						<div class="select-list">
							<!-- 下拉框列表 -->
								<ul>
									<li  v-for="(item,index) in data.Files" :key="item.value" @click="changeSelect(item.contribution_year)">
										{{ item.contribution_year }}
									</li>
								</ul>
							</div>
					</div>
					
				</div>


			</div>


			<!-- 右边搜索图标 -->
			<button @click="clickShowPhoneSearch" v-if="show_right_search==false"
				class="reds-button-new min-width-search-icon">
				<span class="reds-button-new-box">
					<svg-icon class="reds-icon reds-button__icon" icon-class="search" />
				</span>
			</button>

			<!-- 右边取消按钮 -->
			<button @click="clickHidePhoneSearch" v-if="show_right_search"
				style="width: 60px;border: none;background-color: transparent;">
				<span>取消</span>
			</button>

			<!-- 右边主题图标 -->
			<div v-if="show_right_search==false" class="header-container-right-icon">


				<button class="reds-button-new large primary has-icon pure-icon">
					<span class="reds-button-new-box">

						<NavTheme class="reds-icon reds-button__icon"></NavTheme>

					</span>
				</button>


			</div>


		</header>
	</div>



</template>

<script setup>
	import { ref, reactive, onMounted, onUnmounted } from "vue";
	import { useRouter } from "vue-router";
	import NavTheme from './nav_theme.vue';
	const router = useRouter();
	const search_keyword = ref('');
	const show_input_focus=ref(false);//搜索候选

function handleInput(){
	//  console.log('search_keyword.value:',search_keyword.value);
	if(search_keyword.value){
		show_input_focus.value=true;
	}else{
		show_input_focus.value=false;
	}

}

     

	//右侧搜索图标
	const show_right_search = ref(false);
	//点击显示移动端搜索框相关
	function clickShowPhoneSearch() {
		// console.log('clickShowPhoneSearch');
		show_right_search.value = true;
	}

	//点击取消搜索
	function clickHidePhoneSearch() {
		// console.log('clickHidePhoneSearch');
		show_right_search.value = false;
	}



	//去搜索
	function goSearch() {
		//直接跳转
		// const handleChange = () => {
		//   router.push("/testDemo");
		// };
		//带参数跳转

		if (search_keyword) {
			router.push({ name: 'search', query: { keyword: search_keyword.value }, key: new Date().getTime() });

		} else {
			console.log('请输入搜索内容')
		}




	}



</script>


<style scoped>



	.header-container {

		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100vw;
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

			.header-logo {
				flex: 1;
				width: auto;
				height: 32px
			}

			.tool-box {
				width: 24px;
				height: 70px;
				position: absolute;
				left: 0;
				top: 0;
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
					color: #333;
					background: rgba(0, 0, 0, 0.03);
					border: #333;
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
					color: rgba(51, 51, 51, 0.8);


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
						color: rgba(51, 51, 51, 0.8);

					}


					.close-icon {
						width: 40px;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						cursor: pointer;
						color: rgba(51, 51, 51, 0.8);
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

			;

			.header-container-right-icon {
				display: flex;

				.reds-button-new {
					height: 40px !important;
					color: var(--color-secondary-label);
					font-size: 16px;
					line-height: 120%;
					padding: 0 16px;
					background: transparent
				}

				.reds-button-new.has-icon.pure-icon.large {
					padding: 0 10px;
				}

				.reds-button-new.has-icon.pure-icon {
					border-radius: 50%
				}

				.reds-button-new.large.has-icon {
					padding-left: 16px
				}

				.reds-button-new.large {
					font-size: 16px;
					font-weight: 600;
					line-height: 16px;
					padding: 0 24px;
					height: 40px
				}




				.reds-button-new {
					position: relative;
					cursor: pointer;
					-webkit-user-select: none;
					user-select: none;
					white-space: nowrap;
					outline: none;
					background: none;
					border: none;
					vertical-align: middle;
					text-align: center;
					display: inline-block;
					padding: 0;
					border-radius: 100px;
					font-weight: 500
				}


				.reds-button-new-box {
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					font-weight: 500
				}


				.reds-button-new.has-icon.pure-icon .reds-button-new-box {
					padding: 0
				}

				.reds-button-new .reds-button-new-box {
					font-weight: 400
				}

				.reds-button-new-box {
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					font-weight: 500
				}

				/* height: 72px;
				width: 85px; */

				/* .icon-item {
					margin-left: auto;
					display: flex;
					width: 100%;
					height: 100%;
					align-items: center;
					justify-content: content;

					>div {
						margin-right: 10px;

						.svg-icon {
							width: 32px;
							height: 32px;
						}

					}

				} */
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


			
.select-container{
                  width:100%;
                  height:100%;
                  font-size: 14px;
                  font-weight: normal;
                  font-stretch: normal;
                  letter-spacing: 0px;
                  color: #333333;
                  /* border: 1px solid #494d59; */
                  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
				  z-index: 12;
                 
              }

.select-list{
                  margin-top: 10px;
                  background-color:var(--bg);
                  z-index:9;
                  border-radius:5px;
                  border:1px solid #E4E7ED;
            
                  /* transform: translate(-100%, -30%); */
                  border-radius: 6px;
              }
              .select-list>ul{
                  margin: 0;
                  padding: 0;
                 
              }
              .select-container li{
                  /* width:68px; */
                  padding:0 3px;
                  height:34px;
                  /* line-height:34px; */
                  white-space:nowrap;
                  /*background-color:#ffffff;*/
                  white-space:nowrap;
                  text-overflow:ellipsis;
                  overflow:hidden ;
                  list-style:none;
                  cursor:pointer;
                  text-align: center
                 
              }

			  .select-container li:hover{
                background-color: rgba(0, 0, 0, 0.03);
                border-radius: 999px;
                color: var(--blue);
				
              }


		}
	}
</style>