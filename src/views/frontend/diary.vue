<template>

  <div class="feeds-page" @scroll="layoutPageOnReachBottom">



    <div style="margin-top: 72px;">
      <ContentTag :parentPageTagData="diary_tag_data" :currentActiveTagName="current_active_tag_name"
        @childClickTag="getChildClickTag" v-if="flag"></ContentTag>

    </div>



    <div class="feeds-container">
      <ContentCarouselImg :parentPageCarouselImgData="diary_carousel_img_data" :isLoading="is_loading">
      </ContentCarouselImg>
      <Waterfall :parentPageArticleListData="diary_article_list_data" :isLoading="is_loading"
        :isNextPageLoading="is_next_page_loading" :isNoMoreData="is_no_more_data"
        :isEmptyArticleListData="is_empty_article_list_data"></Waterfall>
    </div>



  </div>

</template>


<script setup>
  import { reactive, ref, onMounted, inject } from 'vue';
  import { useRoute, useRouter } from "vue-router";
  import ContentTag from '@/components/content_tag.vue';
  import ContentCarouselImg from '@/components/content_carousel_img.vue';
  import Waterfall from '@/components/waterfall.vue';
  import { debounce, throttle } from '@/hooks/debounce_throttle.js';

  const $getData = inject('$getData');
  const $postDta = inject('$postDta');
  const $message = inject('$message');

  const route = useRoute();
  const router = useRouter();


  const flag = ref(false);
  const is_loading = ref(true);

  const diary_tag_data = ref();
  const diary_article_list_data = ref();
  const diary_carousel_img_data = ref();
  const total_pages = ref(0); //总页数
  const current_page = ref(1);//当前页数
  const current_active_tag_id = ref(1);
  const current_active_tag_name = ref('');
  const is_empty_article_list_data = ref(false);

  //没有更多数据占位图（页面已经渲染到最后一页，没有更多数据可以加载渲染。
  //点击标签需初始化，否则因没有更多数据占位导致页面无法滚动到底部，上拉加载更多功能失效）
  const is_no_more_data = ref(false);
  //博文列表（瀑布流）加载下一页数据占位
  const is_next_page_loading = ref(false);

  //注入来自layout页面的当前选中标签id
  const parent_page_current_active_tag_id = inject('currentActiveTagId');

  // 注入来自layout页面（公共）提供修改当前选中标签id的方法
  const updateCurrentActiveTagIdFunction = inject('updateCurrentActiveTagIdFunction');




  //获取随笔栏页数据（内容标签栏数据、轮播图数据、博文列表数据（瀑布流组件）） 
  function getDiaryPageData() {
    is_no_more_data.value = false;//初始化,防止上拉加载更多失效。
    is_loading.value = true;
    // 如果你想使用axios来模拟请求，可以这样做
    $getData('/data/frontend/diary.json')
      .then(response => {
        // setTimeout(() => {
        diary_tag_data.value = response.tag_data;
        diary_article_list_data.value = response.article_list_data;
        diary_carousel_img_data.value = response.carousel_img_data;


        total_pages.value = response.total_pages; //总页数
        current_page.value = response.current_page; //当前页数

        current_active_tag_id.value = response.current_active_tag_id;
        current_active_tag_name.value = response.current_active_tag_name;
        //使用来自layout页面（公共）提供修改当前选中标签id的方法修改选中标签id值，用于菜单栏页（导航栏）获取选中标签id数据来添加选中样式
        updateCurrentActiveTagIdFunction(current_active_tag_id.value);



        //模拟数据返回随机数量
        let sliced_start = Math.floor(Math.random() * 5) + 1;

        total_pages.value = sliced_start; //总页数
        const data_count = diary_article_list_data.value.length;
        diary_article_list_data.value = diary_article_list_data.value.slice(sliced_start, data_count);
        let article_count = data_count - sliced_start; // 博文数量

        for (let i = 0; i < article_count; i++) {
          diary_article_list_data.value[i]['title'] = `总页数:${total_pages.value},第${current_page.value}页：` + diary_article_list_data.value[i]['title'];
        }

        //如果博文列表没有数据，那么显示没有数据占位  
        if (!diary_article_list_data.value) {
          is_empty_article_list_data.value = true;
        }


        flag.value = true;
        is_loading.value = false;



      })
      .catch(error => {

        $message('请求未找到', 'error');
      });
  }


  //获取把子页面选中的标签id和标签名称传到父页面或者点击归档页标签统计栏的标签（路由携参?tag_id=标签名称跳转和来自父页面的当前选中标签id）
  function getChildClickTag(active_tag_id, active_tag_name) {
    // flag.value=false; //初始化导致子页面选中的标签id数据出现标签栏闪烁（当前标签栏处于显示状态，出现先隐藏后显示闪烁）
    is_no_more_data.value = false;//初始化,防止上拉加载更多失效。
    is_loading.value = true;

    $postDta('/data/frontend/diary.json', { tag_id: active_tag_id, tag_name: active_tag_name })
      .then(response => {
        // setTimeout(() => {
        diary_tag_data.value = response.tag_data;
        diary_article_list_data.value = response.article_list_data;
        diary_carousel_img_data.value = response.carousel_img_data;

        total_pages.value = response.total_pages; //总页数
        current_page.value = response.current_page; //当前页数

        current_active_tag_id.value = response.current_active_tag_id;
        current_active_tag_name.value = response.current_active_tag_name;
        //使用来自layout页面（公共）提供修改当前选中标签id的方法修改选中标签id值，用于菜单栏页（导航栏）获取选中标签id数据来添加选中样式
        updateCurrentActiveTagIdFunction(current_active_tag_id.value);
        //模拟数据返回随机数量
        current_active_tag_id.value = active_tag_id;
        current_active_tag_name.value = active_tag_name;
        let sliced_start = Math.floor(Math.random() * 5) + 1;

        total_pages.value = sliced_start; //总页数
        const data_count = diary_article_list_data.value.length;
        diary_article_list_data.value = diary_article_list_data.value.slice(sliced_start, data_count);
        let article_count = data_count - sliced_start; // 博文数量

        //标题添加选中标签名
        for (let i = 0; i < article_count; i++) {
          diary_article_list_data.value[i]['title'] = `点击${current_active_tag_name.value}，总页数:${total_pages.value},第${current_page.value}页：` + diary_article_list_data.value[i]['title']
        }

        //如果博文列表没有数据，那么显示没有数据占位    
        if (!diary_article_list_data.value) {
          is_empty_article_list_data.value = true;
        }



        flag.value = true;//true：显示内容标签栏

        is_loading.value = false;

      })
      .catch(error => {

        $message('请求未找到', 'error');
      });

  }



  //触底上拉加载更多数据
  function layoutPageOnReachBottom(event) {
    // console.log(`${route.name}页面，元素的像素高度：${event.target.clientHeight}`);
    if (is_loading.value) return;//如果正在加载数据，那么直接返回
    if (is_no_more_data.value) return;//如果显示没有更多数据占位图（页面已渲染最后一页），那么直接返回
    if (is_next_page_loading.value) return;//如果加载下一页数据占位，那么直接返回
    if (is_empty_article_list_data.value) return;//如果显示没有数据占位图（后台返回空数据），那么直接返回
    console.log('防抖前-is_next_page_loading.value:', is_next_page_loading.value)
    //总页数>=当前页数 ，模拟时当前页数没有axios赋值，随总页数（总页数是随机数）赋值
    if (total_pages.value > current_page.value) {
      debounce(() => {//防抖
        const { scrollTop, scrollHeight, clientHeight, scrollLeft, offsetWidth, scrollWidth } = event.target;
        const isScrolledToBottom = scrollHeight - (scrollTop + clientHeight) <= 200; // 200像素的误差  距离底部小于200像素
        // const isScrolledToRight = scrollWidth - (scrollLeft + offsetWidth) <= 1; // 1像素的误差    距离左边小于1像素
        // console.log('isScrolledToBottom:',isScrolledToBottom,',isScrolledToRight:',isScrolledToRight)
        //如果同时满足距离底部小于200像素和is_next_page_loading的反值是true条件，那么执行获取下一页数据
        if (isScrolledToBottom && !is_next_page_loading.value) {

          is_next_page_loading.value = true;

          console.log('满足距离value=true,is_next_page_loading.value:', is_next_page_loading.value)
          setTimeout(() => {
            getActiveTagNextPageData();//获取选中标签下一页数据
          }, 3000)

        }


      }, 1000);


    } else {//如果当前页数=总页数，那么显示没有更多数据占位图
      is_no_more_data.value = true;//显示没有更多数据
    }
  }


  //根据触底获取选中标签下一页数据  
  function getActiveTagNextPageData() {

    console.log('进入getActiveTagNextPageData,current_page.value:', current_page.value)
    current_page.value++;//当前页数加一
    $postDta('/data/frontend/active_tag_next_page_data.json', { tag_id: current_active_tag_id, tag_name: current_active_tag_name, page: current_page.value })
      .then(response => {
        // setTimeout(() => {
        is_next_page_loading.value = false;//取消加载中动画
        if (!is_next_page_loading.value) {


          let diary_article_list_data_next = response.article_list_data_next; // 博文列表
          // current_page.value= response.current_page; //当前页数  

          //模拟多次搜索返回随机数量
          let sliced_start = Math.floor(Math.random() * 5);
          const data_count = diary_article_list_data_next.length;
          let sliced_array = diary_article_list_data_next.slice(sliced_start, data_count);
          for (let i = 0; i < sliced_array.length; i++) {
            sliced_array[i]['title'] = `总页数:${total_pages.value},第${current_page.value}页：` + sliced_array[i]['title'];
          }
          // console.log('原：', JSON.stringify(diary_article_list_data.value));
          //数组元素合并
          diary_article_list_data.value = [...diary_article_list_data.value, ...sliced_array]
          // console.log('合并：', JSON.stringify(diary_article_list_data.value));

          if (current_page.value == total_pages.value) {//如果当前页数=总页数，那么显示没有更多数据占位图
            is_no_more_data.value = true;//显示没有更多数据
          }

          //如果博文列表没有数据，那么显示没有数据占位  
          if (!diary_article_list_data.value) {
            is_empty_article_list_data.value = true;
          }
          console.log('数据合并：is_next_page_loading.value:', is_next_page_loading.value)
          // is_next_page_loading.value = false;//取消加载中动画
        }
      })
      .catch(error => {

        $message('请求未找到', 'error');
      });


  }




  onMounted(() => {
    // 如果路由没有查询参数tag_id，那么执行getFrontendPageData。
    if (!route.query.tag_id) {
      getDiaryPageData();
    } else {
      //如果路由有查询参数tag_id(点击归档页标签统计栏的标签（路由携参?tag_id=标签名称跳转和来自父页面的当前选中标签id）)，
      //那么执行getChildClickTag。
      // ！！！注意：因为标签id设置默认为0，所以随笔：如果判断标签id是否为空或空值，那么排除标签id=0的情况。
      let active_tag_name_from_archives_page = route.query.tag_id;
      let active_tag_id_from_archives_page = 0;
      //如果有来自父页面的当前选中标签id，那么重新赋值。
      if (parent_page_current_active_tag_id.value) {
        active_tag_id_from_archives_page = parent_page_current_active_tag_id.value
      }
      getChildClickTag(active_tag_id_from_archives_page, active_tag_name_from_archives_page);
    }
    //   fetchTag();
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
    position: relative;

    .feeds-container {
      /* top: 72px; */
      position: relative;
      margin: 0;
      /* width: 100% - 24px; */
      transition: width 0.5s;
      /* padding-top: 72px; */
      background-color: var(--bg);
      /* max-width: 1236px; */
    }


  }
</style>