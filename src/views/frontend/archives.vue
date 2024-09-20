<template>

  <div class="archives-page">
    <div class="archives-container">
      <!-- 网站统计栏 开始-->
      <h2>网站统计</h2>
        <!-- 网站内容 开始-->
        <div class="website-content-count">
          <p>内容统计：</p>
       
          <div class="website-content-count-content">
            <WebsiteContentCount></WebsiteContentCount>
          </div>
  
        </div>
        <!-- 网站内容 结束-->
        <!-- 运行时间 开始-->
        <div class="run-time-count">
          
          <p>本站已运行：</p>
          <div class="run-time-count-content">
            <WebsiteRunTiem></WebsiteRunTiem>
          </div>
         
  
        </div>
        <!-- 运行时间 结束-->
      <!-- 网站统计栏 结束-->  
  
      <!-- 标签统计栏 开始-->
      <h2>标签</h2>
      <div class="tag-count">
        <div class="tag-count-content">
          <TagCount @child-click-tag="clickTag"></TagCount>
        </div>
      </div>
     
   
      <!-- 标签统计栏 结束-->
      <!-- 点击标签结果栏 开始-->
     
       <div v-if="tag_name" class="contribution-activity-count">
        <div  class="contribution-activity-count-content">
          <div class="text-left"> <h3>标签：{{tag_name}} </h3></div>
          <div class="line"></div>
          <div class="text-right"> <span>结果：找到{{ tag_number}}个</span></div>
        </div>
       </div>
    
      <div   v-if="tag_name" style="width: 100%;">
        <Waterfall></Waterfall>
       </div>
      
      <!-- 点击标签结果栏 结束-->
  
      <!-- 贡献统计栏 开始-->
      <h2>贡献</h2>
      <div class="contribution-calendar-count">
        <div class="contribution-calendar-count-content">
          <ContributionCalendar @child-click-contribution-day="clickContributionDay"></ContributionCalendar>
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
              {{ select_contribution_year}} 
            </span>
            <span v-if="is_selected_data==true">
                {{select_contribution_year}} 
              -{{contribution_day_month_data?contribution_day_month_data:'' }}
              -{{contribution_day_date_data?contribution_day_date_data:'' }}
              ,贡献{{contribution_day_number_data?contribution_day_number_data:''}}次
            </span>
          </div>
        </div>

      </div>

      <div   v-if="select_contribution_year" style="width: 100%; padding: 2px;">
        <Waterfall></Waterfall>
       </div>
     

       <!-- 动态栏 结束 -->
       <!-- <Waterfall></Waterfall> -->
      
  
    </div>
   
  
   
  </div>


  </template>
  
  <script setup>
  import WebsiteContentCount from '@/components/website_content_count.vue';  
  import WebsiteRunTiem from '@/components/website_run_tiem.vue';
  import ContributionCalendar from '@/components/contribution_calendar.vue';
  import TagCount from '@/components/tag_count.vue';
  import Waterfall from '@/components/waterfall.vue';
  
  
  import { ref, reactive,onMounted, provide ,watch,onUnmounted} from "vue";


  

  let tag_name=ref('');
  let tag_number=ref(0);
  // console.log('tag_name',tag_name);

  function clickTag(activity_tag_id,activity_tag_name){
    // console.log('activity_tag_id',activity_tag_id,',activity_tag_name:',activity_tag_name);
    tag_name.value=activity_tag_name;
  }
  

 const archives_contribution_year_date=ref([
        {
            contribution_year: 2024,
            contribution_year_id: 1,
        },
        {
            contribution_year: 2023,
            contribution_year_id: 2,
        },
        {
            contribution_year: 2022,
            contribution_year_id: 3,
        },
        {
            contribution_year:2021,
            contribution_year_id: 4,

        },
    ]);
  //爷组件 孙子组件传值  直接把数据传递出去给孙子传
  /* 孙组件向爷爷组件传值:
  步骤:
  
  1.爷爷先定义一个空的函数(或者是响应式数据、响应式对象)传递给孙子
  
  2.孙子使用inject接收
  
  3.孙子使用按钮等函数中调用爷爷传递过来的函数,()中传递要传递的数据
  
  3.爷爷当初定义的空函数中参数写value,获得的就是孙子传递过来的值 (或者监听响应式数据、响应式对象的变化进行下一步操作，如作为参数去请求接口)
  */
  //爷组件传值 子组件以 inject接收
  let select_contribution_year =ref(2024);
  
  provide('contributionYear', select_contribution_year);//爷传孙，默认选中当年年份
  
  provide('archivesContributionYearData', archives_contribution_year_date);//爷传孙，年份列表
  let stopWatch = null;
   
  // 设置一个watch监听器
  stopWatch = watch(select_contribution_year, (newValue, oldValue) => {
    watchselect_contribution_year(oldValue,newValue)
  });
  
  // 组件销毁前清除watch
  onUnmounted(() => {
    stopWatch(); // 如果watch返回了一个停止监听的函数，调用它
  });
  
  //获取年贡献信息
  function watchselect_contribution_year(oldValue,newValue){
    // console.log(`select_contribution_year from ${oldValue} to ${newValue}`);
  }
  
  let contribution_day_month_data =ref();
  let contribution_day_date_data =ref();
  let contribution_day_number_data =ref();
  let is_selected_data=ref();
  //获取选中日期贡献信息（由ContributionCalendar子组件发到父组件的点击贡献图某日数据）
  function clickContributionDay(contribution_day_year,contribution_day_month,contribution_day_date,contribution_day_number,is_selected){
 
    is_selected_data.value=is_selected;
    // console.log('contribution_day_year：',contribution_day_year,',contribution_day_month:',contribution_day_month,',contribution_day_date:',contribution_day_date,',contribution_day_date:',contribution_day_number)
    if(is_selected==true){
      select_contribution_year.value=contribution_day_year;
      contribution_day_month_data.value =contribution_day_month;
      contribution_day_date_data.value =contribution_day_date;
      contribution_day_number_data.value =contribution_day_number;
    }else{
      select_contribution_year.value=contribution_day_year;
    }
    
 
  }


  </script>
  
  <style scoped>
  
  .archives-page {
    overflow-x: hidden;/* 禁止容器x轴方向滚动 */
  
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
    .contribution-activity-count {
        display: flex;
        width: 100%;
       /* max-width:1260px;*/
        user-select: none;
        -webkit-user-select: none;
        align-items: center;
        justify-content: center;
        
        .contribution-activity-count-content {
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

     
</style>
  