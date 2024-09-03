<style>

    .container-card{
      display: flex;
      max-width: 100%;
      /* justify-content: space-between; 左右两端对齐 */
    }
    
      .graph {
        display: grid;
        grid-template-columns: repeat(53, 21px);  /*竖向53列，21px宽*/
        grid-template-rows: repeat(7, 21px);     /*横向7列，21px宽*/
        padding-inline-start: 0px;
        grid-auto-flow: column;               /*生成7*53的格子后，设置为竖向排布*/
        /* margin: 20px 20px 5px 20px; */
      }
      
      .months {
        display: grid;
        grid-template-columns: repeat(53, 21px);
        grid-template-rows: 21px;
        font-size: 8px;
        /* color: #aaa; */
        padding-inline-start: 0px;
        /* margin: 5px 20px 5px 20px; */
        
      }
    
      .contribution-calendar-label{
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        margin-right: 20px;
        /* width: 21px;
        height: 21px; */
        /* margin: 20px 20px 5px 20px; */
      }
    
      .li-label{
        width: 18px;
        height: 18px;
        list-style: none;             /*记得把list的圆点效果去掉*/
        margin: 1.5px;
        border-radius: 3px;
    
      }
      
      .li-month {
        display: inline-block;
        width: 18px;
        height: 18px;
        list-style: none;             /*记得把list的圆点效果去掉*/
        margin: 1.5px;
        border-radius: 3px;
        text-align: center;
      }
      
    .li-day {
      width: 18px;
      height: 18px;
      background-color: #eaeaea;
      list-style: none;             /*记得把list的圆点效果去掉*/
      margin: 1.5px;
      border-radius: 3px;
    }
    
    .li-day:hover {               /*添加hover强调效果*/
    
      /* filter: brightness(100%);
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 1); */
    
      -webkit-box-shadow: 1px 1px 13px #20232e, -1px -1px 13px #545b78;
      box-shadow: 1px 1px 13px #20232e, -1px -1px 13px #545b78;
      /* color: #d6d6d6; */
      -webkit-transition: 500ms;
      transition: 500ms;
    }
  
  
    /* 提示条  开始*/
    .tooltip { 
      position: relative; 
  }
  
  
    .tooltiptext {
      font-size: 10px;
      visibility: hidden;
      background-color: #282828;
      color: #f1f1f1;
      border-radius: 5px;
      padding: 5px; 
      position: absolute;
      z-index: 10000;
      bottom: 125%;
      left: 50%; 
      transform: translateX(-50%);
      opacity: 0;
      transition: opacity 0.3s;
      text-align: center;
      text-decoration: none;
      text-shadow: none;
      text-transform: none;
      letter-spacing: normal;
      word-wrap: break-word;
      white-space: pre;
      pointer-events: none;
  }
  
  .tooltip:hover .tooltiptext {
    visibility: visible; 
    opacity: 1;
  }
  
  .tooltip .tooltiptext::after {
    content: "";
    position: absolute;
     top: 100%;
    left: 50%;
    border-width: 8px;
    border-style: solid;
    border-color: #28282817 transparent transparent transparent;
    transform: translateX(-50%);
  }
  
  
  /* 提示条  结束*/
    
    .active {    
      outline: none;      
      opacity: .8 !important;
      -webkit-box-shadow: 1px 1px 13px #20232e, -1px -1px 33px #545b78;
      box-shadow: 1px 1px 13px #20232e, -1px -1px 33px #545b78;
      /* color: #d6d6d6; */
      -webkit-transition: 100ms;
      transition: 100ms;
    }
    
    .no-active{
      opacity: .3 !important;
    }
    
     [data-level="0"] {
      fill:#ebedf0;
      background-color: #ebedf0;
      outline: 1px solid rgba(27, 31, 35, 0.06);
    }
    
     [data-level="1"] {
      fill: #9be9a8;
      background-color: #9be9a8;
      outline: 1px solid rgba(27, 31, 35, 0.06);
    }
    
    [data-level="2"] {
      fill:#40c463;
      background-color: #40c463;
      outline: 1px solid rgba(27, 31, 35, 0.06);
    }
    
     [data-level="3"] {
      fill:#30a14e;
      background-color: #30a14e;
      outline: 1px solid rgba(27, 31, 35, 0.06);
    }
    
    [data-level="4"] {
      fill:#216e39;
      background-color: #216e39;
      outline: 1px solid rgba(27, 31, 35, 0.06);
    }
    
    
    .operation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
     
          .contributions_count_desc {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 200px;
     
            .contributions_count {
              width: 11px;
              margin: 0 8px;
            }
            .svg_icon{
              width: auto;
            }
          }
     
          .legend {
            display: flex;
            justify-content:center;
            align-items: center;
     
            .level-desc {
              margin-right: 6px;
              margin-left: 3px;
            }
     
            .level {
              margin-right: 3px;
              width: 11px;
              height: 11px;
            }
    
          }
    }
    
    /* 没有悬停变白色  悬停保留原来颜氏*/
    .no-hover-level {
      cursor: pointer;  
      box-shadow:
                inset 18px 18px 30px rgba(0, 0, 0, 0.1),  
                inset -18px -18px 30px rgba(255, 255, 255, 1),
                0 0 0 rgba(0, 0, 0, 0.2),  
                0 0 0 rgba(255, 255, 255, 0.8),  
                inset 18px 18px 30px rgba(0, 0, 0, 0.1),  
                inset -18px -18px 30px rgba(255, 255, 255, 1);  
    }
    
