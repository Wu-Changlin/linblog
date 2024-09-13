<style scoped>

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
        grid-template-columns: repeat(52, 21px);
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
      z-index: 100;
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
              <div class="item tooltip"  v-for="(item, index) in infos" :key="index">
    
              
                  <li
                    :data-level="item.level"  :data-selected="item.id===active_id?true:false"       
                    :class="{'li-day':true,'no-hover-level':hoverLevel!=-1&&item.level!=hoverLevel ,'active':item.id===active_id,'no-active':is_selected==true&&item.id!=active_id}"  
                    @click="handleClick(item)">
                   
                  </li>
                 
                  <span class="tooltiptext">{{item.month+'-'}}{{item.date+'：'}}{{item.number+'次贡献'}}</span>
                  
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
               
                   
                <div  v-if="is_selected == false"  class="level" @mouseover="hoverLevel = index" @mouseout="hoverLevel = -1" v-for="(item, index)  in 5"
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
            hoverLevel:-1,//等级高亮
            is_selected:false,//是否开启选择模式
            active_id:-1,//已选中id
            monthBar: ["", "", "", "", "", "", "", "", "", "", "", ""],//12列对应的月份，比如第三列开始是五月份，则令monthBar[2]="5月"，算法实现见下面method
            monthBarEnd:[],
          }
        },
        props: {
          //年贡献结束时间
          contribution_activities_endtime : {
            default: '2024-12-31',//2023-12-31
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
        let info_data= {};
        let one_date_week=0;    //开始天所在星期
        let one_date_month=0;   //开始天所在月
  
        /**
        *前提：Date对象通过setDate()设置到某一天的年月日，例如setDate(1)就是设置日期月本月1号
        *而setDate(0)则是上个月最后一天，setDate(-1)则是设置为上个月倒数第二天
        *以此类推，假如今天是星期一，如果周日算本周第一天，则今天是本周第2天，也就是本周在今日前面还有1天，本周在第53列，则今天前的日期有52*7+1=365天，所以第1列第1格为365天前。
        *假如今天是20240826日，那么第1列第1格为本日的前365天，则那天的日期设置为(today - 365 + i)=setDate(26-356-0=-339)，最后就能获得那一天的年月日对象，再获得年月日数值。
        *知道前提后下面的代码可以自己体会了
        */
        //0 第一个格子的时间：上一年今天。倒查   上一年今天至今天    
        //1 第一个格子的时间：减去上一年今天。上一年第一天至上一年最后一天（按年统计贡献contribution_activities_endtime）  
        //start_day_number=0  2022-12-31至2023-12-31       20230830---20240830 367
        //start_day_number=1  2023-12-31至2023-12-31       20230831---20240830 366 
        for (let i = start_day_number; i <=year_day_number; i++) {
            d.setFullYear(this.current.year);  //每次循环要重置年月日为今天否则会以上次循环结尾的年月日计算而计算错误
            d.setMonth(this.current.month);
            d.setDate(this.current.date);
  
            d.setDate(today-year_day_number+i);   //设置到本次循环的date   
            //(today-365+i)
            // 开始循环：today： 26 ,i： 0 ,today - 365 + i: -339   1693144206789       对应开始格子
            // 结束循环：today： 26 ,i： 365 ,today - 365 + i: 26   1724680206789       对应结束格子
            let level = Math.floor(Math.random() * 5); //这里是随机设置每天的频率等级，后续开发要替换为自己计算的真实等级（不同等级对应不同颜色方格）
  
            // console.log( i,',年月日:',d.getFullYear(), '-',d.getMonth(),'-', d.getDate());
            if (     //判断是否为今天，是则做些标记，后续渲染时可以突出强调今天的格子
                d.getFullYear()== this.current.year && d.getMonth() == this.current.month &&
                d.getDate() == this.current.date
            ) {
                info = {                      //每个格子（天）的info对象
                    year: d.getFullYear(),      //年月日
                    month: d.getMonth() + 1,
                    date: d.getDate(),
                    number: i,    //今日的数据量
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
                    number: i,
                    level: level,
                    isToday: false,
                    id:i,
                };
                this.infos.push(info);
            }
  
  
            if(i==start_day_number){
              one_date_week =new Date(d.getFullYear(),d.getMonth(),d.getDate()).getDay();
              one_date_month=d.getMonth();
              // console.log('mond:',d.getMonth()+1,',date,',d.getDate(),',one_date_week:',one_date_week,',one_date_month',one_date_month);
            }
            
            // console.log('weekOfMonth = parseInt((i + 1) / 7):'+parseInt((i + 1) / 7));
            //判断每月第一天在12列种的哪一列
            if (d.getDate() == 1) { //date为1的肯定是某月第一天
                month = d.getMonth() + 1  //获取这一天对应的月份（0-11，所以还要+1）
                //这个月的第一天的index（84天的第几天）除以7获得所在列的index（12列的第几列），
                //作为下面monthBar的index，并把原来空的内容用替换为xx月
                // weekOfMonth = parseInt((i + 1) / 7)
               
  
                if(start_day_number==0){
                  if(one_date_week==new Date(d.getFullYear(),d.getMonth(),d.getDate()).getDay()){
                    weekOfMonth =  parseInt(i/ 7);
                  }else{
                    weekOfMonth = parseInt((i + one_date_week) / 7);//加上占位格
                  }
                 
                }else{
                  
                  if(one_date_week==0){//当第一天是星期天
                    weekOfMonth =  parseInt(i/ 7);
  
                    //某月的第一天出现在某月当列的就前一列，需减去占位格促使某月当列前移。
                    const with_data= new Date(d.getFullYear(),d.getMonth(),d.getDate()).getDay();
                    if(with_data==6){
                      weekOfMonth = parseInt((i - 7) / 7);//减去占位格  7天一轮回
                    }
                  }else{//当第一天非星期天
                    weekOfMonth = parseInt((i + one_date_week) / 7);//加上占位格
                    const with_data= new Date(d.getFullYear(),d.getMonth(),d.getDate()).getDay();
                    if(with_data==6){
                        weekOfMonth = parseInt(i / 7);//减去占位格  7天一轮回
                    }
                  }
  
                 
                 // 
                  // // console.log('i:',i,',one_date_week !=:','mond:', d.getMonth() ,',date,',d.getDate(),',with_data:',with_data);
                  // weekOfMonth = parseInt((i - with_data) / 7);//减去占位格
              
                }     
                this.monthBar[weekOfMonth] = month + "月"
             
            }
         
        }
    
        // console.log('this.infos:',JSON.stringify(this.infos));
        if(this.infos){
  
          // console.log('this.infos:',JSON.stringify(this.infos))
  
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
    
          handleClick: function (item) {
            // console.log(JSON.stringify(item))
            
            
            if(this.active_id==item.id){
              this.active_id=-1;
              this.is_selected=false;
            }else{
              this.is_selected=true;
              this.active_id=item.id;
            }
            console.log('item:', JSON.stringify(item));
            // {"year":2023,"month":11,"date":18,"number":10,"level":0,"isToday":false}
            // alert(item.month + "-" + item.date+'，博文：'+item.number)
          },
    
    
    
        }
      }
    </script>
    