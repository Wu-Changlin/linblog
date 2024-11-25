<template>
  <div class="container">
    <NavBar :parentPageLogData="article_page_log" :parentPageArticleCount="article_page_article_count"
      :parentPageArticleListData="article_page_article_list_data"></NavBar>


    <transition name="scale-down" mode="out-in">
      <!-- 骨架屏 开始-->
      <!-- <div v-if="is_loading" key="loading" class="waterfall-skeleton" ref="waterfallSkeletonContainerRef"> -->
      <div v-if="is_loading" key="loading" class="article-skeleton" ref="waterfallSkeletonContainerRef">

        <!-- <div style="background-color: rgba(0, 0, 0, 0.04);width: 100%;height:100%;display:flex; padding-top: 72px;"> -->

        <!-- 目录占位 -->
        <Skeleton bg="#e4e4e4" width="238px" height="100%" animated class="article_catalog_skeleton"
          style="display: flex;flex-direction: column;flex-shrink: 0;margin-left: 12px;" />
        <!-- 内容占位 -->
        <Skeleton bg="#e4e4e4" height="100%" animated style="flex: 1;margin: 0px 12px;" />


        <!-- </div> -->

      </div>

      <!-- 骨架屏 结束-->
      <!-- 渲染内容 开始-->
      <div v-else class="main">
        <!-- 目录组件 开始-->
        <ArticleCatalog :containerName="container_name" :style="{ display: show_article_catalog  ?'block':'none'}">
        </ArticleCatalog>
        <!-- 目录组件 结束-->
        <div class="main-content with-side-bar">
          <!-- 博文内容 开始-->

          <div class="article-page">
            <div class="article-title">{{ data.title }}</div>
            <div class="article-metadata">
              <div class="article-metadata-item">
                <svg-icon icon-class="author" /><span>作者 {{ data.author_name }}</span>
              </div>
              <div class="article-metadata-item">
                <svg-icon icon-class="category" /><span>前端 {{ data.menu_title }}</span>
              </div>

              <div class="article-metadata-item">
                <svg-icon icon-class="tag" /><span>{{ data.tag_ids_name }} </span>
              </div>

              <div class="article-metadata-item">
                <svg-icon icon-class="created_at" /><span>{{ data.created_time }}</span>

              </div>

              <div class="article-metadata-item">
                <svg-icon icon-class="visits" /><span>{{ data.visits}} </span>

              </div>

              <!-- <span>字数</span>
                            <span>所需阅读时间</span> -->
            </div>
            <div class="article-container">

              <div class="typo article-content markdown-body" v-html="data.article_content" v-highlight></div>


            </div>
          </div>
          <!-- 博文内容 结束-->



          <div style="margin: 20px auto;width: fit-content;">----- <span
              style="color: white;background-color: black;padding: 0 5px;font-size: .7rem;">END</span> -----</div>

          <!-- 本文相关信息 开始-->
          <p class="notice" style="text-indent:0em">
            博客站点：<a :href="data.website_url" rel="author"><span class="brand">{{data.website_name }}</span></a><br>
            本文链接：<a :href="data.article_url">{{ data.article_url }}</a><br>
            版权声明：本文章采用<a rel="license" :href="data.license_url" target="_blank"><i>&nbsp;<strong>{{
                  data.license_description }} &nbsp;</strong></i></a>。
          </p>
          <!-- 本文相关信息 开始-->
          <!-- 上下篇链接 开始-->
          <div class="post-pager">
            <div class="prev">
              <a :href="data.prev_article_url">
                <h2>{{ data.prev_article_title }}</h2>
              </a>
              <!-- 如果有摘要就输出摘要，没有摘要输出一段文字 -->
              <p>{{ data.prev_article_abstract }}</p>
            </div>
            <div class="next">
              <a :href="data.next_article_url">
                <h2>{{ data.next_article_title }}</h2>
              </a>
              <p>{{ data.next_article_abstract }}</p>
            </div>
          </div>
          <!-- 上下篇链接 结束-->

        </div>

        <!--右侧浮动按钮组件（添加目录图标插槽） 开始-->

        <FloatingBtnSets :parentPageMenuData="article_page_menu_list_data"
          :style="{ right: article_catalog_right + 'px' }">
          <div class="article-catalog-slot" @click="showArticleCatalog"
            :style="{ visibility: show_article_catalog_icon ?'visible':'hidden'}">
            <div class="btn-wrapper">
              <div class="cont">
                <svg-icon icon-class="catalog" />
              </div>
            </div>


            <div class="tip-container">
              <span class="tip-text">目录</span>
            </div>

          </div>
          <!-- 右侧浮动按钮组件 结束-->
        </FloatingBtnSets>

        <!-- <Footer></Footer> -->

      </div>
      <!-- 渲染内容 结束-->


    </transition>

  </div>


