<template>

  <div class="feeds-page">
    
  <div class="archives-container">
    <transition name="scale-down" mode="out-in">
      <!-- 骨架屏 开始-->
          <div v-if="is_loading" key="loading" class="archives-skeleton" ref="waterfallSkeletonContainerRef">
            
            <div
            class="item"
            v-for="(item, index)  in 3" 
            :key="item"
            :style="{background: 'rgba(0, 0, 0, 0.04)', width: '100%',maxWidth: '1260px',paddingTop: '20px',}" >
           
            <!-- 标题占位 -->
            <Skeleton bg="#e4e4e4" width="100%" height="32px" animated  style="border-bottom: 3px solid #2ECC71;max-width: 1260px;display: flex;"/>
            <!-- 内容占位 -->
            <Skeleton bg="#e4e4e4" width="100%" height="300px" animated style="margin-top: 5px; max-width: 1260px;display: flex;" />

            </div>
            
          </div>
      
        <div v-else>
          <!-- 网站统计栏 开始-->
          <h2>网站统计</h2>
            <!-- 网站内容 开始-->
            <div class="website-content-count">
              <p>内容统计：</p>
          
              <div class="website-content-count-content">
                <WebsiteContentCount :parentPageWebsiteContentCountData="website_content_count_data"></WebsiteContentCount>
              </div>
      
            </div>
            <!-- 网站内容 结束-->
            <!-- 运行时间 开始-->
            <div class="run-time-count">
              
              <p>本站已运行：</p>
              <div class="run-time-count-content">
                <WebsiteRunTime :parentPageWebsiteCreationTime="data.website_creation_time" ></WebsiteRunTime>
              </div>
            
      
            </div>
            <!-- 运行时间 结束-->
          <!-- 网站统计栏 结束-->  
      
          <!-- 标签统计栏 开始-->
          <h2>标签</h2>
          <div class="tag-count">
            <div class="tag-count-content">
              <TagCount @getTagCountPageClickTagArticleDataEmit="getTagCountPageClickTagArticleData" :parentPageTagCountData="tag_count_data"></TagCount>
            </div>
          </div>
        
      
          <!-- 标签统计栏 结束-->
        
      
          <!-- 贡献统计栏 开始-->
          <h2>贡献</h2>
          <div class="contribution-calendar-count">
            <div style="display: flex;margin-top:24px;margin-bottom: 16px;">
              <!-- <h3 style="flex: 1;">最近一年贡献：{{ data.year_contribution_count}} 次</h3> -->
              <h3 style="flex: 1;">最近一年贡献： {{ last_year_contribution_count}} 次</h3>
        
              <div>
                <YearDropdown  :yearDropdown="contribution_calendar_count_data.contribution_year_list" @yearDropdownPageUpdateYearEmit="getClickYearContributionData"></YearDropdown>
              </div>
              
            </div>
            <div class="contribution-calendar-count-content">
              <ContributionCalendar :parentPageCurrentYearContributionData="current_year_contribution_data"  @childClickContributionDay="clickContributionDay"></ContributionCalendar>
            </div>
          </div>
          <!-- 贡献统计栏 结束-->
          
          <!-- 动态栏 开始-->
        
          
          <div v-if="select_contribution_year" class="contribution-activity-count">

            <div  class="contribution-activity-count-content">
              <div class="text-left"> <h3>动态 </h3></div>
              <div class="line"></div>
              <div class="text-right"> 
                <span v-if="!is_selected_data">
                  {{ select_contribution_year }} 
                  {{ current_year_month?current_year_month:'' }}
                  
                </span>
                <span v-if="is_selected_data==true">
                    {{select_contribution_year}} 
                  -{{contribution_day_month_data?contribution_day_month_data:'' }}
                  -{{contribution_day_date_data?contribution_day_date_data:'' }}
                  ，贡献{{contribution_day_number_data?contribution_day_number_data:0}}次
                </span>
              </div>
            </div>

          </div>

          <div   v-if="select_contribution_year" style="width: 100%; padding: 2px;">
            <Waterfall :parentPageArticleListData="last_month_article_list_data" :isLoading="is_loading_contribution_article_list_data"></Waterfall>
          </div>
        
          
          <!-- 动态栏 结束 -->
          <!-- <Waterfall></Waterfall> -->
        
        </div>

   

  </transition>
