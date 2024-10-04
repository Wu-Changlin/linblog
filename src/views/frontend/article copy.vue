<template>
	<div class="container">
		<NavBar></NavBar>


        <transition name="scale-down" mode="out-in">
            <!-- 骨架屏 开始-->
                <!-- <div v-if="is_loading" key="loading" class="waterfall-skeleton" ref="waterfallSkeletonContainerRef"> -->
                  <div v-if="is_loading" key="loading" class="article-skeleton" ref="waterfallSkeletonContainerRef">
                  
                  <div
                  style="background-color: rgba(0, 0, 0, 0.04);width: 100%;max-width:1260px;height:100%;display:flex; padding-top: 72px;">
                  
                  <!-- 图片占位 -->
                  <Skeleton bg="#e4e4e4" width="238px" height="100%" animated  style="display: flex;flex-direction: column;flex-shrink: 0;max-height: 100%;margin-left: 12px;"/>
                  <Skeleton bg="#e4e4e4" height="100%" animated  style="flex: 1;max-height: 100%;margin: 0px 12px;"/>
                 
            
                  </div>
                  
                </div>
            
            <!-- 骨架屏 结束-->
             <!-- 渲染内容 开始-->
             <div v-else class="main">
			
                <ArticleCatalog :container="container_name" :style="{ display: show_article_catalog  ?'block':'none'}"></ArticleCatalog>
                
                <div class="main-content with-side-bar">
                    <!-- 博文内容 开始-->
    
                    <div class="article-page">
                        <div class="article-title">{{  data.title }}</div>
                        <div class="article-metadata"> 
                            <div class="article-metadata-item">
                                <svg-icon icon-class="author"/><span>作者 {{ data.author_name }}</span>
                            </div>
                            <div class="article-metadata-item">
                                <svg-icon icon-class="category"/><span>前端 {{ data.menu_title }}</span>
                            </div>
    
                            <div class="article-metadata-item">
                                <svg-icon icon-class="tag"/><span>{{ data.tag_ids_name }} </span>
                            </div>
                                
                            <div class="article-metadata-item">
                                <svg-icon icon-class="created_at"/><span>{{ data.created_time }}</span>
    
                            </div>
    
                            <div class="article-metadata-item">
                                <svg-icon icon-class="visits"/><span>{{ data.visits}} </span>
    
                            </div>
                            
                            <!-- <span>字数</span>
                            <span>所需阅读时间</span> -->
                        </div>
                        <div class="article-container">
                            <div v-if="valueHtml"  v-highlight class="article-content" v-html="data.article_content"></div>
    
                        </div>
                    </div>
                    <!-- 博文内容 结束-->
                
    
                    <!-- 上下篇链接 开始-->
                    <div style="margin: 20px auto;width: fit-content;">----- <span style="color: white;background-color: black;padding: 0 5px;font-size: .7rem;">END</span> -----</div>
    
    
                    <p class="notice" style="text-indent:0em">
                        博客站点：<a href="https://blog.wuchanglin.com/author/1/" rel="author" class="pjax"><span class="brand">LinBlog</span></a><br>
                        本文链接：<a href="https://blog.wuchanglin.com/archives/2038/" class="pjax">https://blog.wuchanglin.com/archives/2038/</a><br>
                        版权声明：本文章采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank"><i>&nbsp;<strong>知识共享署名 - 非商业性使用 - 相同方式共享 4.0 国际许可协议&nbsp;</strong></i></a>。
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
    
    
    
    <!-- 目录组件 开始-->
                <FloatingBtnSets  :style="{ right: article_ccatalog_right + 'px' }">
                    <div class="article-catalog-slot" @click="showArticleCatalog" :style="{ visibility: show_article_catalog_icon ?'visible':'hidden'}"> 
                        <div class="btn-wrapper">
                          <div class="cont">
                            <svg-icon  icon-class="catalog" />
                            </div>
                        </div>
                    
                    
                        <div class="tip-container">
                          <span  class="tip-text">目录</span>
                        </div>
                    
                    </div>
                    
                </FloatingBtnSets>
                <!-- 目录组件 结束-->
                <!-- <Footer></Footer> -->
                
            </div>
            <!-- 渲染内容 结束-->
                
            
              </transition>
        

		
		
		
	</div>
	

</template>

<script setup>
import NavBar from "@/components/nav_bar.vue";
import SideBar from "@/components/side_bar.vue";
import FloatingBtnSets from "@/components/floating_btn_sets.vue";
import ArticleCatalog from "@/components/article_catalog.vue";
// import Footer from "@/components/footer.vue";
import {ref,reactive,onMounted,onUnmounted} from "vue";
import { useRoute, useRouter } from 'vue-router';
import Skeleton from '@/components/skeleton.vue';
const route = useRoute();//用于获取当前路由的信息。返回的是当前路由的路由对象，包含了当前路由的各种信息
const router=useRouter();

const is_loading=ref(true);
const current_route_query=ref(null); 