</template>
<script setup>
  // import Footer from "@/components/footer.vue";
  import { ref, reactive, onMounted, onUnmounted, nextTick, watch, onUpdated, provide, inject } from "vue";
  import { useRoute, useRouter } from 'vue-router';
  import Skeleton from '@/components/skeleton.vue';
  import Prism from "prismjs";
  import NavBar from "@/components/nav_bar.vue";
  import SideBar from "@/components/side_bar.vue";
  import FloatingBtnSets from "@/components/floating_btn_sets.vue";
  import ArticleCatalog from "@/components/article_catalog.vue";
  import '/public/github-markdown.css';//使用github-markdown样式渲染HTML内容
  import articleModuleApi from "@/api/frontend/article.js";//api接口
  import layoutModuleApi from "@/api/frontend/layout.js";//api接口
	import useMetaInfo from '@/hooks/useMetaInfo.js';//设置页面meta元数据，标题、关键词、描述 


  const $message = inject('$message');

  const route = useRoute();//用于获取当前路由的信息。返回的是当前路由的路由对象，包含了当前路由的各种信息
  const router = useRouter();


  const is_loading = ref(true);
  const current_route_query = ref(null);



  const data = reactive({
    menu_title: "栏目",
    visits: 0,
    word_count: 0,
    read_time: "00:00",
    title: "标题",
    tag_ids_name: "标签",
    author_name: "原创",
    created_time: "发布时间",
    article_content: "内容",
    article_url: "本文链接",
    website_url: "网站链接",
    website_name: "网站名称",
    prev_article_id: "上一篇博文id",
    prev_article_title: "上一篇博文标题",
    prev_article_abstract: "上一篇博文摘要",
    prev_article_url: "上一篇博文链接",
    next_article_id: "下一篇博文id",
    next_article_title: "下一篇博文标题",
    next_article_abstract: "下一篇博文摘要",
    next_article_url: "下一篇博文链接",
    license_url: "版权url",
    license_description: "版权描述",

  })

/* 修改当前页面meta元数据，标题、关键词、描述  开始  */

// meta元数据，标题、关键词、描述 
const current_meta_title = ref('');
const current_meta_keywords = ref('');
const current_meta_description = ref('');

// 调用封装函数使用@unhead/vue的useHead修改页面meta元数据
useMetaInfo(current_meta_title,current_meta_keywords,current_meta_description);

