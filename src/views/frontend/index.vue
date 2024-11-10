<template>

  <div class="feeds-page" @scroll="layoutPageOnReachBottoms">
    <!-- <div style="position: sticky;top:72px;z-index: 1000;"> -->
    <div style="padding-top:72px;">

      <ContentTag :parentPageTagData="index_tag_data" :currentActiveTagName="current_active_tag_name"
        @childClickTag="getChildClickTag" v-if="flag"></ContentTag>
    </div>
    <div class="feeds-container">

      <!-- <ContentCarouselImg></ContentCarouselImg> -->
      <Waterfall :parentPageArticleListData="index_article_list_data" :isLoading="is_loading"></Waterfall>
    </div>

    <Footer :websiteApproveTitle="website_approve_title" :websiteApproveUrl="website_approve_url"></Footer>
  </div>

</template>

<script setup>
  import { reactive, ref, onMounted, onUpdated, inject, getCurrentInstance, watch, nextTick } from 'vue';
  import { useRoute, useRouter } from "vue-router";
  import ContentTag from '@/components/content_tag.vue';
  //   import ContentCarouselImg from '@/components/content_carousel_img.vue';
  import Waterfall from '@/components/waterfall.vue';
  import Footer from '@/components/footer.vue';
  import { debounce, throttle } from '@/hooks/debounceOrThrottle.js';
  import indexModuleApi from "@/api/frontend/index.js";//api接口

  const route = useRoute();
  const router = useRouter();
  // 消息提示
  const $message = inject('$message');

  const flag = ref(false);
  const is_loading = ref(true);

  const index_tag_data = ref();
  const index_article_list_data = ref();
  const total_pages = ref(0); //总页数
  const current_page = ref(1);//当前页数
  const current_active_tag_id = ref(1);
  const current_active_tag_name = ref('');
  const is_empty_article_list_data = ref(false);
  const website_approve_title = ref('');//备案号
  const website_approve_url = ref('');//查询备案号链接

  //当前页面meta元数据，标题、关键词、描述  开始
  const current_page_meta_data = reactive({
    meta_title: '',
    meta_keywords: '',
    meta_description: ''
  });

  //没有更多数据占位图（页面已经渲染到最后一页，没有更多数据可以加载渲染。
  //点击标签需初始化，否则因没有更多数据占位导致页面无法滚动到底部，上拉加载更多功能失效）
  const is_no_more_data = ref(false);
  //博文列表（瀑布流）加载下一页数据占位
  const is_next_page_loading = ref(false);

  //注入来自layout页面的当前选中标签id
  const parent_page_current_active_tag_id = inject('currentActiveTagId');
  
