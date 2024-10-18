<template>
  <div>

  </div>
</template>


<script setup>
  import { sloarToLunar } from "@/hooks/sloarToLunar.js";


  // 创建一个新的Date对象，默认为当前日期和时间
  const now = new Date();

  // 获取年份
  const year = now.getFullYear();

  // 获取月份（0-11，0表示1月，所以需要加1）
  const month = now.getMonth() + 1;

  // 获取日（1-31）
  const day = now.getDate();

  // 获取小时（0-23）
  const hours = now.getHours();

  // 输出结果
  console.log(`年: ${year}`);
  console.log(`月: ${month}`);
  console.log(`日: ${day}`);
  console.log(`时: ${hours}`);

  // 直接调用
  console.log('2024, 12, 31  15:', sloarToLunar(2024, 12, 31,15));
  console.log('2024, 10 18 23 :', sloarToLunar(2024, 10, 18,23));

  console.log('2024, 1 18 20 :', sloarToLunar(2024, 1, 18,20));


  console.log('2018, 9, 17  3:', sloarToLunar(2018, 9, 17,3));
  console.log('2017, 7, 24 0:', sloarToLunar(2017, 7, 24,0));



  function getChineseHour(hour) {
    const hours = hour ? hour: new Date().getHours();
    const zodiacHours = [
        { name: '子时', start: 23, end: 1 },
        { name: '丑时', start: 1, end: 3 },
        { name: '寅时', start: 3, end: 5 },
        { name: '卯时', start: 5, end: 7 },
        { name: '辰时', start: 7, end: 9 },
        { name: '巳时', start: 9, end: 11 },
        { name: '午时', start: 11, end: 13 },
        { name: '未时', start: 13, end: 15 },
        { name: '申时', start: 15, end: 17 },
        { name: '酉时', start: 17, end: 19 },
        { name: '戌时', start: 19, end: 21 },
        { name: '亥时', start: 21, end: 23 }
    ];
 
    let currentHourName = '';
    zodiacHours.forEach(hour => {
        if (hours >= hour.start && hours < hour.end) {
            currentHourName = hour.name;
        }
    });
 
    const hourOfZodiac = hours % 12 || 12; // 计算当前时刻属于十二时辰中的哪个时刻
    return `${currentHourName} (${hourOfZodiac}时)`;
}
 
console.log(getChineseHour()); // 输出形如：" teen (9时)"

console.log(getChineseHour(0)); // 输出形如：" teen (9时)"
console.log(getChineseHour(1)); // 输出形如：" teen (9时)"
console.log(getChineseHour(2)); // 输出形如：" teen (9时)"
console.log(getChineseHour(2.9)); // 输出形如：" teen (9时)"
console.log(getChineseHour(4)); // 输出形如：" teen (9时)"
console.log(getChineseHour(5)); // 输出形如：" teen (9时)"
console.log(getChineseHour(6)); // 输出形如：" teen (9时)"
console.log(getChineseHour(7)); // 输出形如：" teen (9时)"
console.log(getChineseHour(8)); // 输出形如：" teen (9时)"
console.log(getChineseHour(9)); // 输出形如：" teen (9时)"
console.log(getChineseHour(10)); // 输出形如：" teen (9时)"
console.log(getChineseHour(11)); // 输出形如：" teen (9时)"
console.log(getChineseHour(12)); // 输出形如：" teen (9时)"
console.log(getChineseHour(13)); // 输出形如：" teen (9时)"

console.log(getChineseHour(23)); // 输出形如：" teen (9时)"



</script>