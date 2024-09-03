<template>
    <div style="padding-top: 200px;">
        资源
    </div>

    <CntentList></CntentList>
</template>


<script setup>
import CntentList from "@/components/content_list.vue";



//获取下周周日  周日0 => 周六6
function getNextSunday(today) {
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





         // 获取当前日期
         const todays = new Date();
 
 // 获取当前年份
 const currentYear = todays.getFullYear();
  
 // 设置为上一年的今天
 const lastYearToday = new Date(currentYear - 1, todays.getMonth(), todays.getDate());
  


  // 初始日期（上年临近的星期天）
  let firstMondayDate = getNextSunday(lastYearToday.toISOString().split('T')[0]);
  console.log('firstMondayDate:',firstMondayDate.toISOString().split('T')[0])

 let d = new Date() ;

 // 计算天数差值 向下取整
var daysDifference =  Math.floor((d - firstMondayDate) / (1000 * 60 * 60 * 24));
 
//  console.log('daysDifference:',daysDifference); // 输出从初始日期到今天的天数

 


let info={};
let date_number_key=[];
// const year_day_number=365;
// year_day_number=year_day_number-1;//实际循环天数
for ( let i = 1; i <=daysDifference; i++) { 
    // 创建一个新的日期对象           //let i = 364; i >=0 ; i--    倒推序号: 364 ,年月日: 2023 09 03   倒推序号: 0 ,年月日: 2024 09 01 
    const pastDate = new Date(firstMondayDate);
        // 将日期倒推i天
        pastDate.setDate(pastDate.getDate() +i);

        // 格式化日期为YYYY-MM-DD
        const year = pastDate.getFullYear();
        const month = (pastDate.getMonth() + 1).toString().padStart(2, '0');
        const day = pastDate.getDate().toString().padStart(2, '0');
        // console.log('倒推序号:',i,',年月日:',year,month,day);

        let level = Math.floor(Math.random() * 5); 
        //这里是随机设置每天的频率等级，后续开发要替换为自己计算的真实等级（不同等级对应不同颜色方格）

        info = {                      //每个格子（天）的info对象
              year: year,      //年月日
              month: month,
              date: day,
              number: i,    //今日的数据量
              level: level,  //今日数据量对应的等级
              date_number: i,    //天数
            };
        
            date_number_key.push(info);

            // 倒推序号: 364 ,年月日: 2021 01 01  倒推序号: 364 修改为 数组索引0  ,年月日: 2021 01 01
            // 倒推序号: 0 ,年月日: 2021 12 31    倒推序号: 0   修改为 数组索引364  ,年月日: 2021 01 01
    
}

console.log('date_number_key:',JSON.stringify(date_number_key))
</script>