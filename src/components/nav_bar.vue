<template>
	<div class="header-container">
		<header class="mask-paper">
			<a v-if="show_right_search==false" aria-current="page" href="/" class="router-link-exact-active"
				id="link-guide">
				<img crossorigin="anonymous" class="header-logo" style="pointer-events:none;" :src="layoutLogData">
			</a>

			<div :class="{'input-box':true,'minWidthShowSearchClass':show_right_search?true:''}">
				<input type="text" v-model="search_keyword" @input="handleInput()"
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

				<div v-if="show_input_focus"
					style="display: flex;position: fixed;z-index: 12;width: 100%;height: 300px;">

					<div class="select-container">
						<div class="select-list">

							<!-- 下拉框列表 -->
							<ul>
								<li>
									总匹配：{{ data.search_keyword_match_count}}项
								</li>
								<li v-for="(item,index) in data.Files" :key="item.value"
									@click="changeSelect(item.contribution_year)">
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
				<!-- <button class="reds-button-new large primary has-icon pure-icon"> -->
				<NavTheme></NavTheme>
				<!-- </button> -->

			</div>
		</header>
	</div>



</template>

<script setup>
	import { ref, reactive, onMounted, onUnmounted, watch, computed, inject } from "vue";
	import { useRouter } from "vue-router";
	import NavTheme from './nav_theme.vue';
	import axios from 'axios';
	const router = useRouter();
	const search_keyword = ref('');
	const show_input_focus = ref(false);//搜索候选

	const props = defineProps({
		layoutLogData: {
			type: String,
			default: "/logo.png",
		},
		layoutArticleCount: {
			type: Number,
		},

		layoutArticleListData: {
			type: Array,
		},

	});

	// const stopWatch=ref(null);
	// stopWatch.value=watch(() => props.layoutArticleListData, (newData) => {
	//   if (newData) {
	// 	console.log('article_list.value',article_list.value)
	//     // article_list.value = processData(newData);
	// 	article_count.value=props.layoutArticleCount;
	//   }
	// }, { immediate: true });

	const article_count = computed(() => {
		// 对传入的数据进行处理
		return props.layoutArticleCount;
	});

	const article_list = computed(() => {
		// 对传入的数据进行处理
		return props.layoutArticleListData;
	});


	// // 创建一个计算属性来判断props.data是否为空
	// const isArticleListDataEmpty = computed(() => {
	//   // 使用Object.keys来检查对象是否为空
	//   return  !props.layoutArticleListData || props.layoutArticleListData.length === 0 ;
	// });


	// function processData(data) {
	//   // 实现数据处理逻辑
	//   return data; // 示例中直接返回，实际可以进行各种转换
	// }
	//接受来自父页面的方法（当父页面props传值异常，调用此方法获取数据）
	const ParentPageGetSearchKeywordMatchData = inject('getSearchKeywordMatchData');

	const data = reactive(
		{

			search_keyword_match_data: [],  //
			search_keyword_match_count: 0,
		}
	);

	function handleInput() {
		if (search_keyword.value == '') {
			console.log('请输入内容...')
		} else if (search_keyword.value.search(/^\s+$/) >= 0) {
			// 检测输入值全是空白的情况
			// searchInit();
			// var itemDiv = tmpDiv.cloneNode(true);
			// itemDiv.innerText = '请输入有效内容...';
			// searchResults.appendChild(itemDiv);
			console.log('请输入有效内容...')
		} else {
			// 合法输入值的情况
			// searchInit();

			//数据为空或者值小于1或者数组长度小于1，即数据异常重新请求接口获取新数据
			if (!article_count.value || article_count.value < 1 || !article_list.value || article_list.length < 1) {
				ParentPageGetSearchKeywordMatchData();

				// console.log('false_article_count:',article_count.value);
			}
			// 在标题、内容中查找
			searchMatching(search_keyword.value);
		}

	}


	function searchMatching(search_value) {
		// 忽略输入大小写
		//  const input = new RegExp(search_value, 'i'); 
		const input = new RegExp(search_value, 'i');
		let match_data = {};
		let match_count = 0;
		// 在所有文章标题、内容中匹配关键字
		for (let i = 0; i < article_count.value; i++) {
			let title_index = article_list.value[i]['title'].search(input);
			let article_content_index = article_list.value[i]['article_content'].search(input)

			let len = input.toString().length - 3;
			let step = 10;

			if (title_index !== -1 || article_content_index !== -1) {
				let result_article_title_match_data = '';
				let result_article_content_match_data = '';

				if (title_index !== -1) {
					let result_title_index = title_index;
					let result_title_array = article_list.value[i]['title'];

					let result_title_keyword_start = result_title_array.slice(result_title_index - step, result_title_index);
					let result_title_keyword = '<mark>' + result_title_array.slice(result_title_index, result_title_index + len) + '</mark>';
					let result_title_keyword_end = result_title_array.slice(result_title_index + len, result_title_index + len + step);

					result_article_title_match_data = result_title_keyword_start + result_title_keyword + result_title_keyword_end;
					// console.log('result_title_keyword_start:',result_title_keyword_start)
					// console.log('result_title_keyword:',result_title_keyword)
					// console.log('result_title_keyword_end:',result_title_keyword_end)
					// console.log('all:',result_title_keyword_start,result_title_keyword,result_title_keyword_end)

				} else {
					result_article_title_match_data = article_list.value[i]['title'];
				}

				if (article_content_index !== -1) {
					let result_article_content_index = article_content_index;
					let result_article_content_array = article_list.value[i]['article_content'];

					let result_article_content_keyword_start = result_article_content_array.slice(result_article_content_index - step, result_article_content_index);
					let result_article_content_keyword = '<mark>' + result_article_content_array.slice(result_article_content_index, result_article_content_index + len) + '</mark>';
					let result_article_content_keyword_end = result_article_content_array.slice(result_article_content_index + len, result_article_content_index + len + step)
					// console.log('result_article_content_keyword_start:',result_article_content_keyword_start)
					// // console.log('result_article_content_keyword:',result_article_content_keyword)
					// // console.log('result_article_content_keyword_end:',result_article_content_keyword_end)
					// console.log('all:',result_article_content_keyword_start,result_article_content_keyword,result_article_content_keyword_end)
					result_article_content_match_data = result_article_content_keyword_start + result_article_content_keyword + result_article_content_keyword_end;
				}

				match_count++;  //成功匹配计数加一

				match_data = {

					result_article_title_match_data: result_article_title_match_data,
					result_article_content_match_data: result_article_content_match_data
				};

				data.search_keyword_match_data.push(match_data); //push数组末尾添加
			}

		}

		data.search_keyword_match_count = match_count;

		show_input_focus.value = true;

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


	onUnmounted(() => {
		// stopWatch.value();
	})

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


			.sug-container-wrapper{
                margin-top: 8px;
                width: 100%;
                background-color: var(--elevation-high-background);
                box-shadow: var(--elevation-high-shadow);
                border-radius: 12px;
                overflow: scroll
            }



			.select-container {
				width: 100%;
				height: 100%;
				font-size: 14px;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 0px;
				color: var(--color-border);
				background: var(--color-active-background);

				/* border: 1px solid #494d59; */
				transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
				z-index: 12;

			}

			.select-list {
				margin-top: 10px;
				background-color: var(--bg);
				z-index: 9;
				border-radius: 5px;
				border: 1px solid #E4E7ED;

				/* transform: translate(-100%, -30%); */
				border-radius: 6px;
			}

			.select-list>ul {
				margin: 0;
				padding: 0;

			}

			.select-container li {
				/* width:68px; */
				padding: 0 3px;
				height: 34px;
				/* line-height:34px; */
				white-space: nowrap;
				background-color:#ffffff;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				list-style: none;
				cursor: pointer;
				text-align: center
			}

			.select-container li:hover {
				background-color: rgba(0, 0, 0, 0.03);
				border-radius: 999px;
				color: var(--blue);

			}


		}
	}
</style>