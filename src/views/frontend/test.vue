<template>
  <div class="container">
    <NavBar :parentPageLogData="article_page_log" :parentPageArticleCount="article_page_article_count"
      :parentPageArticleListData="article_page_article_list_data"></NavBar>


    <transition name="scale-down" mode="out-in">
      <!-- 骨架屏 开始-->
      <!-- <div v-if="is_loading" key="loading" class="waterfall-skeleton" ref="waterfallSkeletonContainerRef"> -->
      <div v-if="is_loading" key="loading" class="article-skeleton" ref="waterfallSkeletonContainerRef">

        <div
          style="background-color: rgba(0, 0, 0, 0.04);width: 100%;max-width:1260px;height:100%;display:flex; padding-top: 72px;">

          <!-- 图片占位 -->
          <Skeleton bg="#e4e4e4" width="238px" height="100%" animated
            style="display: flex;flex-direction: column;flex-shrink: 0;max-height: 100%;margin-left: 12px;" />
          <Skeleton bg="#e4e4e4" height="100%" animated style="flex: 1;max-height: 100%;margin: 0px 12px;" />


        </div>

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

              <div class="typo article-content" v-html="data.article_content" v-highlight></div>


            </div>
          </div>
          <!-- 博文内容 结束-->


          <!-- 上下篇链接 开始-->
          <div style="margin: 20px auto;width: fit-content;">----- <span
              style="color: white;background-color: black;padding: 0 5px;font-size: .7rem;">END</span> -----</div>


          <p class="notice" style="text-indent:0em">
            博客站点：<a href="https://blog.wuchanglin.com/author/1/" rel="author" class="pjax"><span
                class="brand">LinBlog</span></a><br>
            本文链接：<a href="https://blog.wuchanglin.com/archives/2038/"
              class="pjax">https://blog.wuchanglin.com/archives/2038/</a><br>
            版权声明：本文章采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"><i>&nbsp;<strong>知识共享署名 - 非商业性使用 - 相同方式共享 4.0 国际许可协议&nbsp;</strong></i></a>。
          </p>


          <div class="post-pager">
            <div class="prev">
              <a href="https://blog.wuchanglin.com/archives/2037/" class="pjax">
                <h2>2024博客搭建一</h2>
              </a>
              <!-- 如果有摘要就输出摘要，没有摘要输出一段文字 -->
              <p>环境搭建</p>
            </div>
            <div class="next">
              <a href="https://blog.wuchanglin.com/archives/2039/" class="pjax">
                <h2>2024博客搭建二</h2>
              </a>
              <p>vscode插件</p>
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
  import { ref, reactive, onMounted, onUnmounted, nextTick, watch, onUpdated, provide, getCurrentInstance } from "vue";
  import { useRoute, useRouter } from 'vue-router';
  import Skeleton from '@/components/skeleton.vue';
  import Prism from "prismjs";
  import NavBar from "@/components/nav_bar.vue";
  import SideBar from "@/components/side_bar.vue";
  import FloatingBtnSets from "@/components/floating_btn_sets.vue";
  import ArticleCatalog from "@/components/article_catalog.vue";
  import '../../../public/typo.css';
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
    article_content: '内容'
  })


  onMounted(() => {
    // getArticleDetail
    //两重校验路由查询参数，路由表加页面;否: 导航到404页面。 
    if (current_route_query) {
      current_route_query.value = route.query;
    } else {
      router.push({ path: '/404', });
    }

    $getData('/data/frontend/article_detail.json')
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


        //获取log和菜单导航栏（外加搜索匹配关键字数据）   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
        getLayoutLogOrMenuListData()

        is_loading.value = false;//取消骨架屏


        // setTimeout(() => {
        // index_tag_data.value = response.tag_data; // 数据加载完毕，关闭骨架屏
        // index_article_list_data.value = response.article_list_data; // 数据加载完毕，关闭骨架屏
        // flag.value=true;
        // is_loading.value=false;
        // console.log('response:',response);
        // }, 3000); // 假设加载时间是3秒


      })
      .catch(error => {

        $message('请求未找到', 'error');
      });




    mediaQuery();//初始化（防止刷新失效）
    //     console.log('挂载完毕');
    window.addEventListener('resize', mediaQuery);  //监听窗口大小变化	

  })



  const article_page_article_count = ref(0);
  const article_page_article_list_data = ref();
  //获取搜索关键字匹配所用数据源  提供一个获取数据的方法
  const getSearchKeywordMatchArticleListDataFunction = () => {
    $getData('/data/frontend/all_article.json')
      .then(response => {
        // setTimeout(() => {
        article_page_article_count.value = response.article_count; // 博文数量
        article_page_article_list_data.value = response.article_list; // 博文列表
        // }, 3000); // 假设加载时间是3秒


      })
      .catch(error => {

        $message('请求未找到', 'error');
      });
  }


  // 使用 provide 向下传递方法

  provide('getSearchKeywordMatchArticleListDataFunction', getSearchKeywordMatchArticleListDataFunction);


  const article_page_log = ref();
  const article_page_menu_list_data = ref();

  //获取log和菜单导航栏   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
  function getLayoutLogOrMenuListData() {
    // 如果你想使用axios来模拟请求，可以这样做
    $getData('/data/frontend/layout.json')
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

        $message('请求未找到', 'error');
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
      const pre = el.querySelectorAll('pre');
      pre.forEach((block) => {
        // block.classList.add('line-numbers');


        // 使用正则表达式检查class类字符串是否包含language类名
        const languageRegex = /language="([^"]+)"/;
        // if (!languageRegex.test(block.className)) {
        //     // 如果没有language类名，那么在元素中添加一个类名是language-html
        //     block.classList.add('language-html')
        // }
        //  Prism.highlightAll()// 全局代码高亮
      })

      blocks.forEach((block) => {


        if (!block.className) {
          // 如果没有设置language类，则设置默认样式

          //   block.classList.add('language-html')
        }
        // 

        const language = block.className.split('-')[1];
        const text = block.innerHTML;
        // console.log('innerHTML:',text ) 

        // 高亮代码块
        if (!Prism.languages[language]) {

          // block.classList.add('language-jsx');
           console.log(`!Prism.languages[${block.className}]:`,block.className);
        } else {

          console.log(`Prism.languages[${block.className}]:`, Prism.languages[language]);

        }

        block.classList.add('line-numbers');

        //  console.log(Prism.languages['vue']);

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
    -ms-overflow-style: none;
    /* 适用于 Internet Explorer 和旧版 Edge */
    scrollbar-width: none;
    /* 适用于 Firefox */
    -webkit-scrollbar: none;
    /* WebKit 内核浏览器（如 Chrome 和 Safari）中的滚动条*/
    /* 圆点  */
    /* list-style-type: circle; */
  }

  /* 使用阿拉伯数字 */
  /*
:deep(ol) {
    list-style-type: decimal; 
} */

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
    overflow-x: hidden;
    /* 禁止容器x轴方向滚动 */
    padding-top: 72px;
    width: 100%;
    margin: 0 auto;
    padding-left: 12px;
    padding-right: 12px;
    /* overflow: auto; */
  }

  .article-container {
    overflow-x: hidden;
    /* 禁止容器x轴方向滚动 */
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



  .article-content {
    font-size: 14px;
    font-family: Source Sans Pro, Helvetica Neue, Arial, sans-serif !important;
    -webkit-font-smoothing: antialiased;
    line-height: 1.6rem;
    letter-spacing: 0;
    margin: 0;
    overflow-x: hidden;
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

  .article-skeleton {
    height: 1000px;

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



  /*

:deep(.article-content p) {
  line-height: 1.6rem;
  word-spacing: .05rem;
}

:deep(.article-content ol li) {
  text-indent: 0.5rem;
}

:deep(.article-content  ul:first-child),
:deep(.article-content  ol:first-child) {
  margin-top: 30px;
}

:deep(.article-content img) {
  width: 100%;
}

:deep(.article-content a) {
  color: #42b983;
  font-weight: 600;
  padding: 0 2px;
  text-decoration: none;
}

:deep(.article-content h1),
:deep(.article-content h2),
:deep(.article-content h3),
:deep(.article-content h4),
:deep(.article-content h5),
:deep(.article-content h6){
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-weight: bold;
  line-height: 1.4;
  cursor: text;
}

:deep(.article-content h1:hover a.anchor),
:deep(.article-content h2:hover a.anchor),
:deep(.article-content h3:hover a.anchor),
:deep(.article-content h4:hover a.anchor),
:deep(.article-content h5:hover a.anchor),
:deep(.article-content h6:hover a.anchor) {
  text-decoration: none;
}

:deep(.article-content h1 tt),
:deep(.article-content h1 code) {
  font-size: inherit !important;
}

:deep(.article-content h2 tt),
:deep(.article-content h2 code) {
  font-size: inherit !important;
}

:deep(.article-content h3 tt),
:deep(.article-content h3 code) {
  font-size: inherit !important;
}

:deep(.article-content h4 tt),
:deep(.article-content h4 code) {
  font-size: inherit !important;
}

:deep(.article-content h5 tt),
:deep(.article-content h5 code) {
  font-size: inherit !important;
}

:deep(.article-content h6 tt),
:deep(.article-content h6 code) {
  font-size: inherit !important;
}

:deep(.article-content h2 a),
:deep(.article-content h3 a) {
  color: #34495e;
}

:deep(.article-content h1) {
  padding-bottom: .4rem;
  font-size: 2.2rem;
  line-height: 1.3;
}

:deep(.article-content h2) {
  font-size: 1.65rem;
  line-height: 1.225;
  margin-top: 35px;
  padding-bottom: 0.5em;

}

:deep(.article-content h3) {
  font-size: 1.4rem;
  line-height: 1.43;
  margin: 20px 0 7px;
}

:deep(.article-content h4) {
  font-size: 1.2rem;
}

:deep(.article-content h5) {
  font-size: 1rem;
}

:deep(.article-content h6) {
  font-size: 1rem;

}

:deep(.article-content p),
:deep(.article-content blockquote),
:deep(.article-content ul),
:deep(.article-content ol),
:deep(.article-content dl),
:deep(.article-content table) {
  margin: 0.8em 0;
}

:deep(.article-content li > ol),
:deep(.article-content li > ul) {
  margin: 0 0;
}

:deep(.article-content hr) {
  height: 2px;
  padding: 0;
  margin: 16px 0;
  background-color: #e7e7e7;
  border: 0 none;
  overflow: hidden;
  box-sizing: content-box;
}

:deep(.article-content li p.first) {
  display: inline-block;
}

:deep(.article-content ul),
:deep(.article-content ol) {
  padding-left: 30px;
}

:deep(.article-content ul:first-child),
:deep(.article-content ol:first-child) {
  margin-top: 0;
}

:deep(.article-content ul:last-child),
:deep(.article-content ol:last-child) {
  margin-bottom: 0;
}

:deep(.article-content blockquote) {
  border-left: 4px solid #42b983;
  padding: 10px 15px;
  color: #777;
  background-color: rgba(66, 185, 131, .1);
}

:deep(.article-content table) {
  padding: 0;
  word-break: initial;
}

:deep(.article-content table tr) {
  border-top: 1px solid #dfe2e5;
  margin: 0;
  padding: 0;
}

:deep(.article-content table tr:nth-child(2n)),
:deep(.article-content thead) {
  background-color: #fafafa;
}

:deep(.article-content table tr th) {
  font-weight: bold;
  border: 1px solid #dfe2e5;
  border-bottom: 0;
  text-align: left;
  margin: 0;
  padding: 6px 13px;
}

:deep(.article-content table tr td) {
  border: 1px solid #dfe2e5;
  text-align: center;
  margin: 0;
  padding: 6px 13px;
}

:deep(.article-content table tr th:first-child),
:deep(.article-content table tr td:first-child) {
  margin-top: 0;
}

:deep(.article-content table tr th:last-child),
:deep(.article-content table tr td:last-child) {
  margin-bottom: 0;
}

:deep(.article-content strong) {
  padding: 0 1px;
}

:deep(.article-content em) {
  padding: 0 5px 0 2px;
}

:deep(.article-content table thead th) {
  background-color: #f2f2f2;
}

:deep(.article-content .CodeMirror-gutters) {
  border-right: none;
}

:deep(.article-content .md-fences) {
  border: 1px solid #F4F4F4;
  -webkit-font-smoothing: initial;
  margin: 0.8rem 0 !important;
  padding: 0.3rem 0 !important;
  line-height: 1.43rem;
  background-color: #F8F8F8 !important;
  border-radius: 2px;
  font-family: Roboto Mono, Source Sans Pro, Monaco, courier, monospace !important;
  font-size: 0.85rem;
  word-wrap: normal;
}

:deep(.article-content del) {
  padding: 1px 2px;
}

:deep(.article-content code, tt) {
  border-radius: 2px;
  font-family: Roboto Mono, Source Sans Pro, Monaco, courier, monospace !important;
  font-size: 0.92rem;
  color:rgb(255, 199, 7);
  background: var(--color-active-background);
}




:deep(.article-content  pre  code ) {
  color: #42b983;
  background-color:rgba(0, 0, 0, 0);
  
}





 /* :deep(.article-content pre) {
   padding: 1rem;
  font-size: 85%;
  line-height: 1.25;
  background-color: #f7f7f7;
  border: 0;
  border-radius: 3px;
  color: #777777;
  margin-top: 0 !important; 
} */
</style>