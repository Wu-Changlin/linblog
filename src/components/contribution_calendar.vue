<template>

  <div class="contribution-calendar-container">
    <div class="contribution-table">

      <div class="contribution-table-container">
        <div class="contribution-table-content">
          <ul class="contribution-calendar-label">
            <li class="li-label">日</li>
            <li class="li-label">一</li>
            <li class="li-label">二</li>
            <li class="li-label">三</li>
            <li class="li-label">四</li>
            <li class="li-label">五</li>
            <li class="li-label">六</li>
          </ul>


          <div>
            <!-- 月份 开始-->
            <ul class="months">
              <li class="li-month" v-for="(item,index) in data.monthBar"><span>{{item}}</span></li>
            </ul>
            <!-- 月份 结束-->
            <!-- 贡献格子 开始-->
            <ul class="graph">

              <!-- <div v-for="(item, index) in data.infos" :key="index">

                  <div v-if="item != undefined">
                    <el-tooltip content="Top center" placement="top">
                    <li :data-level="item.level" :data-years="item.year" :data-date="item.date"
                      :data-date-number="item.date_number" :data-selected="item.id===data.active_date_id?true:false"
                      :class="{'li-day':true,'no-hover-level':data.hoverLevel!=-1&&item.level!=data.hoverLevel ,'active':item.id===data.active_date_id,'no-active':data.is_selected==true&&item.id!=data.active_date_id}"
                      @click="clickContributionDay(item)">
                      
                    </li>
                  </el-tooltip>
                    <span>
                      {{ item.month }} -{{item.date}} : {{item.number}}次贡献
                      
                    </span>
                    
                  </div>
  
                </div> -->


              <div v-for="(item, index) in data.infos" :key="index">

                <div v-if="item != undefined">

                  <span v-tooltip.top="item.tooltip_content">

                    <li :data-level="item.today_contribution_level"
                      :data-selected="item.today_contribution_id===data.active_date_id?true:false"
                      :class="{'li-day':true,'no-hover-level':data.hoverLevel!=-1&&item.today_contribution_level!=data.hoverLevel ,'active':item.today_contribution_id===data.active_date_id,'no-active':data.is_selected==true&&item.today_contribution_id!=data.active_date_id}"
                      @click="clickContributionDay(item)">

                    </li>

                  </span>
                </div>

              </div>

            </ul>
            <!-- 贡献格子 结束-->

          </div>

        </div>
      </div>

    </div>

    <div class="contribution-tip-or-level">
      <!-- <h3 style="flex: 1;">最近一年贡献：{{ data.year_contribution_count}} 次</h3> -->

      <div class="contribution-tip-container">
        <div class="contribution-tip-content">
          <div class="contributions_count">0</div>
          <svg-icon class="svg_icon" icon-class="symbol_progress_bar" />
          <div class="contributions_count">4+</div>
        </div>

      </div>

      <div class="contribution-level">
        <div class="level-desc">少</div>

        <div v-if="data.is_selected == false" class="level" @mouseover="data.hoverLevel = index"
          @mouseout="data.hoverLevel = -1" v-for="(item, index)  in 5" :data-level="index">
        </div>

        <div v-else class="level no-active" v-for="(item, index)  in 5" :data-level="index">
        </div>

        <div class="level-desc">多</div>
      </div>

    </div>

  </div>
</template>