/* 修改当前页面meta元数据，标题、关键词、描述  结束  */

  //获取博文详情数据
  function getArticlePageData() {
    articleModuleApi.getArticlePageData({})
      .then(response => {

        data.menu_title = response.menu_title;
        data.tag_ids_name = response.tag_ids_name;
        data.visits = response.visits;
        data.word_count = response.word_count;
        data.read_time = response.read_time;
        data.title = response.title;
        data.author_name = response.author_name;
        data.created_time = response.created_time;
        data.article_content = response.article_content;

        data.article_url = response.article_url;
        data.website_url = response.website_url;
        data.website_name = response.website_name;
        data.prev_article_id = response.prev_article_id;
        data.prev_article_title = response.prev_article_title;
        data.prev_article_abstract = response.prev_article_abstract;
        data.prev_article_url = response.prev_article_url;
        data.next_article_id = response.next_article_id;
        data.next_article_title = response.next_article_title;
        data.next_article_abstract = response.next_article_abstract;
        data.next_article_url = response.next_article_url;
        data.license_url = response.license_url;
        data.license_description = response.license_description;


         //页面 meta 元数据
        current_meta_title.value = response.meta_title;
        current_meta_keywords.value = response.meta_keywords;
        current_meta_description.value = response.meta_description;
        //使用来自layout页面（公共）提供修改当前页面meta元数据，标题、关键词、描述的方法的方法修改页面meta 数据。
        // updatePageMetaInfoFunction(current_page_meta_data);


        //获取log和菜单导航栏（外加搜索匹配关键字数据）   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
        getLayoutLogAndMenuListData()

        is_loading.value = false;//取消骨架屏

      })
      .catch(error => {
                // console.log('请求接口错误-提示：', error);
                // // 处理错误
                // let message_str = error.message;
                // if (error.data) {
                //     message_str = error.data.data.message;
                // }

                // $message(message_str, 'error');
            });
  
  }


 
  onMounted(() => {
    // getArticleDetail
    //两重校验路由查询参数，路由表加页面;否: 导航到404页面。 
    if (current_route_query) {
      current_route_query.value = route.query;
    } else {
      router.push({ path: '/404', });
    }

    getArticlePageData();
    mediaQuery();//初始化（防止刷新失效）
    //     console.log('挂载完毕');
    window.addEventListener('resize', mediaQuery);  //监听窗口大小变化	

  })



  const article_page_article_count = ref(0);
  const article_page_article_list_data = ref();
  //获取搜索关键字匹配所用数据源  提供一个获取数据的方法
  const getSearchKeywordMatchArticleListDataFunction = () => {
    layoutModuleApi.getSearchKeywordMatchArticleListDataFunction({})
      .then(response => {
        // setTimeout(() => {
        article_page_article_count.value = response.article_count; // 博文数量
        article_page_article_list_data.value = response.article_list; // 博文列表
        // }, 3000); // 假设加载时间是3秒


      })
      .catch(error => {
                // console.log('请求接口错误-提示：', error);
                // // 处理错误
                // let message_str = error.message;
                // if (error.data) {
                //     message_str = error.data.data.message;
                // }

                // $message(message_str, 'error');
            });
  }


  // 使用 provide 向下传递方法

  provide('getSearchKeywordMatchArticleListDataFunction', getSearchKeywordMatchArticleListDataFunction);


  const article_page_log = ref();
  const article_page_menu_list_data = ref();

  //获取log和菜单导航栏   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
  function getLayoutLogAndMenuListData() {
    // 如果你想使用axios来模拟请求，可以这样做
    layoutModuleApi.getLayoutLogAndMenuListData({})
      .then(response => {
        // setTimeout(() => {
        article_page_log.value = response.log_data; // log
        article_page_menu_list_data.value = response.menu_data; // 菜单数据
        // }, 3000); // 假设加载时间是3秒

        // setTimeout(() => {
        //在组件挂载后调用方法获取数据
        getSearchKeywordMatchArticleListDataFunction();
        // }, 3000); // 延迟3秒

      })
      .catch(error => {
                // console.log('请求接口错误-提示：', error);
                // // 处理错误
                // let message_str = error.message;
                // if (error.data) {
                //     message_str = error.data.data.message;
                // }

                // $message(message_str, 'error');
            });

  }




  // 使用指令高亮代码块
  const vHighlight = {
    mounted(el) {
      let blocks = el.querySelectorAll('pre code');
      //添加line-numbers类名到自己的项目，在这里我添加到了v-html要解析的那个标签上，
      //因为后台返回的编辑数据都是在该标签内渲染，所以该标签属于pre标签的祖先元素，
      //你也可以将line-numbers类名添加到该div的祖先父级元素中，又或者可以添加到body上，
      //但建议添加到这个v-html要渲染的签上，因为只有该标签内的数据是要被渲染解析的。
      //添加class用于显示行号，全局代码高亮。

      blocks.forEach((block) => {
        //取语法类名
        const language = block.className.split('-')[1];

        //如果没有支持某语法高亮，那么替换成language-html
        if (!Prism.languages[language]) {
          // 使用正则表达式检查class类字符串是否包含language类名
          const languageRegex = new RegExp("language");
          // 如果有language类名，那么移除原有后添加language-html类
          if (languageRegex.exec(block.className)) {
            block.classList.remove(block.className);
            block.classList.add('language-html')
          } else {//元素中添加一个类名是language-html
            block.classList.add('language-html')
          }

        }
        //添加行号类
        block.classList.add('line-numbers');


        // 高亮代码块
        Prism.highlightElement(block);
      })

    }
  }



  const container_name = ref('.article-content');


  ////目录显示隐藏开关
  const show_article_catalog = ref(false);
  function showArticleCatalog() {
    if (show_article_catalog.value == false) {//目录隐藏，需要打开
      show_article_catalog.value = true;
      article_catalog_right.value = 300;		 //目录右边距
      // console.log('show_article_catalog.value=true:',show_article_catalog.value)
    } else {//目录显示，需要隐藏
      show_article_catalog.value = false;
      article_catalog_right.value = 5;		 //目录右边距
      // console.log('show_article_catalog.value=flase:',show_article_catalog.value)

    }
    // show_article_catalog.value=!show_article_catalog.value;

  }


  const article_catalog_right = ref(5);
  const show_article_catalog_icon = ref(false);
  //监听窗口大小变化	
  function mediaQuery() {
    const media_query = window.matchMedia('(max-width: 959px)');// 创建一个媒体查询(移动端)实例
    if (media_query.matches) { // 当前窗口大小满足移动端右侧遮罩目录（使用移动端样式）条件
      // 执行相关操作

      // article_catalog_right.value=300;	//目录右边距
      show_article_catalog.value = false;		//隐藏移动端样式
      show_article_catalog_icon.value = true;//显示目录图标
      // console.log('article小于959',show_article_catalog_icon.value);

    } else { // 当前窗口大小不满足移动端右侧遮罩目录（使用PC端样式）条件
      // 执行相关操作

      show_article_catalog.value = true;		 //PC端样式
      article_catalog_right.value = 5;		 //目录右边距
      show_article_catalog_icon.value = false;//隐藏目录图标
      // console.log('article大于959');
    }
  }


  onUnmounted(() => {
    window.removeEventListener('resize', mediaQuery);
  })//离开页面时移除监听窗口大小变化	

  onUpdated(() => {
    Prism.highlightAll(); //修改内容后重新渲染
  });