</style>
    
<template>
  
      <div style="padding-top: 200px;"></div>
      <div class="container-card">
    
        <div style="display: flex;">
          <ul class="contribution-calendar-label">
            <li class="li-label">日</li>
            <li class="li-label">一</li>
            <li class="li-label">二</li>
            <li class="li-label">三</li>
            <li class="li-label">四</li>
            <li class="li-label">五</li>
            <li class="li-label">六</li>
          </ul>
        </div>
       
        <div style="margin-right: auto;">
            <!-- 月份 开始-->
            <ul class="months">
              <li class="li-month" v-for="(item,index) in data.monthBar" :data-month="index" :key="index"><span>{{item}}</span></li>
            </ul>
            <!-- 月份 结束-->
            <!--  开始-->
            <ul class="graph">
             
                <div class="item tooltip" v-for="(item, index) in data.infos" :key="index">
      
                  <div v-if="item != undefined">
                    <li  
                      :data-level="item.level"  :data-years="item.year" :data-date="item.date"  :data-date-number="item.date_number"  :data-selected="item.id===data.active_id?true:false"       
                      :class="{'li-day':true,'no-hover-level':data.hoverLevel!=-1&&item.level!=data.hoverLevel ,'active':item.id===data.active_id,'no-active':data.is_selected==true&&item.id!=data.active_id}"  
                      @click="handleClick(item)">
                    
                    </li>
                  
                    <span class="tooltiptext">{{ item.year }} - {{ item.month }} -{{item.date}} : {{item.number}}次贡献</span>
                  </div>
                </div>


            </ul>
    
            <div class="operation">
              <div class="contributions_count_desc">
                <div class="contributions_count">0</div>
                  <svg-icon class="svg_icon" icon-class="jindutiao" />
                <div class="contributions_count">5+</div>
              </div>
              <div class="legend">
                <div class="level-desc">少</div>
               
                   
                <div  v-if="data.is_selected == false"  class="level" @mouseover="data.hoverLevel = index" @mouseout="data.hoverLevel = -1" v-for="(item, index)  in 5"
                   :data-level="index">
                  </div>
    
                  <div  v-else  class="level no-active"  v-for="(item, index)  in 5" 
                   :data-level="index">
                  </div>
    
    
    
                <div class="level-desc">多</div>
              </div>
            </div>
    
           
    
        </div>
      
       
      </div>
</template>
     
<script setup>