const data=reactive({
                menu_title:"栏目",
                visits: 0,
                word_count: 0,
                read_time: "00:00",
                title: "标题",
                tag_ids_name:"标签",
                author_name: "原创",
                created_time:"发布时间",
                article_content: '内容'
	// list:"```php\r\n\r\n        $next = Article::select(\'id\', \'title\', \'slug\')\r\n            ->orderBy(\'created_at\', \'asc\')\r\n            ->where(\'id\', \'>\', $article->id)\r\n            ->limit(1)\r\n            ->first();\r\n\r\n        $commentFlatTree = Comment::where(\'article_id\', $article->id)\r\n            ->with(\'socialiteUser\', \'socialiteUser.socialiteClient\', \'parentComment\', \'parentComment.socialiteUser\')\r\n            ->when(Str::isTrue(config(\'bjyblog.comment_audit\')), function ($query) {\r\n                return $query->where(\'is_audited\', 1);\r\n            })\r\n            ->withDepth()\r\n            ->get()\r\n            ->toFlatTree();\r\n```\r\n\r\n\r\n```bash\r\n $commentFlatTree = Comment::where(\'article_id\', $article->id)\r\n            ->with(\'socialiteUser\', \'socialiteUser.socialiteClient\', \'parentComment\', \'parentComment.socialiteUser\')\r\n            ->when(Str::isTrue(config(\'bjyblog.comment_audit\')), function ($query) {\r\n                return $query->where(\'is_audited\', 1);\r\n            })\r\n            ->withDepth()\r\n            ->get()\r\n            ->toFlatTree();\r\n```\r\n\r\nf', '<pre><code class=\"language-php\">\n        $next = Article::select(\'id\', \'title\', \'slug\')\n            -&gt;orderBy(\'created_at\', \'asc\')\n            -&gt;where(\'id\', \'&gt;\', $article-&gt;id)\n            -&gt;limit(1)\n            -&gt;first();\n\n        $commentFlatTree = Comment::where(\'article_id\', $article-&gt;id)\n            -&gt;with(\'socialiteUser\', \'socialiteUser.socialiteClient\', \'parentComment\', \'parentComment.socialiteUser\')\n            -&gt;when(Str::isTrue(config(\'bjyblog.comment_audit\')), function ($query) {\n                return $query-&gt;where(\'is_audited\', 1);\n            })\n            -&gt;withDepth()\n            -&gt;get()\n            -&gt;toFlatTree();</code></pre>\n<span>分割</span><pre><code class=\"language-bash\"> $commentFlatTree = Comment::where(\'article_id\', $article-&gt;id)\n            -&gt;with(\'socialiteUser\', \'socialiteUser.socialiteClient\', \'parentComment\', \'parentComment.socialiteUser\')\n            -&gt;when(Str::isTrue(config(\'bjyblog.comment_audit\')), function ($query) {\n                return $query-&gt;where(\'is_audited\', 1);\n            })\n            -&gt;withDepth()\n            -&gt;get()\n            -&gt;toFlatTree();</code></pre>\n<p>f</p>",
//   list:'<h1  id="1-vue3简介">1.Vue3简介</h1><pre id="w-e-element-18" data-slate-node="element"><code class="language-json"lang="json" id="w-e-element-19" data-slate-node="element"><span id="w-e-text-20" data-slate-node="text"><span data-slate-leaf="true"><span data-slate-string="true" class="token keyword">let</span></span><span data-slate-leaf="true"><span data-slate-string="true"> hello </span></span><span data-slate-leaf="true"><span class="token operator" data-slate-string="true">=</span></span><span data-slate-leaf="true"><span data-slate-string="true"> </span></span><span data-slate-leaf="true"><span class="token string" data-slate-string="true">"Hello World!"</span></span><span data-slate-leaf="true"><span class="token punctuation" data-slate-string="true">;</span></span><span data-slate-leaf="true"><span data-slate-string="true">console</span></span><span data-slate-leaf="true"><span class="token punctuation" data-slate-string="true">.</span></span><span data-slate-leaf="true"><span data-slate-string="true" class="token function">log</span></span><span data-slate-leaf="true"><span class="token punctuation" data-slate-string="true">(</span></span><span data-slate-leaf="true"><span data-slate-string="true">hello</span></span><span data-slate-leaf="true"><span class="token punctuation" data-slate-string="true">)</span></span><span data-slate-leaf="true"><span class="token punctuation" data-slate-string="true">;</span></span></span></code></pre><ul><li><p>2020年9月18日<code>Vue.js</code>发布版<code>3.0</code>版本，代号：<code>OnePiece</code>（n</p></li><li><p>经历了：<ahref="https://github.com/vuejs/core/commits/main">4800+次提交</a>、<ahref="https://github.com/vuejs/rfcs/tree/master/active-rfcs">40+个RFC</a>、<ahref="https://github.com/vuejs/vue-next/pulls?q=is%3Apr+is%3Amerged+-author%3Aapp%2Fdependabot-preview+">600+次PR</a>、<ahref="https://github.com/vuejs/core/graphs/contributors">300+贡献者</a></p></li><li><p>官方发版地址：<ahref="https://github.com/vuejs/core/releases/tag/v3.0.0">Releasev3.0.0OnePiece·vuejs/core</a></p></li><li><p>截止2023年10月，最新的公开版本为：<pre><code>3.3.4</code></pre></p><p><imgsrc="C:UsersLinDesktopimages1695089947298-161c1b47-eb86-42fb-b1f8-d6a4fcab8ee2.png"alt="image.png"style="zoom:30%;"></p></li></ul><h2 id="11-性能的提升">1.1.【性能的提升】</h2><ul><li><p>打包大小减少<code>41%</code>。</p></li><li><p>初次渲染快<code>55%</code>,更新渲染快<code>133%</code>。</p></li><li><p>内存减少<code>54%</code>。</p><p>&nbsp;</p></li></ul><h2 id="12-源码的升级">1.2.【源码的升级】</h2><ul><li><p>使用<code>Proxy</code>代替<code>defineProperty</code>实现响应式。</p></li><li><p>重写虚拟<code>DOM</code>的实现和<code>Tree-Shaking</code>。</p><p>&nbsp;</p></li></ul><h2 id="13-拥抱typescript">1.3.【拥抱TypeScript】</h2><ul><li><p><code>Vue3</code>可以更好的支持<code>TypeScript</code>。</p><p>&nbsp;</p></li></ul><h2 id="14-新的特性">1.4.【新的特性】</h2><ol><li><p><code>CompositionAPI</code>（组合<code>API</code>）：</p><ul><li><p><code>setup</code></p></li><li><p><code>ref</code>与<code>reactive</code></p></li><li><p><code>computed</code>与<code>watch</code></p><p>......</p></li></ul></li><li><p>新的内置组件：</p><ul><li><p><code>Fragment</code></p></li><li><p><code>Teleport</code></p></li><li><p><code>Suspense</code></p><p>......</p></li></ul></li><li><p>其他改变：</p><ul><li><p>新的生命周期钩子</p></li><li><p><code>data</code>选项应始终被声明为一个函数</p></li><li><p>移除<code>keyCode</code>支持作为<code>v-on</code>的修饰符</p><p>......</p></li></ul></li></ol><p>&nbsp;</p><h1 id="2-创建vue3工程">2.创建Vue3工程</h1><h2 id="21-基于-vue-cli-创建">2.1.【基于vue-cli创建】</h2><p>点击查看<ahref="https://cli.vuejs.org/zh/gu ide/creating-a-project.html#vue-create">官方文档</a></p><blockquote><p>备注：目前<code>vue-cli</code>已处于维护模式，官方推荐基于<code>Vite</code>创建项目。</p></blockquote><pre><code class="language-powershell"lang="powershell">##查看@vue/cli版本确保@vue/cli版本在4.5.0以上vue--version##安装或者升级你的@vue/clinpminstall-g@vue/cli##执行创建命令vuecreatevue_test##随后选择3.x##ChooseaversionofVue.jsthatyouwanttostarttheprojectwith(Usearrowkeys)##&gt;3.x##2.x##启动cdvue_testnpmrunserve</code></pre><hr><h2 id="22-基于-vite-创建推荐">2.2.【基于vite创建】(推荐)</h2><p><code>vite</code>是新一代前端构建工具，官网地址：<ahref="https://vitejs.cn/">https://vitejs.cn</a>，<code>vite</code>的优势如下：</p><ul><li>轻量快速的热重载（<code>HMR</code>），能实现极速的服务启动。</li><li>对<code>TypeScript</code>、<code>JSX</code>、<code>CSS</code>等支持开箱即用。</li><li>真正的按需编译，不再等待整个应用编译完成。</li><li><code>webpack</code>构建与<code>vite</code>构建对比图如下：<imgsrc="C:UsersLinDesktopimages1683167182037-71c78210-8217-4e7d-9a83-e463035efbbe.png"alt="webpack构建"title="webpack构建"style="zoom:20%;box-shadow:0010pxblack"><imgsrc="C:UsersLinDesktopimages1683167204081-582dc237-72bc-499e-9589-2cdfd452e62f.png"alt="vite构建"title="vite构建"style="zoom:20%;box-shadow:0010pxblack"></li></ul><ul><li>具体操作如下（点击查看<ahref="https://cn.vuejs.org/gu ide/quick-start.html#creating-a-vue-application">官方文档</a>）</li></ul><pre><code class="language-powershell"lang="powershell">##1.创建命令npmcreatevue@latest##2.具体配置##配置项目名称√Projectname:vue3_test##是否添加TypeScript支持√AddTypeScript?Yes##是否添加JSX支持√AddJSXSupport?No##是否添加路由环境√AddVueRouterforSinglePageApplicationdevelopment?No##是否添加pinia环境√AddPiniaforstatemanagement?No##是否添加单元测试√AddVitestforUnitTesting?No##是否添加端到端测试方案√AddanEnd-to-EndTestingSolution?»No##是否添加ESLint语法检查√AddESLintforcodequality?Yes##是否添加Prettiert代码格式化√AddPrettierforcodeformatting?No</code></pre><p>自己动手编写一个App组件</p><pre><code class="language-html"lang="vue">&lt;template&gt;&lt;divclass="app"&gt;&lt;h1&gt;你好啊！&lt;/h1&gt;&lt;/div&gt;&lt;/template&gt;&lt;scriptlang="ts"&gt;exportdefault{name:App//组件名}&lt;/script&gt;&lt;style&gt;.app{background-color:#ddd;box-shadow:0010px;border-radius:10px;padding:20px;}&lt;/style&gt;</code></pre><p>安装官方推荐的<code>vscode</code>插件：</p><p><imgsrc="C:UsersLinDesktopimagesvolar.png"alt="Snipaste_2023-10-08_20-46-34"style="zoom:50%;"></p><p><imgsrc="C:UsersLinDesktopimagesimage-20231218085906380.png"alt="image-20231218085906380"style="zoom:42%;"></p><p>总结：</p><ul><li><code>Vite</code>项目中，<code>index.html</code>是项目的入口文件，在项目最外层。</li><li>加载<code>index.html</code>后，<code>Vite</code>解析<code>&lt;scripttype="module"src="xxx"&gt;</code>指向的<code>JavaScript</code>。</li><li><code>Vue3</code><strong>中是通过</strong><code>createApp</code>函数创建一个应用实例。</li></ul><h2 id="23-一个简单的效果">2.3.【一个简单的效果】</h2><p><code>Vue3</code>向下兼容<code>Vue2</code>语法，且<code>Vue3</code>中的模板中可以没有根标签</p><pre><code>&lt;template&gt;&lt;div class="person"&gt;&lt;h2&gt;姓名：name}}&lt;/h2&gt;&lt;h2&gt;年龄age}}&lt;/h2&gt;&lt;button@click="changeName"&gt;修改名字&lt;/button&gt;&lt;button@click="changeAge"&gt;年龄+1&lt;/button&gt;&lt;button@click="showTel"&gt;点我查看联系方式&lt;/button&gt;&lt;/div&gt;&lt;/template&gt;&lt;scriptlang="ts"&gt;exportdefault{name:App,data(){return{name:张三,age:18,tel:13888888888}},methods:{changeName(){this.name=zhang-san},changeAge(){this.age+=1},showTel(){alert(this.tel)}},}&lt;/script&gt;</code></pre><h1 id="3-vue3核心语法">3.Vue3核心语法</h1><h2 id="31--optionsapi-与-compositionapi">3.1.【OptionsAPI与CompositionAPI】</h2><ul><li><code>Vue2</code>的<code>API</code>设计是<code>Options</code>（配置）风格的。</li><li><code>Vue3</code>的<code>API</code>设计是<code>Composition</code>（组合）风格的。</li></ul><h3 id="options-api-的弊端">OptionsAPI的弊端</h3><p><code>Options</code>类型的<code>API</code>，数据、方法、计算属性等，是分散在：<code>data</code>、<code>methods</code>、<code>computed</code>中的，若想新增或者修改一个需求，就需要分别修改：<code>data</code>、<code>methods</code>、<code>computed</code>，不便于维护和复用。</p><p><imgsrc="C:UsersLinDesktopimages1696662197101-55d2b251-f6e5-47f4-b3f1-d8531bbf9279.gif"alt="1.gif"style="zoom:70%;border-radius:20px"><imgsrc="C:UsersLinDesktopimages1696662200734-1bad8249-d7a2-423e-a3c3-ab4c110628be.gif"alt="2.gif"style="zoom:70%;border-radius:20px"></p><h3 id="composition-api-的优势">CompositionAPI的优势</h3><p>可以用函数的方式，更加优雅的组织代码，让相关功能的代码更加有序的组织在一起。</p><p><imgsrc="C:UsersLinDesktopimages1696662249851-db6403a1-acb5-481a-88e0-e1e34d2ef53a.gif"alt="3.gif"style="height:300px;border-radius:10px"><imgsrc="C:UsersLinDesktopimages1696662256560-7239b9f9-a770-43c1-9386-6cc12ef1e9c0.gif"alt="4.gif"style="height:300px;border-radius:10px"></p><blockquote><p>说明：以上四张动图原创作者：大帅老猿</p></blockquote><h2 id="32-拉开序幕的-setup">3.2.【拉开序幕的setup】</h2><h3 id="setup-概述">setup概述</h3><p><code>setup</code>是<code>Vue3</code>中一个新的配置项，值是一个函数，它是<code>CompositionAPI</code><strong>“表演的舞台</strong><em><strong>”</strong></em>，组件中所用到的：数据、方法、计算属性、监视......等等，均配置在<code>setup</code>中。</p><p>特点如下：</p><ul><li><code>setup</code>函数返回的对象中的内容，可直接在模板中使用。</li><li><code>setup</code>中访问<code>this</code>是<code>undefined</code>。</li><li><code>setup</code>函数会在<code>beforeCreate</code>之前调用，它是“领先”所有钩子执行的。</li></ul><pre><code class="language-html"lang="vue">&lt;template&gt;&lt;divclass="person"&gt;&lt;h2&gt;姓名：name}}&lt;/h2&gt;&lt;h2&gt;年龄：age}}&lt;/h2&gt;&lt;button@click="changeName"&gt;修改名字&lt;/button&gt;&lt;button@click="changeAge"&gt;年龄+1&lt;/button&gt;&lt;button@click="showTel"&gt;点我查看联系方式&lt;/button&gt;&lt;/div&gt;&lt;/template&gt;&lt;scriptlang="ts"&gt;exportdefault{name:Person,setup(){//数据，原来写在data中（注意：此时的name、age、tel数据都不是响应式数据）letname=张三letage=18lettel=13888888888//方法，原来写在methods中functionchangeName(){name=zhang-san//注意：此时这么修改name页面是不变化的console.log(name)}functionchangeAge(){age+=1//注意：此时这么修改age页面是不变化的console.log(age)}functionshowTel(){alert(tel)}//返回一个对象，对象中的内容，模板中可以直接使用return{name,age,tel,changeName,changeAge,showTel}}}&lt;/script&gt;</code></pre><h3 id="setup-的返回值">setup的返回值</h3><ul><li>若返回一个<strong>对象</strong>：则对象中的：属性、方法等，在模板中均可以直接使用<strong>（重点关注）。</strong></li><li>若返回一个<strong>函数</strong>：则可以自定义渲染内容，代码如下：</li></ul><pre><code class="language-jsx"lang="jsx">setup(){return()=&gt;你好啊！}</code></pre><h3 id="setup-与-options-api-的关系">setup与OptionsAPI的关系</h3><ul><li><code>Vue2</code>的配置（<code>data</code>、<code>methos</code>......）中<strong>可以访问到</strong><code>setup</code>中的属性、方法。</li><li>但在<code>setup</code>中<strong>不能访问到</strong><code>Vue2</code>的配置（<code>data</code>、<code>methos</code>......）。</li><li>如果与<code>Vue2</code>冲突，则<code>setup</code>优先。</li></ul><h3 id="setup-语法糖">setup语法糖</h3><p><code>setup</code>函数有一个语法糖，这个语法糖，可以让我们把<code>setup</code>独立出去，代码如下：</p><pre><code class="language-html"lang="vue">&lt;template&gt;&lt;divclass="person"&gt;&lt;h2&gt;姓名：name}}&lt;/h2&gt;&lt;h2&gt;年龄：age}}&lt;/h2&gt;&lt;button@click="changName"&gt;修改名字&lt;/button&gt;&lt;button@click="changAge"&gt;年龄+1&lt;/button&gt;&lt;button@click="showTel"&gt;点我查看联系方式&lt;/button&gt;&lt;/div&gt;&lt;/template&gt;&lt;scriptlang="ts"&gt;exportdefault{name:Person,}&lt;/script&gt;&lt;!--下面的写法是setup语法糖--&gt;&lt;scriptsetuplang="ts"&gt;console.log(this)//undefined//数据（注意：此时的name、age、tel都不是响应式数据）letname=张三letage=18lettel=13888888888//方法functionchangName(){name=李四//注意：此时这么修改name页面是不变化的}functionchangAge(){console.log(age)age+=1//注意：此时这么修改age页面是不变化的}functionshowTel(){alert(tel)}&lt;/script&gt;</code></pre><p>扩展：上述代码，还需要编写一个不写<code>setup</code>的<code>script</code>标签，去指定组件名字，比较麻烦，我们可以借助<code>vite</code>中的插件简化</p><ol><li>第一步：<code>npmivite-plugin-vue-setup-extend-D</code></li><li>第二步：<code>vite.config.ts</code></li></ol><pre><code class="language-jsx"lang="jsx">import{defineConfig}fromviteimportVueSetupExtendfromvite-plugin-vue-setup-extendexportdefaultdefineConfig({plugins:[VueSetupExtend()]})</code></pre><olstart="3"><li>第三步：<code>&lt;scriptsetuplang="ts"name="Person"&gt;</code></li></ol><h2 id="33-ref-创建基本类型的响应式数据">3.3.【ref创建：基本类型的响应式数据】</h2><ul><li><p><strong>作用：</strong>定义响应式变量。</p></li><li><p><strong>语法：</strong><code>letxxx=ref(初始值)</code>。</p></li><li><p><strong>返回值：</strong>一个<code>RefImpl</code>的实例对象，简称<code>ref对象</code>或<code>ref</code>，<code>ref</code>对象的<code>value</code><strong>属性是响应式的</strong>。</p></li><li><p><strong>注意点：</strong></p><ul><li><code>JS</code>中操作数据需要：<code>xxx.value</code>，但模板中不需要<code>.value</code>，直接使用即可。</li><li>对于<code>letname=ref(张三)</code>来说，<code>name</code>不是响应式的，<code>name.value</code>是响应式的。</li></ul></li></ul><pre><code class="language-html"lang="vue">&lt;template&gt;&lt;divclass="person"&gt;&lt;h2&gt;姓名：name}}&lt;/h2&gt;&lt;h2&gt;年龄：age}}&lt;/h2&gt;&lt;button@click="changeName"&gt;修改名字&lt;/button&gt;&lt;button@click="changeAge"&gt;年龄+1&lt;/button&gt;&lt;button@click="showTel"&gt;点我查看联系方式&lt;/button&gt;&lt;/div&gt;&lt;/template&gt;&lt;scriptsetuplang="ts"name="Person"&gt;import{ref}fromvue//name和age是一个RefImpl的实例对象，简称ref对象，它们的value属性是响应式的。letname=ref(张三)letage=ref(18)//tel就是一个普通的字符串，不是响应式的lettel=13888888888functionchangeName(){//JS中操作ref对象时候需要.valuename.value=李四console.log(name.value)//注意：name不是响应式的，name.value是响应式的，所以如下代码并不会引起页面的更新。//name=ref(zhang-san)}functionchangeAge(){//JS中操作ref对象时候需要.valueage.value+=1console.log(age.value)}functionshowTel(){alert(tel)}&lt;/script&gt;</code></pre><h2 id="34-reactive-创建对象类型的响应式数据">3.4.【reactive创建：对象类型的响应式数据】</h2><ul><li><strong>作用：</strong>定义一个<strong>响应式对象</strong>（基本类型不要用它，要用<code>ref</code>，否则报错）</li><li><strong>语法：</strong><code>let响应式对象=reactive(源对象)</code>。</li><li><strong>返回值：</strong>一个<code>Proxy</code>的实例对象，简称：响应式对象。</li><li><strong>注意点：</strong><code>reactive</code>定义的响应式数据是“深层次”的。</li></ul><pre><code class="language-html"lang="vue">&lt;template&gt;&lt;divclass="person"&gt;&lt;h2&gt;汽车信息：一台car.brand}}汽车，价值car.price}}万&lt;/h2&gt;&lt;h2&gt;游戏列表：&lt;/h2&gt;&lt;ul&gt;&lt;liv-for="gingames":key="g. id"&gt;g.name}}&lt;/li&gt;&lt;/ul&gt;&lt;h2&gt;测试：obj.a.b.c.d}}&lt;/h2&gt;&lt;button@click="changeCarPrice"&gt;修改汽车价格&lt;/button&gt;&lt;button@click="changeFirstGame"&gt;修改第一游戏&lt;/button&gt;&lt;button@click="test"&gt;测试&lt;/button&gt;&lt;/div&gt;&lt;/template&gt;&lt;scriptlang="ts"setupname="Person"&gt;import{reactive}fromvue//数据letcar=reactive({brand:奔驰,price:100})letgames=reactive([{ id:ahsgdyfa01,name:英雄联盟},{ id:ahsgdyfa02,name:王者荣耀},{ id:ahsgdyfa03,name:原神}])letobj=reactive({a:{b:{c:{d:666}}}})functionchangeCarPrice(){car.price+=10}functionchangeFirstGame(){games[0].name=流星蝴蝶剑}functiontest(){obj.a.b.c.d=999}&lt;/script&gt;</code></pre><h2 id="35-ref-创建对象类型的响应式数据">3.5.【ref创建：对象类型的响应式数据】</h2><ul><li>其实<code>ref</code>接收的数据可以是：<strong>基本类型</strong>、<strong>对象类型</strong>。</li><li>若<code>ref</code>接收的是对象类型，内部其实也是调用了<code>reactive</code>函数。</li></ul><pre><code>&lt;template&gt;&lt;divclass="person"&gt;&lt;h2&gt;汽车信息：一台car.brand}}汽车，价值car.price}}万&lt;/h2&gt;&lt;h2&gt;游戏列表：&lt;/h2&gt;&lt;ul&gt;&lt;liv-for="gingames":key="g. id"&gt;gname}}&lt;/li&gt;&lt;/ul&gt;&lt;h2&gt;测试：obj.a.b.c.d}}&lt;/h2&gt;&lt;button@click="changeCarPrice"&gt;修改汽车价格&lt;/button&gt;&lt;button@click="changeFirstGame"&gt;修改第一游戏&lt;/button&gt;&lt;button@click="test"&gt;测试&lt;/button&gt;&lt;/div&gt;&lt;/template&gt;&lt;scriptlang="ts"setupname="Person"&gt;import{ref}fromvue//数据letcar=ref({brand:奔驰,price:100})letgames=ref([{ id:ahsgdyfa01,name:英雄联盟},{ id:ahsgdyfa02,name:王者荣耀},{ id:ahsgdyfa03,name:原神}])letobj=ref({a:{b:{c:{d:666}}}})console.log(car)functionchangeCarPrice(){car.value.price+=10}functionchangeFirstGame(){games.value[0].name=流星蝴蝶剑}functiontest(){obj.value.a.b.c.d=999}&lt;/script&gt;</code></pre><h2 id="36-ref-对比-reactive">3.6.【ref对比reactive】</h2><script>//获取HTML元素的内容varhtmlElement=document.getElementBy id("myElement");varhtmlContent=htmlElement.innerHTML;//去除换行符和空格，将HTML转换为一行字符串varoneLineString=htmlContent.replace(/[rns]+/g,"");console.lo/script>',


})


