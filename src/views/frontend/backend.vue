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
    box-shadow: 0px 0px 5px rgb(57, 120, 255);
  }

  .active {               /*添加hover强调效果*/
    /* box-shadow: 0px 0px 5px rgb(57, 120, 255); */
    color: #636c76!important;
    background-color: #999999 !important;
  }

  .no-active{
    color:#636c76!important;
  }

.graph li[data-level="0"] {
  background-color: #ebedf0;
}

.graph li[data-level="1"] {
  background-color: #9be9a8;
}

.graph li[data-level="2"] {
  background-color: #40c463;
}

.graph li[data-level="3"] {
  background-color: #30a14e;
}

.graph li[data-level="4"] {
  background-color: #216e39;
}





.operation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
 
      .slider {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200px;
 
        .slider-desc {
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
 
        .level-0 {
          background: #ebedf0;
        }
 
        .level-1 {
          background:  #9be9a8;
        }
 
        .level-2 {
          background: #40c463;
        }
 
        .level-3 {
          background: #30a14e;
        }
 
        .level-4 {
          background: #216e39;
        }



      }
    }


  .hover-level {
    box-shadow: inset 0px 0px 1px 2px rgba(255, 255, 255, 0.5);
    color: rgba(55,126,259,0.1);
  }

</style>

<template>
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
          <li class="li-month" v-for="(item,index) in monthBar" :key="index"><span>{{item}}</span></li>
        </ul>
        <!-- 月份 结束-->
        <!--  开始-->
        <ul class="graph">
          <!-- 占位格 开始-->
          <div class="item"   v-for="(blank_grid_item, blank_grid_index) in blank_grid" :key="blank_grid_index">
            <li></li>
          </div>
          <!-- 占位格 结束-->
          <div class="item"   v-for="(item, index) in infos" :key="index">
              <li   :data-level="item.id==active_id?'':item.level"        :class="{'li-day':true,'hover-level': item.level == hoverLevel ,'active':item.id==active_id}"   @click="handleClick(item)"></li>
          </div>
        </ul>

        <div class="operation">
          <div class="slider">
            <div class="slider-desc">0</div>
              <svg-icon class="svg_icon" icon-class="jindutiao" />
            <div class="slider-desc">5+</div>
          </div>
          <div class="legend">
            <div class="level-desc">少</div>
              <!-- <div class="level level-0"></div>
              <div class="level level-1"></div>
              <div class="level level-2"></div>
              <div class="level level-3"></div>
              <div class="level level-4"></div> -->
              <div class="level" @mouseover="hoverLevel = index" @mouseout="hoverLevel = -1" v-for="(item, index)  in 5" :key="index"
              :class="['level-' + index]">
              </div>
            <div class="level-desc">多</div>
          </div>
        </div>

       

    </div>
  
   
</div>
</template>
 