</script>

<style scoped>
  * {
    /* 适用于 Internet Explorer 和旧版 Edge */
    -ms-overflow-style: none;
    /* 适用于 Firefox */
    scrollbar-width: none;
    /* WebKit 内核浏览器（如 Chrome 和 Safari）中的滚动条*/
    -webkit-scrollbar: none;
  }


  /* 高亮插件 复制按钮样式*/
  :deep(div.code-toolbar > .toolbar) {
    opacity: 1;
  }

  :deep(.toolbar .toolbar-item span,
    .toolbar .toolbar-item button) {
    border-radius: 0 !important;
    margin: 0 6px;
  }

  :deep(.copy-to-clipboard-button:hover) {
    cursor: pointer;
  }


  .container {
    padding: 0;
    max-width: 1728px;
    background-color: var(--bg);
    /* fff*/
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


  .article-page {
    flex: 1;
    /* 禁止容器x轴方向滚动 */
    overflow-x: hidden;
    padding: 72px 12px 0 12px;
    width: 100%;
    margin: 0 auto;
    /* overflow: auto; */
    /* height: 100vh; */
  }

  .article-container {
    /* 禁止容器x轴方向滚动 */
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    /* padding: 0 12px;
      padding-top: 72px;
      width: 100%; */

  }

  /* .article-content{
		width: 100%;
		/* max-width: 1280px; */
  /* 允许空白符号，但不保留 */
  /* white-space: normal;  */
  /* 在长单词或URL地址内部进行换行 */
  /* overflow-wrap: break-word;  */
  /* 隐藏溢出容器的内容 */
  /* overflow: hidden;  */
  /* }   */



  .article-content,
  .markdown-body {
    /* font-size: 14px;
    font-family: Source Sans Pro, Helvetica Neue, Arial, sans-serif !important;
    -webkit-font-smoothing: antialiased;
    line-height: 1.6rem;
    letter-spacing: 0;
    margin: 0; */
    width: 100%;
    max-width: 1280px;
    overflow: hidden;
  }



  .article-title {
    display: flex;
    justify-content: center;
    font-size: 32px;
    margin: 20px 0px;
    text-align: center;
  }

  .article-metadata {
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px dotted #999;
    margin-bottom: 10px;
    flex-direction: row;
    flex-wrap: wrap;

    .article-metadata-item {
      display: flex;
      margin-right: 10px;
      justify-content: center;
      align-items: center;

    }

  }



  .post-pager {
    margin-top: 2rem;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    color: rgba(0, 0, 0, .86);
    border-radius: 4px
  }

  .theme-dark .post-pager {
    color: #b0b0b0
  }

  .post-pager>div {
    padding-top: 2.5rem;
    width: calc(50% - 1rem);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    text-align: center;
    position: relative
  }

  .post-pager>div a {
    display: block
  }

  .post-pager>div h2 {
    margin: 0;
    line-height: 1.3;
    font-size: 1.25rem
  }

  .post-pager>div p {
    margin: 0;
    margin-top: .3rem;
    font-size: 1rem;
    color: rgba(0, 0, 0, .42);
    line-height: 1.4
  }

  .theme-dark .post-pager>div p {
    color: #aaa
  }

  .post-pager>div::before {
    position: absolute;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    top: .4rem;
    font-size: 14px;
    padding: .2em .5em;
    color: rgba(0, 0, 0, .2);
    border: 1px solid rgba(0, 0, 0, .1);
    border-radius: 4px
  }

  .theme-dark .post-pager>div::before {
    color: rgba(255, 255, 255, .2);
    border-color: rgba(255, 255, 255, .15)
  }

  .post-pager>div.prev::before {
    content: "上一篇"
  }

  .post-pager>div.prev::after {
    content: "";
    width: 1px;
    height: calc(100% - 1rem);
    background: #ddd;
    position: absolute;
    right: -1rem;
    top: .5rem
  }

  .theme-dark .post-pager>div.prev::after {
    background: rgba(255, 255, 255, .1)
  }

  .post-pager>div.next::before {
    content: "下一篇"
  }

  @media screen and (max-width: 767.5px) {
    .post-pager {
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -ms-flex-direction: column;
      flex-direction: column
    }

    .post-pager>div {
      width: 100%;
      text-align: left;
      -webkit-box-align: start;
      -ms-flex-align: start;
      align-items: flex-start
    }

    .post-pager>div::before {
      left: 0;
      -webkit-transform: translateX(0);
      transform: translateX(0)
    }

    .post-pager>div::after {
      display: none
    }

    .post-pager>div:first-child {
      padding-bottom: .8rem;
      margin-bottom: .8rem;
      border-bottom: 1px solid #ddd
    }

    .theme-dark .post-pager>div:first-child {
      border-color: rgba(255, 255, 255, .1)
    }
  }

  /* 骨架屏 */
  .article-skeleton {
    width: 100%;
    display: flex;
    height: 1000px;

  }


  .article_catalog_skeleton {
    @media screen and (max-width: 695px) {
      display: none !important;
      /* visibility: hidden; */

    }

    @media screen and (min-width: 696px) and (max-width: 959px) {
      display: none !important;
      /* visibility: hidden; */

    }
  }

  /* 骨架屏缩放动画 */
  .scale-down-enter-active,
  .scale-down-leave-active {
    transition: all 0.8s ease;
  }

  .scale-down-enter-from,
  .scale-down-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }
</style>