</div>
  </div>
  </template>
  
  <script setup>
  import { ref, reactive,onMounted, provide,inject,watch,onUnmounted} from "vue";
  import WebsiteContentCount from '@/components/website_content_count.vue';  
  import WebsiteRunTime from '@/components/website_run_time.vue';
  import ContributionCalendar from '@/components/contribution_calendar.vue';
  import TagCount from '@/components/tag_count.vue';
  import Waterfall from '@/components/waterfall.vue';
  import YearDropdown from '@/components/year_dropdown.vue';
  import Skeleton from '@/components/skeleton.vue';
  import {useRoute, useRouter } from "vue-router"; 
  
  const $getData = inject('$getData');
const $postDta = inject('$postDta');
const $message = inject('$message');

  const router = useRouter();
  const route = useRoute();

  const is_loading=ref(true)
  const contribution_day_month_data =ref();
  const contribution_day_date_data =ref();
  const contribution_day_number_data =ref();
  const current_year_contribution_data=ref();
  const last_year_contribution_count=ref();
  const current_year_month=ref();
  const last_month_article_list_data=ref();
  const is_selected_data=ref();


  const data = reactive(   
{
      page_head_title:"归档",
      page_head_keyword:"关键字",
      page_head_description:"描述归档",
      website_creation_time:"2023-01-01T00:00:00",
      
    }
  );

  const website_content_count_data=ref([]);
  const tag_count_data=ref([]);
  const contribution_calendar_count_data=ref([]);


  const select_contribution_year =ref(2024);
  const year_dropdown_page_update_year =ref(2024);
  provide('contributionYear', select_contribution_year);//父传子，默认选中当年年份
  

  provide('yearDropdownPageUpdateYear', year_dropdown_page_update_year);//父传子，默认选中当年年份