import {onMounted,onUnmounted,ref,reactive} from "vue";



 
const data=reactive( 
  {
          
          infos: [],  //存放每一天的数据（year，month，date，状态数量，isToday标记）
          current: {  //存放今天的年月日
            year: "",  
            month: "",
            date: "",
          },
          blank_grid:0,//空白占位格
          hoverLevel:-1,//等级高亮
          is_selected:false,//是否开启选择模式
          active_id:-1,//已选中id
          monthBar: ["", "", "", "", "", "", "", "", "", "", "", ""],//12列对应的月份，比如第三列开始是五月份，则令monthBar[2]="5月"，算法实现见下面method
          
        
      }
);

            
const props = defineProps({
    //年贡献结束时间
    contribution_activities_endtime : {
    default: '2024-12-31',//2023-12-31
    type: String
  }
})
     
          
          // 获取当前日期
          const todays = props.contribution_activities_endtime ? new Date(props.contribution_activities_endtime) : new Date();
          
          // 获取当前年份
          const currentYear = todays.getFullYear();
            
          // 设置为上一年的今天
          const lastYearToday = new Date(currentYear - 1, todays.getMonth(), todays.getDate());
            
          // 初始日期（上年临近的星期天）
          let firstMondayDate = getNextSunday(lastYearToday.toISOString().split('T')[0]);
          
          // console.log('firstMondayDate:',firstMondayDate.toISOString().split('T')[0])
          

          // 计算天数差值加1(今天) 向下取整
          var daysDifference =  Math.floor((todays - firstMondayDate) / (1000 * 60 * 60 * 24)) +1;
            
          console.log('daysDifference:',daysDifference); // 输出从初始日期到今天的天数

          let start_day_number=0;//第一个格子开始天
          
          if(props.contribution_activities_endtime){//按年统计贡献contribution_activities_endtime 
            start_day_number=1;
          }

 

          let info = {};         //用来存放某一天的数据对象（年月日、isToday、level）      
          let month = "";        //后续计算某月第一天在哪一列用，表示第几月
          let weekOfMonth = ""   //后续计算某月第一天在哪一列用，表示第几列

         
          //天数用于推算月份
          let date_number_key=[];
          let date_number_key_info_data= {};


      
          /**
          *前提：Date对象通过setDate()设置到某一天的年月日，例如setDate(1)就是设置日期月本月1号
          *假如i = 0,今天是20241231日，那么第1列第1格为本日的前366天，则那天的日期设置为(pastDate + i)=setDate(31+0=31)，最后就能获得那一天的年月日对象，再获得年月日数值。 
          *0 367第一个格子的时间：上一年今天。倒查   上一年今天至今天    
          *1 366第一个格子的时间：减去上一年今天。上一年第一天至上一年最后一天（按年统计贡献contribution_activities_endtime）  
          *start_day_number=0  i序号: 0 ,年月日: 2023 12 31 ===> i序号: 366 ,年月日: 2024 12 31   daysDifference: 367
          *start_day_number=1  i序号: 1 ,年月日: 2024 01 01 ===> i序号: 366 ,年月日: 2024 12 31   daysDifference: 367
          */
         console.log('start_day_number',start_day_number)
          for ( let i = 1; i <daysDifference; i++) { 
            // 创建一个新的日期对象           //let i = 364; i >=0 ; i--    倒推序号: 364 ,年月日: 2023 09 03   倒推序号: 0 ,年月日: 2024 09 01 
            const pastDate = new Date(firstMondayDate);
            // 将日期顺推
            pastDate.setDate(pastDate.getDate() +i);
            
            // console.log('pastDate.getDate():',  pastDate.setDate(pastDate.getDate() +i))
   
            // 格式化日期为YYYY-MM-DD
            const year = pastDate.getFullYear();
            const month = (pastDate.getMonth() + 1).toString().padStart(2, '0');
            const day = pastDate.getDate().toString().padStart(2, '0');

            // console.log('i序号:',i,',年月日:',year,month,day);


            let level = Math.floor(Math.random() * 5); //这里是随机设置每天的频率等级，后续开发要替换为自己计算的真实等级（不同等级对应不同颜色方格）

            info = {                      //每个格子（天）的info对象
              year: year,      //年月日
              month: month,
              date: day,
              number: i,    //今日的数据量
              level: level,  //今日数据量对应的等级
              date_number: i,    //天数
              id:i,
            };

            date_number_key_info_data={
              month: month,
              date: day,
            }

            date_number_key.push(date_number_key_info_data);

            // 倒推序号: 364 ,年月日: 2021 01 01  倒推序号: 364 修改为 数组索引0  ,年月日: 2021 01 01
            // 倒推序号: 0 ,年月日: 2021 12 31    倒推序号: 0   修改为 数组索引364  ,年月日: 2021 01 01
            data.infos.push(info); //push数组末尾添加

          }





            console.log('data.infos:',data.infos.length)


          if(data.infos){
            // console.log('data.infos:',JSON.stringify(data.infos))
            let [firstElement] =data.infos; //使用解构赋值取得第一个元素；

            // console.log('firstElement:',JSON.stringify(firstElement));
            //firstElement: [{"year":2023,"month":8,"date":27,"number":10,"level":2,"isToday":false}]
            //获取天数的星期数，以进行后续计算（周日返回0，周一返回1，周六返回6）
            let first_element_week = new Date(firstElement.year+'-'+firstElement.month+'-'+firstElement.date).getDay();
            // console.log('first_element_week:'+Object(first_element_week));
            if(first_element_week!=0){//处理第一个元素的星期数非星期日，需补位。如第一个元素的星期数是6，那么需补6个占位格
              // data.blank_grid=first_element_week;


              // 创建一个新数组，包含n个空元素 n=第一天星期数
              let newArray = new Array(first_element_week);
              // console.log(' data.infos', data.infos);
              // 将原始数组和新添加的空元素合并
              // data.infos = newArray.concat(data.infos); //页面显示 判断元素非undefined禁止空元素渲染
              data.infos = newArray.concat(data.infos);

              // 将计算月份数组和新添加的空元素合并
              date_number_key=newArray.concat(date_number_key);

              // console.log('newArray.concat(date_number_key):',JSON.stringify(date_number_key))
              //切割数组,每7天为一组

              let date_number_key_spArr= spArr(date_number_key,7);


              //获取每月第一天出现的列数
              date_number_key_spArr.map((element, index) => {
              // console.log('53列数据:',index, element); // 打印下标和元素
                element.map((item_element, item_index) => { 
                  // console.log('每天数据:',item_index, item_element); // 打印下标和元素
                  if(item_element.date && item_element.date==1){
                    // console.log('列:',index,',月:',item_element.month.replace(/^0+/, ''));//用正则把月份的0替换空
                    if(index!=53){
                      data.monthBar[index] = item_element.month.replace(/^0+/, '') + "月";
                      // console.log('列:',index,',月:',item_element.month.replace(/^0+/, ''));//用正则把月份的0替换空
                    }
                  }

                });

              });   

            }else{
              // date_number_key.reverse() reverse()方法来颠倒数组的元素顺序。
              // console.log('date_number_key:',date_number_key.reverse());
              // let date_number_key_reverse=date_number_key.reverse();
              let date_number_key_spArr= spArr(date_number_key,7);

              //获取每月第一天出现的列数
              date_number_key_spArr.map((element, index) => {
                // console.log('53列数据:',index, element); // 打印下标和元素
                element.map((item_element, item_index) => { 
                  // console.log('每天数据:',item_index, item_element); // 打印下标和元素
                  if(item_element.date && item_element.date==1){
                    // console.log('date_number_key_spArr.l:',date_number_key)
                    // console.log('列:',index,',月:',item_element.month.replace(/^0+/, ''));//用正则把月份的0替换空
                    if(index!=53){
                      data.monthBar[index] = item_element.month.replace(/^0+/, '') + "月";
                      // console.log('列:',index,',月:',item_element.month.replace(/^0+/, ''));//用正则把月份的0替换空
                    }
                    
                  }
                
                });

              });
            // console.log('date_number_key_reverse_one:',date_number_key_reverse_one);

            } 

          }
     

    
    
   

            //获取下周周日  周日0 => 周六6
            function getNextSunday (today) {
            //   const now = new Date('2023-09-01');
                const now = new Date(today);
              // 获取当前周的星期日（0代表星期日）
              const dayOfWeek = now.getDay() || 7;
              // 计算从今天开始到下周星期日的毫秒数
            //   console.log('dayOfWeek',dayOfWeek);
              const millisecondsUntilNextSunday = (7 - dayOfWeek) * 24 * 60 * 60 * 1000;
            //   console.log('millisecondsUntilNextSunday',millisecondsUntilNextSunday);

              // 创建下周星期日的Date对象
              const nextSunday = new Date(now.getTime() + millisecondsUntilNextSunday);

              // 格式化日期为YYYY-MM-DD
            //   return nextSunday.toISOString().split('T')[0];
                // console.log('nextSunday.toISOString().split(T)[0]:',nextSunday.toISOString().split('T')[0]);
                return nextSunday;
            }


            //分割的数组
            function spArr(arr, num) { //arr是你要分割的数组，num是以几个为一组
            let newArr = [] //首先创建一个新的空数组。用来存放分割好的数组
            for (let i = 0; i < arr.length;) { //注意：这里与for循环不太一样的是，没有i++
              newArr.push(arr.slice(i, i += num));
            }
            return newArr
          }

           //计算数组维度
          function printDataDimensions (arr) {
            let maxDepth = 0;
          
            function calculateDepth(arr, currentDepth) {
              currentDepth++;
              maxDepth = Math.max(maxDepth, currentDepth);
              arr.forEach(item => {
                if (Array.isArray(item)) {
                  calculateDepth(item, currentDepth);
                }
              });
            }
          
            calculateDepth(arr, 0);
            console.log(`数组的维数是: ${maxDepth}`);
          }

          
          // 分割数组
          //  changeArrNum:function(arr,num){
          //     let newCardList = [];
          //     for (var i = 0; i < arr.length; i += num) {
          //         newCardList.push(arr.slice(i, i + num));
          //     }
          //     return newCardList;
          // },


    
           function  handleClick(item) {
            
            
            if(data.active_id==item.id){
              data.active_id=-1;
              data.is_selected=false;
            }else{
              data.active_id=item.id;
              data.is_selected=true;
            }
            // console.log('item:', JSON.stringify(item));
           
            // {"year":2023,"month":11,"date":18,"number":10,"level":0,"isToday":false}
            // alert(item.month + "-" + item.date+'，博文：'+item.number)
          }
    
    
    
       
      
    </script>
    