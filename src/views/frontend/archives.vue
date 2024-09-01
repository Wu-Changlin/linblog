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
      <TagCount></TagCount>
    </div>
    <!-- 标签统计栏 开始-->

    <!-- 贡献统计栏 开始-->
    <h2>贡献</h2>
    <div class="contribution-calendar-count-content">
      <ContributionCalendar></ContributionCalendar>
    </div>
    <!-- 贡献统计栏 开始-->

    <!-- 贡献统计栏 开始-->
    <h2>结果</h2>
    <div>
      <CntentList></CntentList>
    </div>
    <!-- 贡献统计栏 开始-->

    

  </div>
 

 
</div>
</template>

<script setup>
import WebsiteContentCount from '@/components/website_content_count.vue'  
import WebsiteRunTiem from '@/components/website_run_tiem.vue'
import ContributionCalendar from '@/components/contribution_calendar.vue'
import TagCount from '@/components/tag_count.vue'
import CntentList from "@/components/content_list.vue";
</script>

<style>
  .feeds-page {
    flex: 1;
    padding-top: 72px;
    width: 100%;
    margin: 0 auto;
    padding-left: 12px;
    padding-right: 12px;
    /* 修改盒子大小属性 */
    box-sizing: border-box;
  
    .feeds-container {
      position: relative;
      transition: width 0.5s;
      margin: 0 auto;
      width: 100%;
      h2 {
        border-bottom: 3px solid #2ECC71;
      }
 
      .website-content-count{
        width: 100%;
        .website-content-count-content{
          padding: 20px;
          
        }
      }

      .run-time-count{
        width: 100%;
        max-width: 100%;
        .run-time-count-content{
          padding: 20px 
        }
      }

        
      .tag-count-content{
        padding: 20px;
        width: 100%;
        height: 100%;
        max-width:1280px;
        box-sizing: border-box;
    
      }
      .contribution-calendar-count-content{
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        /* display: flex;
        overflow-x: scroll;
        overflow-y: hidden;
          .container-card::-webkit-scrollbar {
            display: none;
        } */
      }

     

    }


  }
</style>
