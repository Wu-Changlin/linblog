<template>
	<div class="header-container">
		<header class="mask-paper">
			<a v-if="show_right_search==false" aria-current="page" href="/" class="router-link-exact-active">
				<img crossorigin="anonymous" class="header-logo" style="pointer-events:none;" :src="parentPageLogData">
			</a>

			<div :class="{'input-box':true,'minWidthShowSearchClass':show_right_search?true:''}"
				ref="searchInputContainerRef">
				<input type="text" v-model="search_keyword" @input="handleInput()"
					:class="{'search-input':true,'minWidthShowSearchClass':show_right_search?true:''}"
					placeholder="请输入搜索内容" @blur="searchInputBlur" ref="searchInputRef" />
				<div :class="{'input-button':true,'minWidthShowSearchClass':show_right_search?true:''}">


					<div class="close-icon" v-show="search_keyword" @click="search_keyword = ''">
						<svg-icon style="width: 20;height: 20;" class="reds-icon" icon-class="close" />
					</div>

					<div class="search-icon" @click="goSearch()">
						<svg-icon style="width: 20;height: 20;" class="reds-icon" icon-class="search" />
					</div>
				</div>

				<!-- 匹配关键字列表 开始-->
				<!-- <div v-if="match_keyword_list" style="display: flex;position: fixed;z-index: 12;width: 100%;height: 300px;"> -->
				<!-- <div v-if="match_keyword_list"> -->

				<!-- <div class="select-container" v-if="match_keyword_list"> -->
				<div class="select-container" :style="{display:match_keyword_list?'block':'none'}">
					<div class="select-list">
						<span>
							总匹配：{{ data.search_keyword_match_count}}项
						</span>
						<!-- 下拉框列表 -->
						<ul>
							<li v-for="(item,index) in data.search_keyword_match_data" :key="item.index"
								@click="gotoViewArticle(item.article_id)">
								<div class="match-title" v-html="item.result_article_title_match_data"></div>
								<div class="match-content" v-html="item.result_article_content_match_data"></div>

							</li>
						</ul>
					</div>
				</div>

				<!-- </div> -->
				<!-- 匹配关键字列表 结束-->

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
	import { ref, reactive, onMounted, onUnmounted, watch, computed, inject, provide } from "vue";
	import { useRouter, useRoute } from "vue-router";
	import NavTheme from '@/components/nav_theme.vue';
	import { debounce, throttle } from '@/hooks/debounce_throttle.js';

	const router = useRouter();
	const route = useRoute();
	const search_keyword = ref('');
	const match_keyword_list = ref(false);//搜索候选
	const count = ref(0);
	const searchInputRef = ref(null);//搜索框对象
	const stopWatchRouteQueryKeyword = ref(null);//监听路由查询参数keyword

	const $message = inject('$message');



	onMounted(() => {
		if (route.query.keyword) {
			search_keyword.value = route.query.keyword;
			stopWatchRouteQueryKeyword.value = watch(() => route.query.keyword, (newValue, oldValue) => {
				if (newValue) {//如有路由传参更新,那么重新赋值
					search_keyword.value = newValue;

				}

			},// 		{ immediate: true }
			);

		}


		//点击外部关闭匹配关键字列表
		window.addEventListener('click', clickCloseMatchKeywordListDown); // 监听全局点击事件
		window.addEventListener('resize', throttle(() => { resizeCloseMatchKeywordListDown() }, 300));//监听窗口缩放 加节流
		// stopWatch.value=null;
	})

	//接受父页面数据(目前有3个页面传值layout.vue、search.vue、article.vue)
	const props = defineProps({
		parentPageLogData: {
			type: String,
			default: "/logo.png",
		},
		parentPageArticleCount: {
			type: Number,
		},

		parentPageArticleListData: {
			type: Array,
		},

	});


	//使用计算属性接受父页面传输数据parentPageArticleCount 博文数量
	const article_count = computed(() => {
		// 对传入的数据进行处理
		return props.parentPageArticleCount;
	});

	//使用计算属性接受父页面传输数据parentPageArticleListData  所有博文数据
	const article_list = computed(() => {
		// 对传入的数据进行处理
		return props.parentPageArticleListData;
	});


	//接受来自父页面的方法（当父页面props传值异常，调用此方法获取数据）
	const ParentPageGetSearchKeywordMatchData = inject('getSearchKeywordMatchArticleListDataFunction');

	const data = reactive(
		{

			search_keyword_match_data: [],  //已匹配关键字数据
			search_keyword_match_count: 0,  //已匹配关键字个数
		}
	);


	//初始化关键字数据和关闭匹配关键字列表
	function matchKeywordDataInit() {
		match_keyword_list.value = false;//隐藏
		data.search_keyword_match_data = [];//已匹配关键字数据
		data.search_keyword_match_count = 0;//已匹配关键字个数
	}




	//input事件匹配关键字
	function handleInput() {
		debounce(() => {//防抖
			if (search_keyword.value == '') {
				// console.log('请输入内容...');
				matchKeywordDataInit();
			} else if (search_keyword.value.search(/^\s+$/) >= 0) {
				// 检测输入值全是空白的情况
				matchKeywordDataInit();
				search_keyword.value = '请输入有效内容...';

			} else {

				// 合法输入值的情况
				matchKeywordDataInit();
				//数据为空或者值小于1或者数组长度小于1，即数据异常重新请求接口获取新数据
				if (!article_count.value || article_count.value < 1 || !article_list.value || article_list.length < 1) {
					ParentPageGetSearchKeywordMatchData();

					// console.log('false_article_count:',article_count.value);
				}

				// 在标题、内容中查找
				searchKeywordMatching(search_keyword.value)
			}

		}, 1000);

	}



	//匹配搜索关键字
	function searchKeywordMatching(search_value) {
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

					let result_title_keyword_start = '<span style="color:var(--color-no-match-keyword);">' + result_title_array.slice(result_title_index - step, result_title_index) + '</span>';
					let result_title_keyword = '<span style="color: --var(--match-keyword)  !important; font-weight: 700;">' + result_title_array.slice(result_title_index, result_title_index + len) + '</span>';
					let result_title_keyword_end = '<span style="color:var(--color-no-match-keyword);">' + result_title_array.slice(result_title_index + len, result_title_index + len + step) + '</span>';

					result_article_title_match_data = result_title_keyword_start + result_title_keyword + result_title_keyword_end;
					// console.log('result_title_keyword_start:',result_title_keyword_start)
					// console.log('result_title_keyword:',result_title_keyword)
					// console.log('result_title_keyword_end:',result_title_keyword_end)
					// console.log('all:',result_title_keyword_start,result_title_keyword,result_title_keyword_end)

				} else {
					result_article_title_match_data = '<span style="overflow: hidden;color:var(--color-no-match-keyword);">' + article_list.value[i]['title'] + '</span>';;
				}

				if (article_content_index !== -1) {
					let result_article_content_index = article_content_index;
					let result_article_content_array = article_list.value[i]['article_content'];

					let result_article_content_keyword_start = '<span style="color:var(--color-no-match-keyword);">' + result_article_content_array.slice(result_article_content_index - step, result_article_content_index) + '</span>';
					let result_article_content_keyword = '<span style="color: --var(--match-keyword)  !important; font-weight: 700;">' + result_article_content_array.slice(result_article_content_index, result_article_content_index + len) + '</span>';
					let result_article_content_keyword_end = '<span style="color:var(--color-no-match-keyword);">' + result_article_content_array.slice(result_article_content_index + len, result_article_content_index + len + step) + '</span>';
					// console.log('result_article_content_keyword_start:',result_article_content_keyword_start)
					// // console.log('result_article_content_keyword:',result_article_content_keyword)
					// // console.log('result_article_content_keyword_end:',result_article_content_keyword_end)
					// console.log('all:',result_article_content_keyword_start,result_article_content_keyword,result_article_content_keyword_end)
					result_article_content_match_data = result_article_content_keyword_start + result_article_content_keyword + result_article_content_keyword_end;
				}

				match_count++;  //成功匹配计数加一

				match_data = {
					article_id: article_list.value[i]['article_id'],
					result_article_title_match_data: result_article_title_match_data,
					result_article_content_match_data: result_article_content_match_data
				};

				data.search_keyword_match_data.push(match_data); //push数组末尾添加
			}

		}

		data.search_keyword_match_count = match_count;
		if (data.search_keyword_match_count > 0) {
			match_keyword_list.value = true;
		} else {
			matchKeywordDataInit();
		}



	}



	//右侧搜索图标
	const show_right_search = ref(false);
	//点击显示移动端搜索框相关样式
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


		if (search_keyword.value == '') {
			// console.log('请输入内容...');
			matchKeywordDataInit();
		} else if (search_keyword.value.search(/^\s+$/) >= 0) {
			// 检测输入值全是空白的情况
			matchKeywordDataInit();
			search_keyword.value = '请输入有效内容...';
			// var itemDiv = tmpDiv.cloneNode(true);
			// itemDiv.innerText = '请输入有效内容...';
			// searchResults.appendChild(itemDiv);
		} else {


			let routeUrl = router.resolve({
				name: 'search',
				query: { keyword: search_keyword.value },
				key: new Date().getTime(),
			});
			window.open(routeUrl.href, '_blank');//打开新窗口搜索结果页



			matchKeywordDataInit();

		}
	}


	//跳转到博文页面
	function gotoViewArticle(article_id) {
		if (article_id) {

			// router.push({ name: 'article', query: { id: article_id }, key: new Date().getTime() });
			let routeUrl = router.resolve({ name: 'article', query: { id: article_id }, key: new Date().getTime() });
			//  console.log('routeUrl',routeUrl);
			window.open(routeUrl.href, '_blank');//打开新窗口


		} else {
			$message('非法请求','error')
		}

	}

	//搜索框容器对象
	const searchInputContainerRef = ref(null);
	//点击非搜索框容器区域时初始化关键字数据和关闭匹配关键字列表
	function clickCloseMatchKeywordListDown(e) {
		if (searchInputContainerRef.value && !searchInputContainerRef.value.contains(e.target)) {
			//初始化关键字数据和关闭匹配关键字列表
			matchKeywordDataInit();
		}
	}



	//搜索框失去焦点，初始化关键字数据和关闭匹配关键字列表
	function searchInputBlur() {
		//如果没有输入关键字，那么初始化关键字数据和关闭匹配关键字列表
		if (!search_keyword.value) {
			matchKeywordDataInit();
		}

	}


	//监听窗口缩放初始化关键字数据和关闭匹配关键字列表
	function resizeCloseMatchKeywordListDown() {
		const current_width = window.innerWidth;
		// console.log('current_width:',current_width)
		if (current_width) {
			//初始化关键字数据和关闭匹配关键字列表
			matchKeywordDataInit();
		}

		//如果宽度大于1000且移动端样式处于显示状态，那么隐藏移动端搜索框相关样式
		if (current_width > 1000 && show_right_search.value) {
			//隐藏移动端搜索框相关样式
			show_right_search.value = false;
		}
	}

	onUnmounted(() => {
		window.removeEventListener('click', clickCloseMatchKeywordListDown);// 移除全局点击事件监听
		window.removeEventListener('resize', resizeCloseMatchKeywordListDown);//移除监听窗口缩放关闭匹配关键字列表

		stopWatchRouteQueryKeyword.value = null; // 如果watch返回了一个停止监听的函数，调用它
		// stopWatch.value=null;
	})

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