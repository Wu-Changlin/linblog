<template>

  <div class="feeds-page">
    <div class="feeds-container">
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
      <div class="tag-count-content">
        <TagCount @child-click-tag="clickTag"></TagCount>
       
      </div>
      <!-- 标签统计栏 结束-->
      <!-- 点击标签结果栏 开始-->
       <div v-if="tag_name">
        <div  class="contribution-activity">
          <div class="text-left"> <h3>标签：{{tag_name}} </h3></div>
          <div class="line"></div>
          <div class="text-right"> <span>结果：找到{{ tag_number}}个</span></div>
        </div>
        <Waterfall></Waterfall>
       </div>
      
      <!-- 点击标签结果栏 开始-->
  
      <!-- 贡献统计栏 开始-->
      <h2>贡献</h2>
      <div class="contribution-calendar-count-content">
        <ContributionCalendar @child-click-contribution-day="clickContributionDay"></ContributionCalendar>
      </div>
      <!-- 贡献统计栏 结束-->
  
      <!-- 动态栏 开始-->
    
      <div v-if="select_contribution_year">
        <div  class="contribution-activity">
          <div class="text-left"> <h3>动态 </h3></div>
          <div class="line"></div>
          <div class="text-right"> 
            <span v-if="!is_selected_data">
              {{ select_contribution_year}} 
            </span>
            <span v-if="is_selected_data==true">
              {{ select_contribution_year}} 
              -{{contribution_day_month_data?contribution_day_month_data:'' }}
              -{{contribution_day_date_data?contribution_day_date_data:'' }}
              ,贡献{{contribution_day_number_data?contribution_day_number_data:''}}次
            </span>
          </div>
        </div>
        <Waterfall></Waterfall>
      </div>
       <!-- 动态栏 结束 -->
       <!-- <Waterfall></Waterfall> -->
      
  
    </div>
   
  
   
  </div>

  
  
  <div style="margin-bottom:100px"></div>
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
  
  provide('contributionYear', select_contribution_year)
  
   
  let stopWatch = null;
   
  // 设置一个watch监听器
  stopWatch = watch(select_contribution_year, (newValue, oldValue) => {
    watchselect_contribution_year(oldValue,newValue)
  });
  
  // 组件销毁前清除watch
  onUnmounted(() => {
    stopWatch(); // 如果watch返回了一个停止监听的函数，调用它
  });
  
  
  function watchselect_contribution_year(oldValue,newValue){
    // console.log(`select_contribution_year from ${oldValue} to ${newValue}`);
  }
  



  let contribution_day_month_data =ref();
  let contribution_day_date_data =ref();
  let contribution_day_number_data =ref();
  let is_selected_data=ref();
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
  
  <style>
  



.contribution-activity {
  display: flex;
  align-items: center; /* 纵向居中 */
}
 
.text-left {
  order: -1; /* 确保左侧文本在左侧显示 */
  margin-right: 10px; /* 左侧文本和横线之间的间隔 */
}
 
.line {
  border-top: var(--borderWidth-thin, 1px) solid var(--borderColor-default) !important; /* 横线样式 */
  flex-grow: 1; /* 横线拉伸以占据剩余空间 */
  margin: 0 10px; /* 横线两侧的间隔 */
}
 
.text-right {
  order: 1; /* 确保右侧文本在右侧显示 */
  margin-left: 10px; /* 右侧文本与容器右边缘的间隔 */
}




  .feeds-page {
    display: flex;
    padding-top: 72px;
    width: 100%;
    margin: 0px 0px;
    padding-left: 12px;
    padding-right: 12px;
   
    /* 修改盒子大小属性 */
    /* box-sizing: border-box; */
   
    .feeds-container {
      display: flex;
      flex-direction: column;
      transition: width 0.5s;
      margin: 0 auto;
      width: 100%;
  
  
        h2 {
          border-bottom: 3px solid #2ECC71;
        }
   

        .website-content-count{
          width: 100%;
          box-sizing: border-box;
          .website-content-count-content{
            padding: 20px;
            
          }
        }
  
        .run-time-count{
          width: 100%;
          max-width:1280px;
          box-sizing: border-box;
          .run-time-count-content{
            padding: 20px 
          }
        }
  
          
        .tag-count-content{
          padding: 20px;
          width: 100%;
          
          max-width:1280px;
          box-sizing: border-box;
      
        }
       
        .contribution-calendar-count-content{
          width: 100%;
          padding: 20px;
          max-width:1280px;
          box-sizing: border-box;
          overflow: hidden;
          /* display: flex;
          overflow-x: scroll;
          overflow-y: hidden;
            .container-card::-webkit-scrollbar {
              display: none;
          } */
        }
  
        .contribution-activity{
          width: 100%;
          padding: 20px;
          display: flex;
          box-sizing: border-box;
        }
  
       
  
      }
  
  
    }
  </style>
  