<script setup>
  import { onMounted, onUnmounted, ref, reactive, inject, watch, computed, watchEffect } from "vue";
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();//用于获取当前路由的信息。返回的是当前路由的路由对象，包含了当前路由的各种信息
  const router = useRouter();//进行路由的导航操作。返回的是路由的实例，可以进行各种路由操作。


  //路由名
  const current_route_name = ref(null);
  onMounted(() => {

    current_route_name.value = route.name;

  });



  const contributionYearInject = inject('contributionYear');
  //选定日期的年份(当用户在兄弟页面选中年份，把选中年份值传到父页面，父页面注入子页面更新选中年份（annex_title）)
  const yearDropdownPageUpdateYearInject = inject('yearDropdownPageUpdateYear');


  // const parentPageCurrentYearContributionDataInject = inject('parentPageCurrentYearContributionData');
  // provide('parentPageCurrentYearContributionData', current_year_contribution_data.value);//爷传孙，默认选中当年年份

  const emit = defineEmits(['childClickContributionDay']);


  //父页面传值
  const props = defineProps({
    parentPageCurrentYearContributionData: Array
  });



  const stopWatchContributionDataAndCurrentRouteQueryYear = ref(null);
  const parent_page_current_year_contribution_data = ref('');

  // 计算属性来监听路由查询参数中的 year
  const current_route_query_year = ref();
  current_route_query_year.value = computed(() => route.query.year);
  const data = reactive(
    {

      infos: [],  //存放每一天的数据（year，month，date，状态数量，isToday标记） 
      hoverLevel: -1,//等级高亮
      is_selected: false,//是否开启选择模式
      active_date_id: -1,//已选中日期id
      monthBar: [],//12列对应的月份，比如第三列开始是五月份，则令monthBar[2]="5月"，算法实现见下面method
      calculate_month_data: [],//计算月份栏的数据源

    }
  );

  // console.log('current_route_query_year:',current_route_query_year.value);
  // 在访问属性之前检查变量是否已初始化


  stopWatchContributionDataAndCurrentRouteQueryYear.value = watch([props.parentPageCurrentYearContributionData, current_route_query_year.value],
    ([newContributionData, newRouteQueryYear], [oldContributionData, oldRouteQueryYear]) => {
      if (newContributionData) {//如有父页面所传数据更新,那么把父页面所传数据赋值到当前页面的data.list。取消骨架屏 
        parent_page_current_year_contribution_data.value = props.parentPageCurrentYearContributionData;
      }
      // console.log('Age changed to:', newContributionData);
      if (newRouteQueryYear && parseInt(newRouteQueryYear) === parseInt(yearDropdownPageUpdateYearInject.value)) {
        // 当路由查询参数发生变化时，这里会被调用

        data.is_selected = false,//因页面同源原有数据没有刷新，所以初始化是否开启选择模式
          data.active_date_id = -1,//因页面同源原有数据没有刷新，所以初始已选中日期id
          // console.log('newRouteQueryYear:',newRouteQueryYear)
          clickContributionYear(newRouteQueryYear);//生成年份贡献图
        // console.log('R-new_year:', new_year, ',R-old_year:', old_year);

      }
    }, { immediate: true }
  );






  // console.log(JSON.stringify(data.infos))

  //初始化执行输出近一年信息
  lastYear();

  function lastYear() {
    // 获取当前日期
    const todays = new Date();

    // 获取当前年份
    const currentYear = todays.getFullYear();

    // 设置为去年的今天
    const lastYearToday = new Date(currentYear - 1, todays.getMonth(), todays.getDate());

    // 初始日期（去年的今天最近的星期天）
    let firstMondayDate = getNextSunday(lastYearToday.toISOString().split('T')[0]);

    // console.log('firstMondayDate:',firstMondayDate.toISOString().split('T')[0])


    // 计算天数差值加1(今天) 向下取整
    let daysDifference = Math.floor((todays - firstMondayDate) / (1000 * 60 * 60 * 24)) + 1;

    // console.log('todays:',todays.toISOString().split('T')[0],',daysDifference:',daysDifference,',firstMondayDate:',firstMondayDate.toISOString().split('T')[0]); // 输出从初始日期到今天的天数

    // todays: 2024-09-02 ,daysDifference: 366 ,firstMondayDate: 2023-09-03

    /**
    *前提：Date对象通过setDate()设置到某一天的年月日，例如setDate(1)就是设置日期月本月1号
    *今天是20240902日，那么第1列第1格为本日的前365天，则那天的日期设置为(pastDate + i)=setDate(2+0=2)，最后就能获得那一天的年月日对象，再获得年月日数值。 
    *daysDifference=366 第一个格子的时间：去年今天临近的星期天。   去年今天临近的星期天至今天    
    *i序号： 0 ,年月日： 2023 09 03 ,循环次数： 1 ===> i序号： 365 ,年月日： 2024 09 02 ,循环次数： 366
    */
    getDayList(daysDifference, firstMondayDate)

    //月份计算
    //  if(contribution_year_data.value.infos){
    if (data.infos) {

      // console.log('contribution_year_data.infos:',JSON.stringify(contribution_year_data.value.infos))
      //  let [firstElement] = contribution_year_data.value.infos; //使用解构赋值取得第一个元素；
      let [firstElement] = data.infos; //使用解构赋值取得第一个元素；
      // console.log('data.infos:',JSON.stringify(data.infos));

      // console.log('firstElement:',JSON.stringify(firstElement));
      //firstElement: [{"year":2023,"month":8,"date":27,"number":10,"level":2,"isToday":false}]
      //获取天数的星期数，以进行后续计算（周日返回0，周一返回1，周六返回6）
      let last_year_first_day_week = new Date(firstElement.year + '-' + firstElement.month + '-' + firstElement.date).getDay();
      // console.log('first_element_week:'+Object(first_element_week));

      getMonthBar(last_year_first_day_week);
      // 计算属性来合并数组，把父页所传更新数据赋值到渲染数据
      mergedArray(data.infos, parent_page_current_year_contribution_data.value);

    }

  }



  /* 
   * first_day_week     第一天的星期数，以进行后续计算（周日返回0，周一返回1，周六返回6）
   * days_number_data   天数数据 来源data.calculate_month_data
   * 
  */
  //获取月份栏

  function getMonthBar(first_day_week) {

    //初始化（或者赋空值data.monthBar.length=0 或data.monthBar=[] ），清除原有数据（防止变成追加数据）
    data.monthBar = ["", "", "", "", "", "", "", "", "", "", "", ""];

    let days_number_data = data.calculate_month_data;
    let month = "";        //后续计算某月第一天在哪一列用，表示第几月
    if (first_day_week != 0) {//处理第一个元素的星期数非星期日，需补位。如第一个元素的星期数是6，那么需补6个占位格
      // 创建一个新数组，包含n个空元素 n=第一天星期数
      let newArray = new Array(first_day_week);
      // console.log(' contribution_year_data.value.infos', contribution_year_data.value.infos);
      // 将渲染数据和新添加的空元素合并
      data.infos = newArray.concat(data.infos);
      // 将天数数组和新添加的空元素合并
      days_number_data = newArray.concat(days_number_data);

    }

    // console.log('newArray.concat(days_number_data):',JSON.stringify(days_number_data))
    //切割数组,每7天为一组
    let days_number_data_spArr = spArr(days_number_data, 7);

    //获取每月第一天出现的列数
    days_number_data_spArr.map((element, index) => {
      // console.log('53列数据:',index, element); // 打印下标和元素
      element.map((item_element, item_index) => {
        // console.log('每天数据:',item_index, item_element); // 打印下标和元素
        if (item_element.date && item_element.date == 1) {
          // console.log('days_number_data_spArr.l:',days_number_data)
          // console.log('列:',index,',月:',item_element.month.replace(/^0+/, ''));//用正则把月份的0替换空
          if (index != 53) {
            month = item_element.month.replace(/^0+/, '');
            data.monthBar[index] = month + "月";
            // console.log('列:',index,',月:',item_element.month.replace(/^0+/, ''));//用正则把月份的0替换空
          }

        }

      });

    });

    //初始化 calculate_month_data
    data.calculate_month_data = [];
    // console.log('data.monthBar.length:', data.monthBar.length)

  }


  /* 
  *获取天数列表 循环遍历
  * first_day_week     第一天的星期数，以进行后续计算（周日返回0，周一返回1，周六返回6）
  * cycle_days   循环天数
  * cycle_days_start_time   循环循环天数的开始时间
  */
  function getDayList(cycle_days, cycle_days_start_time) {

    let day_info = {};         //用来存放某一天的数据对象 日期格子（年月日、isToday、level）      

    //天数数据用于推算月份
    // let calculate_month_day_data=[];  //所有天数数据对象
    let month_day = {};      //用来存放某一天的数据对象（月日） 


    // 倒推序号: 0 ,年月日: 2021 12 31    倒推序号: 0   修改为 数组索引364  ,年月日: 2021 01 01
    for (let i = 0; i < cycle_days; i++) {
      // 创建一个新的日期对象           //let i = 364; i >=0 ; i--    倒推序号: 364 ,年月日: 2023 09 03   倒推序号: 0 ,年月日: 2024 09 01 
      const pastDate = new Date(cycle_days_start_time);
      // 将日期顺推
      pastDate.setDate(pastDate.getDate() + i);

      // console.log('pastDate.getDate():',  pastDate.setDate(pastDate.getDate() +i))

      // 格式化日期为YYYY-MM-DD
      const year = pastDate.getFullYear();
      const month = (pastDate.getMonth() + 1).toString().padStart(2, '0');
      const day = pastDate.getDate().toString().padStart(2, '0');
      // console.log('i序号:',i,',年月日:',year,month,day);
      // let level =0;

      // if(pastDate.getTime()>new Date().getTime()){
      //    level =0;
      // }else{
      //    level = Math.floor(Math.random() * 5);
      // }

      let level = Math.floor(Math.random() * 5); //这里是随机设置每天的频率等级，后续开发要替换为自己计算的真实等级（不同等级对应不同颜色方格）

      day_info = {                      //每个格子（天）的info对象
        year: year,      //年
        month: month,     //月
        date: day,        //日
        year_month_date: `${year}-${month}-${day}`,
        today_contribution_count: level,    //今日的数据量
        today_contribution_level: level,  //今日数据量对应的等级
        today_contribution_id: i,
        tooltip_content: `${year}-${month}-${day}，${level} 次贡献`
      };

      month_day = {
        month: month,
        date: day,
      }

      data.calculate_month_data.push(month_day);


      // contribution_year_data.value.infos.push(day_info); //push数组末尾添加
      data.infos.push(day_info); //push数组末尾添加

    }
  }



  //已选择某年贡献信息
  function clickContributionYear(year) {
    //赋空值（或者monthBar_data.monthBar.length=0），清除原有数据（防止变成追加数据）
    data.infos = [];

    //平年、闰年
    let contribution_year_date_num = 365
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      contribution_year_date_num = 366
    }

    //年贡献结束时间
    const click_contribution_year_start = new Date(year, 0, 1); // 年份开始时间，1月1日
    const click_contribution_year_end = new Date(year, 11, 31); // 年份结束时间，12月31日
    // console.log('click_contribution_year_start:',click_contribution_year_start);
    // console.log('click_contribution_year_end:',click_contribution_year_end);

    getDayList(contribution_year_date_num, click_contribution_year_start)


    // if(contribution_year_data.value.infos){
    if (data.infos) {


      // console.log(JSON.stringify(data.infos))
      // console.log('contribution_year_data.infos:',JSON.stringify(contribution_year_data.value.infos))

      let [firstElement] = data.infos; //使用解构赋值取得第一个元素；


      // console.log('firstElement:',JSON.stringify(firstElement));
      //firstElement: [{"year":2023,"month":8,"date":27,"number":10,"level":2,"isToday":false}]
      //获取天数的星期数，以进行后续计算（周日返回0，周一返回1，周六返回6）
      let contribution_year_first_day_week = new Date(firstElement.year + '-' + firstElement.month + '-' + firstElement.date).getDay();

      // console.log('contribution_year_first_day_week:',contribution_year_first_day_week);

      getMonthBar(contribution_year_first_day_week)
      // 计算属性来合并数组，把父页所传更新数据赋值到渲染数据
      // console.log('infos:',JSON.stringify(props.parentPageCurrentYearContributionData));
      mergedArray(data.infos, parent_page_current_year_contribution_data.value);

      // console.log(JSON.stringify(data.infos))

    }



  }

  //

  //点击日期格子。把父页面所传年份值改为点击日期的年份值
  function clickContributionDay(item) {
    if (data.active_date_id == item.today_contribution_id) {
      data.active_date_id = -1;
      data.is_selected = false;
    } else {
      data.active_date_id = item.today_contribution_id;
      data.is_selected = true;
    }

    // console.log('item:', JSON.stringify(item));
    contributionYearInject.value = item.year;//子修改父的传值 （选中当年年份改为当前所选年份）响应式 
    emit('childClickContributionDay', item.year, item.month, item.date, item.today_contribution_count, item.today_contribution_id, data.is_selected);//子传父
    //路由携参跳转
    router.push({ name: current_route_name.value, query: { year: item.year, from: item.year_month_date, to: item.year_month_date }, key: new Date().getTime() });

    // {"year":2023,"month":11,"date":18,"number":10,"level":0,"isToday":false}
    // alert(item.month + "-" + item.date+'，博文：'+item.number)
    // router.push({ name: current_route_name.value, query: { tag_id: item.tag_name }, key: new Date().getTime() });

  }


  // 计算属性来合并数组，把父页所传更新数据赋值到渲染数据
  function mergedArray(renderingArray, updataArray) {

    // console.log('updataArray:',JSON.stringify(updataArray))
    // 计算属性来合并数组
    const mergedArray = computed(() => {
      // 使用Array.prototype.reduce来合并数组
      return renderingArray.reduce((acc, curr) => {
        const update = updataArray.find(item => item.year_month_date === curr.year_month_date);
        return [...acc, { ...curr, ...update }];
      }, []);
    });

    data.infos = mergedArray.value;

  }



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


  //分割的数组
  function spArr(arr, num) { //arr是你要分割的数组，num是以几个为一组
    let newArr = [] //首先创建一个新的空数组。用来存放分割好的数组
    for (let i = 0; i < arr.length;) { //注意：这里与for循环不太一样的是，没有i++
      newArr.push(arr.slice(i, i += num));
    }
    return newArr
  }


  // 组件销毁前清除watch
  onUnmounted(() => {
    // 如果watch返回了一个停止监听的函数，调用它
    stopWatchContributionDataAndCurrentRouteQueryYear.value = null;

  });