// 注入来自layout页面（公共）提供修改当前选中标签id的方法
   const updateCurrentActiveTagIdFunction = inject('updateCurrentActiveTagIdFunction');


  const is_loading_contribution_article_list_data=ref(true);

  onMounted(() => {
    // 假设JSON文件与组件在同一目录下
    // import('./mock-data.json').then(res => {
    //   items.value = res;
    // }).catch(error => {
    //   $message('请求未找到', 'error');
    // });
    
    // 如果你想使用axios来模拟请求，可以这样做
    $getData('/data/frontend/archives.json')
      .then(response => {

        website_content_count_data.value=response.website_content_count_data;
        tag_count_data.value=response.tag_count_data;
        contribution_calendar_count_data.value=response.contribution_calendar_count_data;

        current_year_contribution_data.value= contribution_calendar_count_data.value.current_year_contribution_data;
        last_year_contribution_count.value=contribution_calendar_count_data.value.last_year_contribution_count;
        select_contribution_year.value=contribution_calendar_count_data.value.current_year;
        year_dropdown_page_update_year.value=contribution_calendar_count_data.value.current_year;

        current_year_month.value=contribution_calendar_count_data.value.current_year_month;
        last_month_article_list_data.value=contribution_calendar_count_data.value.last_month_article_list_data;
        
       
        is_loading.value=false;
        is_loading_contribution_article_list_data.value=false;
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


	//   fetchTag();
  });




  // provide('parentPageCurrentYearContributionData', current_year_contribution_data.value);//父传子，默认选中当年年份

    
  //获取点击年份的贡献数据（获取年贡献信息）
  function getClickYearContributionData(active_year){
    is_loading_contribution_article_list_data.value=true;
    is_selected_data.value=false;
    
    year_dropdown_page_update_year.value=active_year;
   
    $postDta('/data/frontend/contribution_year_'+active_year+'.json')
      .then(response => {
    
       current_year_contribution_data.value=response.current_year_contribution_data;
        last_year_contribution_count.value=response.last_year_contribution_count;
        last_month_article_list_data.value=response.last_month_article_list_data;
        is_loading_contribution_article_list_data.value=false;
        // setTimeout(() => {
          // console.log('current_year_contribution_data:',JSON.stringify(current_year_contribution_data.value)); 
        // }, 3000); // 假设加载时间是3秒
      })
      .catch(error => {
        $message('请求未找到', 'error');
      });

  }
 
  //获取选中日期贡献信息（由contribution_calendar子组件发到父组件的点击贡献图某日数据）
  function clickContributionDay(contribution_day_year,contribution_day_month,contribution_day_date,contribution_day_number,active_today_contribution_id,is_selected){
    
    is_loading_contribution_article_list_data.value=true;
    
    
    // console.log('is_loading_contribution_article_list_data.value:',is_loading_contribution_article_list_data.value);

    is_selected_data.value=is_selected;
    // console.log('contribution_day_year：',contribution_day_year,',contribution_day_month:',contribution_day_month,',contribution_day_date:',contribution_day_date,',contribution_day_date:',contribution_day_number)
    if(is_selected==true){
      select_contribution_year.value=contribution_day_year;
      contribution_day_month_data.value =contribution_day_month;
      contribution_day_date_data.value =contribution_day_date;
      contribution_day_number_data.value =contribution_day_number;
      
      // console.log('contribution_day_number_data.value:',contribution_day_number_data.value);
      
      $postDta('/data/frontend/click_contribution_day.json')
      .then(response => {
       
        last_month_article_list_data.value=response.contribution_article_list_data;
        last_year_contribution_count.value=response.last_year_contribution_count;
       
        is_loading_contribution_article_list_data.value=false;
  
        // console.log('last_month_article_list_data:',last_month_article_list_data.value)
        // setTimeout(() => {
          // console.log('current_year_contribution_data:',JSON.stringify(current_year_contribution_data.value)); 
        // }, 3000); // 假设加载时间是3秒
      })
      .catch(error => {
        $message('请求未找到', 'error');
      });

    }else{
      select_contribution_year.value=contribution_day_year;
    }
    
 
  }


  //获取tag_count页选中标签下的博文数据
  function getTagCountPageClickTagArticleData(active_tag_menu_name,active_tag_id,active_tag_name){
    //使用来自layout页面（公共）提供修改当前选中标签id的方法修改选中标签id值，用于菜单栏页（导航栏）获取选中标签id数据来添加选中样式
    updateCurrentActiveTagIdFunction(active_tag_id); 
    //跳转到标签所属的菜单栏页
    router.push({ name: active_tag_menu_name, query: { tag_id: active_tag_name }, key: new Date().getTime() });
 

  }
  
  

  </script>
  
  <style scoped>

  .archives-skeleton{
    padding: 0 12px;
  }



  .feeds-page {
    height: 100vh;
    overflow-x: hidden;/* 禁止容器x轴方向滚动 */
    overflow-y: auto;
  
  }
  .archives-container {
      overflow-x: hidden;/* 禁止容器x轴方向滚动 */
      display: flex;
      flex-direction: column;
      padding: 0 12px;
      padding-top: 72px;
      width: 100%;
        h2 {
          width: 100%;
         /* max-width:1260px;*/
          border-bottom: 3px solid #2ECC71;
        }
   

        .website-content-count{
          width: 100%;
         /* max-width:1260px;*/
          user-select: none;
          -webkit-user-select: none;
          align-items: center;
          justify-content: center;
          .website-content-count-content{
            padding: 20px;
            
          }
        }
  
        .run-time-count{
          width: 100%;
         /* max-width:1260px;*/
          /* box-sizing: border-box; */

          user-select: none;
          -webkit-user-select: none;
          align-items: center;
          justify-content: center;
          .run-time-count-content{
            padding: 20px 
          }
        }
  

        .tag-count{
          width: 100%;
         /* max-width:1260px;*/
          user-select: none;
          -webkit-user-select: none;
          align-items: center;
          justify-content: center;
          .tag-count-content{
            padding: 20px;
            /* box-sizing: border-box; */
          }

        }
        
       
        .contribution-calendar-count{
          width: 100%;
         /* max-width:1260px;*/
          user-select: none;
          -webkit-user-select: none;
          align-items: center;
          justify-content: center;
          .contribution-calendar-count-content{
            padding: 20px;
            overflow: hidden;
          }
        }

 
    }


    /* 动态栏 开始*/
    .contribution-activity-count ,.active-tag-count {
        display: flex;
        width: 100%;
       /* max-width:1260px;*/
        user-select: none;
        -webkit-user-select: none;
        align-items: center;
        justify-content: center;
        
        .contribution-activity-count-content,.active-tag-count-content {
          display: flex;
          align-items: center;
          padding: 20px;
          width: 100%;

          .text-left {
            text-align: left;
            margin-right: 10px; /* 可根据需要调整间距 */
          }
          
          .line {
            flex-grow: 1; /* 占据中间的空白部分 */
            border-top: var(--borderWidth-thin, 1px) solid var(--borderColor-default) !important; /* 横线样式 */
            margin: 0 10px; /* 可根据需要调整间距 */
          }
          
          .text-right {
            text-align: right;
            margin-left: 10px; /* 可根据需要调整间距 */
          }

       
        }  

  }

/* 动态栏 结束*/

  /* 骨架屏缩放动画 */
  .scale-down-enter-active, .scale-down-leave-active {
  transition: all 0.8s ease;
}
 
.scale-down-enter-from, .scale-down-leave-to {
  opacity: 0;
  transform: scale(0.8);
} 

</style>
  