onMounted(()=>{
    // getArticleDetail
     //两重校验路由查询参数，路由表加页面;否: 导航到404页面。 
     if(current_route_query){
        current_route_query.value=route.query;
     }else{
        router.push({path:'/404', });
     }
    
     proxy.$get('/data/frontend/article_detail.json')
      .then(response => {
            data.menu_title=response.menu_title;
            data.tag_ids_name=response.tag_ids_name;    
            data.visits=response.visits;
            data.word_count=response.word_count; 
            data.read_time=response.read_time;
            data.title=response.title;
            data.author_name=response.author_name;
            data.created_time=response.created_time;
            data.article_content=response.article_content;

            is_loading.value=false;//取消骨架屏
           
    // setTimeout(() => {
			// index_tag_data.value = response.tag_data; // 数据加载完毕，关闭骨架屏
			// index_article_list_data.value = response.article_list_data; // 数据加载完毕，关闭骨架屏
			// flag.value=true;
			// is_loading.value=false;
			// console.log('response:',response);
        // }, 3000); // 假设加载时间是3秒
		

      })
      .catch(error => {

        proxy.$Message('请求未找到', 'error');
      });

	mediaQuery();//初始化（防止刷新失效）
//     console.log('挂载完毕');
	window.addEventListener('resize',mediaQuery);  //监听窗口大小变化	
}) 