</script>


<style scoped>
  
  .contribution-calendar-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
    border: var(--borderWidth-thin, 1px) solid var(--borderColor-default);
  }




  .contribution-table {
    display: flex;
    max-width: 100%;
    /* -ms-overflow-style: scrollbar; 
    -webkit-scrollbar:scrollbar;
    scrollbar-width: scrollbar;  */
    height: 100%; /* 容器高度设置为100%，根据实际需求调整 */
    width: 100%; /* 容器宽度设置为100%，根据实际需求调整 */
    /* 可以设置为 'auto', 'thin', 'none' 等值 */
    overflow-y: scroll;
    overflow-y: hidden;
  }



  .year-month-day{
    scrollbar-width: thin; 

 
/* 自定义滚动条样式（仅WebKit浏览器） */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background-color: #dbeffd;
  border-radius: 32px;
   /* 滚动条轨道颜色 */
}

::-webkit-scrollbar-thumb {
  background: #888; /* 滚动条手柄颜色 */
}

::-webkit-scrollbar-thumb:hover {
  background: #555; /* 滚动条手柄hover颜色 */
}


/* 对于IE和Edge */

/* 设置滚动条的宽度 */
::-ms-track {
width: 16px;
cursor: pointer;
background: transparent; 
}

/* 设置滚动条的滑块样式 */
::-ms-thumb {
width: 10px;  
background: #888; 
}