//注入来自layout页面的当前选中菜单路由名称
const parent_page_current_active_menu_name = inject('currentActiveMenuName');

  // 注入来自layout页面（公共）提供修改当前选中标签id的方法
  const updateCurrentActiveTagIdFunction = inject('updateCurrentActiveTagIdFunction');

    //注入来自layout页面的当前选中菜单id
    const parent_page_current_active_menu_id = inject('currentActiveMenuId');

  // 注入来自layout页面（公共）提供修改当前页面meta元数据，标题、关键词、描述的方法的方法
  const updatePageMetaInfoFunction = inject('updateCurrentMetaInfoFunction');

  // 当前菜单id
  const  current_menu_id = ref(null);


  //获取首页数据（内容标签栏数据、博文列表数据（瀑布流组件））  
  function getIndexPageData() {

    indexModuleApi.getIndexPageData({menu_id:current_menu_id.value,menu_name:parent_page_current_active_menu_name.value,page:1})
      .then(response => {

        //页面 meta 元数据
        current_page_meta_data.meta_title = response.meta_title;
        current_page_meta_data.meta_keywords = response.meta_keywords;
        current_page_meta_data.meta_description = response.meta_description;
        //使用来自layout页面（公共）提供修改当前页面meta元数据，标题、关键词、描述的方法的方法修改页面meta 数据。
        updatePageMetaInfoFunction(current_page_meta_data);

        index_tag_data.value = response.tag_data; // 标签数据
        index_article_list_data.value = response.article_list_data; // // 博文列表数据
        current_active_tag_id.value = response.current_active_tag_id;
        current_active_tag_name.value = response.current_active_tag_name;
        website_approve_title.value = response.website_approve_title;//备案号
        website_approve_url.value = response.website_approve_url;//查询备案号链接
        //使用来自layout页面（公共）提供修改当前选中标签id的方法修改选中标签id值，用于菜单栏页（导航栏）获取选中标签id数据来添加选中样式
        updateCurrentActiveTagIdFunction(current_active_tag_id.value);


        flag.value = true;
        is_loading.value = false;
      })
  }


  //获取子页面选中的标签id数据 
  // NOTE:　首页的标签数据仅展示一页（没有上拉加载更多），目的：显示页面底部备案信息。 
  function getChildClickTag(active_tag_id, active_tag_name) {
    is_loading.value = true;
    indexModuleApi.getChildClickTag({ tag_id: active_tag_id, tag_name: active_tag_name, page: 1 })
      .then(response => {

        //页面 meta 元数据
        current_page_meta_data.meta_title = response.meta_title;

        current_page_meta_data.meta_keywords = response.meta_keywords;
        current_page_meta_data.meta_description = response.meta_description;
        //使用来自layout页面（公共）提供修改当前页面meta元数据，标题、关键词、描述的方法的方法修改页面meta 数据。
        updatePageMetaInfoFunction(current_page_meta_data);

        index_tag_data.value = response.tag_data; // 标签数据
        index_article_list_data.value = response.article_list_data; // // 博文列表
        current_active_tag_id.value = response.current_active_tag_id;
        current_active_tag_name.value = response.current_active_tag_name;
        website_approve_title.value = response.website_approve_title;//备案号
        website_approve_url.value = response.website_approve_url;//查询备案号链接
        //使用来自layout页面（公共）提供修改当前选中标签id的方法修改选中标签id值，用于菜单栏页（导航栏）获取选中标签id数据来添加选中样式
        updateCurrentActiveTagIdFunction(current_active_tag_id.value);
        // current_page.value= response.current_page; //当前页数  

        //点击标签返回随机数量数据
        current_active_tag_id.value = active_tag_id;
        current_active_tag_name.value = active_tag_name;
        let sliced_start = Math.floor(Math.random() * 5);
        const data_count = index_article_list_data.value.length;
        index_article_list_data.value = index_article_list_data.value.slice(sliced_start, data_count);

        flag.value = true;
        is_loading.value = false;


      })
  }



  onMounted(() => {
 // 组件挂载后，从sessionStorage获取menuId
  current_menu_id.value = sessionStorage.getItem('currentMenuId') || 1;

    //   fetchTag();
    // 如果路由没有查询参数tag_id，那么执行getFrontendPageData。
    if (!route.query.tag_id) {
      getIndexPageData();
    } else {
      //如果路由有查询参数tag_id，情景：1.点击归档页标签统计栏的标签（路由携参?tag_id=标签名称跳转和来自父页面的当前选中标签id）。
      //2.地址栏输入查询参数tag_id
      //那么执行getChildClickTag。
      // ！！！注意：因为标签id设置默认为0，所以后端：如果判断标签id是否为空或空值，那么排除标签id=0的情况。
      let active_tag_name_from_archives_page = route.query.tag_id;
      let active_tag_id_from_archives_page = 0;
      //如果有来自父页面的当前选中标签id，那么重新赋值。
      if (parent_page_current_active_tag_id.value) {
        active_tag_id_from_archives_page = parent_page_current_active_tag_id.value
      }
      getChildClickTag(active_tag_id_from_archives_page, active_tag_name_from_archives_page);
    }

  });



</script>

<style scoped>
  .feeds-page {
    flex: 1;
    /* padding-top: 72px; */
    width: 100%;
    margin: 0;
    /* padding:0px 12px; */
    /* max-width: 1260px; */
    /* 修改盒子大小属性 */
    padding: 0px 12px;
    background-color: var(--bg);
    height: 100vh;
    overflow: auto;
    /* 底部栏内容高度 */
    margin-bottom: -60px;

    .feeds-container {
      /* top: 72px; */
      position: relative;
      margin: 0;
      width: 100%;
      transition: width 0.5s;
      /* padding-top: 72px; */
      background-color: var(--bg);
      /* max-width: 1236px; */
      min-height: 100%;

    }

  }
</style>