/*黑色主题*/
import 'highlight.js/styles/atom-one-dark.css';
/*白色主题*/
// import 'highlight.js/styles/stackoverflow-light.css';
import hljs from "highlight.js";
// 批量引入常用语言库
import 'highlight.js/lib/common';


const vHighlight  = {
  mounted(el) {
    let blocks = el.querySelectorAll('pre code');
   
	//行号和代码块 pre添加flex属性 复制功能
		const pre =el.querySelectorAll('pre');
	pre.forEach((block) => {
		block.setAttribute('style', 'display: flex;max-width: 1260px;width:100%;');
		//创建一个 'code' 元素来包含DOM 元素
		const code=block.querySelector('code');//获取pre父元素下的code子元素对象
		//'block' 是一个 DOM 元素，直接获取其内部文本即可
		
		//插入复制功能
        let copy = document.createElement('div')
        copy.classList.add('hljs-copy')
        copy.innerText = '复制'
        //添加点击事件
        copy.addEventListener('click', () => {
            //创建一个输入框
            let textarea = document.createElement('textarea')
            document.body.appendChild(textarea);
            textarea.setAttribute('readonly', 'readonly')
            textarea.value =code.innerText;
            textarea.select();
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                copy.innerText = '复制成功'
            }
            document.body.removeChild(textarea);
        })

        block.appendChild(copy);

        //鼠标移入显示复制按钮
        el.addEventListener('mouseout', () => {
            copy.innerText = '复制';
            // copy.style.display = "none";
			copy.style.display = "block";
        })
        el.addEventListener('mouseover', () => {
            copy.style.display = "block";

        })

	})


	blocks.forEach((block) => {
	block.setAttribute('style', 'flex: 1;');
    // 高亮代码块
    hljs.highlightElement(block);

  
      // 获取代码块内容
      const code = block.innerText;
 
      // 将代码块内容分割成行
      const lines = code.split('\n');
 
      // 创建包含行号的伪元素
      const lineNumberContainer = document.createElement('ul');
      lineNumberContainer.className = 'number-container';
 
      // 循环创建并添加行号
      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const lineNumberElement = document.createElement('li');
        lineNumberElement.className = 'line-number';
        lineNumberElement.textContent = lineNumber;
        lineNumberContainer.appendChild(lineNumberElement);
      })
 
      // 将伪元素插入代码块前面
      block.parentNode.insertBefore(lineNumberContainer, block);
    
  })

  }
}