/* 设置滚动条的轨道样式 */
::-ms-scrollbar {
width: 16px;  
background: transparent; 
}
  }


  .contribution-table-container {
    max-width: 100%;
  }



  .contribution-table-content {
    display: flex;
  }

  /* 生成日期格子 */
  .graph {
    display: grid;
    grid-template-columns: repeat(53, 21px);
    /*竖向53列，21px宽*/
    grid-template-rows: repeat(7, 21px);
    /*横向7列，21px宽*/
    padding-inline-start: 0px;
    grid-auto-flow: column;
    /*生成7*53的格子后，设置为竖向排布*/
    margin: 21px 20px 21px 35px;
  }

   /* 生成月份格子 */
  .months {
    display: grid;
    grid-template-columns: repeat(53, 21px);
    grid-template-rows: 21px;
    font-size: 8px;
    /* color: #aaa; */
    padding-inline-start: 0px;
    margin: 21px 20px 21px 35px;

  }

  .contribution-calendar-label {
    display: flex;
    flex-direction: column;
    margin-top: 60px;
    padding-left: 10px;
    /* margin-top: 20px;
      margin-right: 20px; */
    /* width: 21px;
      height: 21px; */
    /* margin: 20px 20px 5px 20px; */
  }

  .li-label {
    width: 18px;
    height: 18px;
    list-style: none;
    /*记得把list的圆点效果去掉*/
    margin: 1.5px;
    border-radius: 3px;

  }

  .li-month {
    display: inline-block;
    width: 18px;
    height: 18px;
    list-style: none;
    /*记得把list的圆点效果去掉*/
    margin: 1.5px;
    border-radius: 3px;
    text-align: center;
  }

  .li-day {
    width: 18px;
    height: 18px;
    background-color: #eaeaea;
    list-style: none;
    /*记得把list的圆点效果去掉*/
    margin: 1.5px;
    border-radius: 3px;

    @media screen and (min-width: 1200px) {
      &:hover {
        /*添加hover强调效果*/

        /* filter: brightness(100%);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 1); */

        /* 防止移动端重复点击同一元素没有取消选中样式 */

        -webkit-box-shadow: 1px 1px 13px #20232e, -1px -1px 13px #545b78;
        box-shadow: 1px 1px 13px #20232e, -1px -1px 13px #545b78;
        /* color: #d6d6d6; */
        -webkit-transition: 500ms;
        transition: 500ms;



      }
    }
  }



  .active {
    outline: none;
    opacity: .8 !important;
    -webkit-box-shadow: 1px 1px 13px #20232e, -1px -1px 33px #545b78;
    box-shadow: 1px 1px 13px #20232e, -1px -1px 33px #545b78;
    /* color: #d6d6d6; */
    -webkit-transition: 100ms;
    transition: 100ms;
  }

  .no-active {
    opacity: .3 !important;
  }
 /* 日期格子等级颜色 开始*/

  [data-level="0"] {
    fill: #ebedf0;
    background-color: #ebedf0;
    outline: 1px solid rgba(27, 31, 35, 0.06);
  }

  [data-level="1"] {
    fill: #9be9a8;
    background-color: #9be9a8;
    outline: 1px solid rgba(27, 31, 35, 0.06);
  }

  [data-level="2"] {
    fill: #40c463;
    background-color: #40c463;
    outline: 1px solid rgba(27, 31, 35, 0.06);
  }

  [data-level="3"] {
    fill: #30a14e;
    background-color: #30a14e;
    outline: 1px solid rgba(27, 31, 35, 0.06);
  }

  [data-level="4"] {
    fill: #216e39;
    background-color: #216e39;
    outline: 1px solid rgba(27, 31, 35, 0.06);
  }

  /* 日期格子等级颜色 结束*/

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


  /* 等级进度提示和等级颜色 开始*/

  .contribution-tip-or-level {
    width: 100%;
    max-width: 100%;
    display: flex;
    margin: 10px 0px;
    height: 30px;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;

    /* 可视化窗口宽度小于430px 换行加自动高度 */
    @media screen and (max-width: 430px) {
      flex-wrap: wrap;
      height: auto;
    }
  }


  .contribution-tip-container {
    flex: 1;
    width: 100%;
    padding-left: 60px;

    .contribution-tip-content {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 125px;
      overflow: hidden;

      .contributions_count {
        width: 11px;
        margin: 0 8px;
      }

      .svg_icon {
        width: auto;
      }
    }
  }

  .contribution-level {
    display: flex;
    width: 100%;
    padding-right: 60px;
    justify-content: end;
    align-items: center;
    overflow: hidden;

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

  /* 等级进度提示和等级颜色 结束*/
</style>