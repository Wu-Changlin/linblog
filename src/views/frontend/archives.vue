<template>

<div class="feeds-page">
  <div class="feeds-container">
    <h2>网站统计</h2>
    <div class="website-count-info">
      <div class="website-content-count">
      <p>内容统计：</p>
      <table>
          <thead>
              <tr>
                  <th align="center">分类</th>
                  <th align="center">标签</th>
                  <th align="center">文章</th>
                  <th align="center">字数</th>
                  <th align="center">阅读</th>
                  <th align="center">评论</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td align="center">
                      6                        </td>
                  <td align="center">
                      72                        </td>
                  <td align="center">
                      240                        </td>
                  <td align="center" id="totalWordCount">691980</td>
                  <td align="center">
                      4321375                        </td>
                  <td align="center">
                      1938                        </td>
              </tr>
          </tbody>
      </table>
    </div>
        <!-- 运行时间 开始-->
      <div class="run-time-count">
        
        <p>本站已运行：</p>
        <div class="run-time-count-content">
            <span class="day">2615</span> <strong>:</strong>
            <span class="hour">03</span> <strong>:</strong>
            <span class="minute">04</span> <strong>:</strong>
            <span class="second">32</span>
        </div>


      </div>
        <!-- 运行时间 结束-->
      
    </div>



  </div>

  <ContributionCalendar></ContributionCalendar>
</div>
</template>

<script setup>
import ContributionCalendar from '@/components/contribution_calendar.vue'
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


        .website-count-info{
          display: flex;
          .website-content-count{
            width: 100%;
            
            max-width: 600px;
            table {
              max-width: 100%;
              padding: 20px 90px;
              /* margin: 20px 10px  20px 90px; */
              border-collapse: collapse;
              border-spacing: 0;
              margin-bottom: 1.5em;
              font-size: .96em;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              display: block;
              word-break: normal;
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
            }


            thead {
              background-color: var(--website-count-info_thead)
            }


            td, th {
              border-color: var(--website-count-info_td_th);
              text-align: left;
              padding: 4px 8px 4px 10px;
              border: 1px solid #dadada
            }


          }



            .run-time-count{
              margin-right: auto;
              width: 100%;
              max-width: 100%;
              .run-time-count-content{
                
                padding: 20px 90px;
              }
            }

        }

     





    }


  }
</style>