const valueHtml = ref(`<pre id="w-e-element-18" data-slate-node="element"><code id="w-e-element-19" data-slate-node="element"><span id="w-e-text-20" data-slate-node="text"><span data-slate-leaf="true"><span data-slate-string="true" class="token keyword">let</span></span><span data-slate-leaf="true"><span data-slate-string="true"> hello </span></span><span data-slate-leaf="true"><span class="token operator" data-slate-string="true">=</span></span><span data-slate-leaf="true"><span data-slate-string="true"> </span></span><span data-slate-leaf="true"><span class="token string" data-slate-string="true">'Hello World!'</span></span><span data-slate-leaf="true"><span class="token punctuation" data-slate-string="true">;</span></span><span data-slate-leaf="true"><span data-slate-string="true">
console</span></span><span data-slate-leaf="true"><span class="token punctuation" data-slate-string="true">.</span></span><span data-slate-leaf="true"><span data-slate-string="true" class="token function">log</span></span><span data-slate-leaf="true"><span class="token punctuation" data-slate-string="true">(</span></span><span data-slate-leaf="true"><span data-slate-string="true">hello</span></span><span data-slate-leaf="true"><span class="token punctuation" data-slate-string="true">)</span></span><span data-slate-leaf="true"><span class="token punctuation" data-slate-string="true">;</span></span></span></code></pre>`);