<script>
  export default {
    data () {
      return {
        infos: [],  //存放每一天的数据（year，month，date，状态数量，isToday标记）
        current: {  //存放今天的年月日
          year: "",  
          month: "",
          date: "",
        },
        blank_grid:0,//空白占位格
        hoverLevel:-1,
        active_id:0,
        monthBar: ["", "", "", "", "", "", "", "", "", "", "", ""],//12列对应的月份，比如第三列开始是五月份，则令monthBar[2]="5月"，算法实现见下面method

      }
    },
    props: {
      //年贡献结束时间
      contribution_activities_endtime : {
        // default: '2022-12-31',//2023-12-31
        type: String
      }
    },


    created() {
    let d = this.contribution_activities_endtime ? new Date(this.contribution_activities_endtime) : new Date() ;
    let day = d.getDay();           //获取今天所在星期，以进行后续计算
    let today = d.getDate();        //获取今天的日数

    this.current.year = d.getFullYear();   //初始化今日的年月日
    this.current.month = d.getMonth();
    this.current.date = d.getDate();

  

    let year_day_number=365;//平年天数 默认

    //闰年天数   4整除且非100整除，或400整除
    if((this.current.year % 4 == 0 && this.current.year % 100 != 0) || this.current.year % 400 == 0){
      year_day_number=366;
    }
    
    let start_day_number=0;//第一个格子开始天

    if(this.contribution_activities_endtime){
      start_day_number=1;
    }


    let info = {};         //用来存放某一天的数据对象（年月日、isToday、level）      
    let month = "";        //后续计算某月第一天在哪一列用，表示第几月
    let weekOfMonth = ""   //后续计算某月第一天在哪一列用，表示第几列

    /**
    *前提：Date对象通过setDate()设置到某一天的年月日，例如setDate(1)就是设置日期月本月1号
    *而setDate(0)则是上个月最后一天，setDate(-1)则是设置为上个月倒数第二天
    *以此类推，假如今天是星期一，如果周日算本周第一天，则今天是本周第2天，也就是本周在今日前面还有1天，本周在第53列，则今天前的日期有52*7+1=365天，所以第1列第1格为365天前。
    *假如今天是20240826日，那么第1列第1格为本日的前365天，则那天的日期设置为(today - 365 + i)=setDate(26-356-0=-339)，最后就能获得那一天的年月日对象，再获得年月日数值。
    *知道前提后下面的代码可以自己体会了
    */
    //0 第一个格子的时间：上一年今天。倒查   上一年今天至今天
    //1 第一个格子的时间：减去上一年今天。上一年第一天至上一年最后一天（按年统计贡献contribution_activities_endtime）  
    //start_day_number=0  2022-12-31至2023-12-31   
    //start_day_number=1  2023-12-31至2023-12-31
    for (let i = start_day_number; i <=year_day_number; i++) {
        d.setFullYear(this.current.year);  //每次循环要重置年月日为今天否则会以上次循环结尾的年月日计算而计算错误
        d.setMonth(this.current.month);
        d.setDate(this.current.date);

        
        // console.log('today：',today,',i：',i,',today - 365 + i:',today - 365 + i,'d.setDate(today - 365 + i)：', d.setDate(today - 365 + i) );
        d.setDate(today -year_day_number+ i);   //设置到本次循环的date   
        //(today-365+i)
        // 开始循环：today： 26 ,i： 0 ,today - 365 + i: -339   1693144206789       对应开始格子
        // 结束循环：today： 26 ,i： 365 ,today - 365 + i: 26   1724680206789       对应结束格子

        let level = Math.floor(Math.random() * 5); //这里是随机设置每天的频率等级，后续开发要替换为自己计算的真实等级（不同等级对应不同颜色方格）

        if (     //判断是否为今天，是则做些标记，后续渲染时可以突出强调今天的格子
            d.getFullYear()== this.current.year && d.getMonth() == this.current.month &&
            d.getDate() == this.current.date
        ) {
            info = {                      //每个格子（天）的info对象
                year: d.getFullYear(),      //年月日
                month: d.getMonth() + 1,
                date: d.getDate(),
                number: 10,    //今日的数据量
                level: level,  //今日数据量对应的等级
                isToday: true, //是否是今天
                id:i,
            };
            this.infos.push(info);
        } else {
            info = {
                year: d.getFullYear(),
                month: d.getMonth() + 1,
                date: d.getDate(),
                number: 10,
                level: level,
                isToday: false,
                id:i,
            };
            this.infos.push(info);
        }
        // console.log('weekOfMonth = parseInt((i + 1) / 7):'+parseInt((i + 1) / 7));
        //判断每月第一天在12列种的哪一列
        if (d.getDate() == 1) { //date为1的肯定是某月第一天
            month = d.getMonth() + 1  //获取这一天对应的月份（0-11，所以还要+1）
            //这个月的第一天的index（84天的第几天）除以7获得所在列的index（12列的第几列），
            //作为下面monthBar的index，并把原来空的内容用替换为xx月
            weekOfMonth = parseInt((i + 1) / 7)
            // console.log('d.getDate():',d.getDate(),',列：'+weekOfMonth,',month:',month)
            this.monthBar[weekOfMonth] = month + "月"
        }
    }

    if(this.infos){
     
      let [firstElement] =this.infos; //使用解构赋值取得第一个元素；
    
      // console.log('firstElement:',JSON.stringify(firstElement));
      //firstElement: [{"year":2023,"month":8,"date":27,"number":10,"level":2,"isToday":false}]
      //获取天数的星期数，以进行后续计算（周日返回0，周一返回1，周六返回6）
      let first_element_week = new Date(firstElement.year+'-'+firstElement.month+'-'+firstElement.date).getDay();
      // console.log('first_element_week:'+Object(first_element_week));
      if(first_element_week!=0){//处理第一个元素的星期数非星期日，需补位。如第一个元素的星期数是6，那么需补6个占位格
        this.blank_grid=first_element_week;
        // console.log('week:'+first_element_week);  
      }      
       
    }
    
    
},


    methods: {


      getColor (number) {
        // level color
        // 左闭右开
        let color = '#EBEDF0'
        if (number >= 4) {
          color = '#196127'
        } else if (number >= 3) {
          color = '#239A3B'
        } else if (number >= 2) {
          color = '#7BC96F'
        } else if (number >= 1) {
          color = '#C6E48B'
        } else {
          color = '#EBEDF0'
        }
        return color
      },

      handleClick: function (item) {
        // console.log(JSON.stringify(item))
        
        if(this.active_id==item.id){
          this.active_id=-1;
        }else{
          this.active_id=item.id;
        }
        console.log(' this.active_id:', this.active_id);
        // {"year":2023,"month":11,"date":18,"number":10,"level":0,"isToday":false}
        // alert(item.month + "-" + item.date+'，博文：'+item.number)
      }
    }
  }
</script>