const container_name=ref('.article-content');




////目录显示隐藏开关
const show_article_catalog=ref(false);
function showArticleCatalog(){
	if(show_article_catalog.value==false){//目录隐藏，需要打开
		show_article_catalog.value=true;
		article_ccatalog_right.value=300;		 //目录右边距
		// console.log('show_article_catalog.value=true:',show_article_catalog.value)
	}else{//目录显示，需要隐藏
		show_article_catalog.value=false;
		article_ccatalog_right.value=12;		 //目录右边距
		// console.log('show_article_catalog.value=flase:',show_article_catalog.value)

	}
	// show_article_catalog.value=!show_article_catalog.value;
	
}


const article_ccatalog_right=ref(5);
const show_article_catalog_icon=ref(false);
//监听窗口大小变化	
function mediaQuery() {
	const media_query = window.matchMedia('(max-width: 959px)');// 创建一个媒体查询(移动端)实例
	if (media_query.matches) { // 当前窗口大小满足移动端右侧遮罩目录（使用移动端样式）条件
		// 执行相关操作
		
		// article_ccatalog_right.value=300;	//目录右边距
		show_article_catalog.value=false;		//隐藏移动端样式
		show_article_catalog_icon.value=true;//显示目录图标
		// console.log('article小于959',show_article_catalog_icon.value);
	
	} else { // 当前窗口大小不满足移动端右侧遮罩目录（使用PC端样式）条件
		// 执行相关操作
		
		show_article_catalog.value=true;		 //PC端样式
		article_ccatalog_right.value=5;		 //目录右边距
		show_article_catalog_icon.value=false;//隐藏目录图标
		// console.log('article大于959');
	}
}




onUnmounted(() => {
	window.removeEventListener('resize', mediaQuery);
})//离开页面时移除监听窗口大小变化	



</script>

<style scoped>

*{  
 
 -ms-overflow-style: none; /* 适用于 Internet Explorer 和旧版 Edge */
 scrollbar-width: none; /* 适用于 Firefox */
 -webkit-scrollbar:none;/* WebKit 内核浏览器（如 Chrome 和 Safari）中的滚动条*/ 
}
.container {
	padding: 0;
	max-width: 1728px;
	background-color: var(--bg);  /* fff*/
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
	flex:1;
    overflow-x: hidden;/* 禁止容器x轴方向滚动 */

	padding-top: 72px;
	width: 100%;
	margin: 0 auto;
	padding-left: 12px;
	padding-right: 12px;
   

  }
  .article-container {
      overflow-x: hidden;/* 禁止容器x轴方向滚动 */
      display: flex;
      flex-direction: column;
	  flex-wrap:wrap;
      /* padding: 0 12px;
      padding-top: 72px;
      width: 100%; */
        
	}

	.article-content{
		width: 100%;
		/* max-width: 1280px; */
		
		white-space: normal; /* 允许空白符号，但不保留 */
		overflow-wrap: break-word; /* 在长单词或URL地址内部进行换行 */
		overflow: hidden; /* 隐藏溢出容器的内容 */
	}


	.article-title{
		display: flex;
		justify-content: center;
		font-size: 32px;
		margin: 20px 0px;
	}

	.article-metadata{
		display: flex;
		justify-content: center; 
		align-items: center;
		border-bottom: 1px dotted #999; 
		margin-bottom:10px;
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
    color: rgba(0,0,0,.86);
    border-radius: 4px
}

.theme-dark  .post-pager {
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
    color: rgba(0,0,0,.42);
    line-height: 1.4
}

.theme-dark  .post-pager>div p {
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
    color: rgba(0,0,0,.2);
    border: 1px solid rgba(0,0,0,.1);
    border-radius: 4px
}

.theme-dark  .post-pager>div::before {
    color: rgba(255,255,255,.2);
    border-color: rgba(255,255,255,.15)
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

.theme-dark  .post-pager>div.prev::after {
    background: rgba(255,255,255,.1)
}

 .post-pager>div.next::before {
    content: "下一篇"
}

@media screen and (max-width: 767.5px) {
     .post-pager {
        -webkit-box-orient:vertical;
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

    .theme-dark  .post-pager>div:first-child {
        border-color: rgba(255,255,255,.1)
    }
}

/* 代码块行号样式 */
:deep(.number-container){
	display: flex;
    padding: 1em;
	width: 20px;
	height: auto;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	color: #abb2bf;
    background: #282c34;
	border-right: 1px dashed #999; 
	
}

/* 复制按钮样式 */
:deep(.hljs-copy) {
	display: flex;
    position: absolute;
    /* top: 50px; */
    /* right: 30px; */
    display: none;
    padding: 3px 3px;
    color: #66a9ff;
    font-size: 10px;
    background-color: #ecf5ff;
    border-radius: 3px;
    cursor: pointer;
    /* z-index: 3; */
    /* margin-right: 10px; */
	margin-top: 3px;
    right: 15px;
}


.article-skeleton{
    height: 1000px;
  
}

  /* 骨架屏缩放动画 */
  .scale-down-enter-active, .scale-down-leave-active {
  transition: all 0.8s ease;
}
 
.scale-down-enter-from, .scale-down-leave-to {
  opacity: 0;
  transform: scale(0.8);
} 

</style>