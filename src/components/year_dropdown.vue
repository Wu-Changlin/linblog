
<template>
    <div class="select-container" ref="dropdown">
        <div class="select-comtent">
            <div class="year-dropdown dropdown"  @click="clickSelect()">
                <div class="text">{{ data.annex_title }} </div>
                <i class="icon dropdown" ><svg-icon  icon-class="year"/></i> 
            </div>

        </div>
        <div class="select-list" :style="{display:data.is_show_select?'block':'none'}">
        <!-- 下拉框列表 -->
            <ul>
                <li :class="{'contribution-year-active':data.active_contribution_year==item.contribution_year?'true':''}" v-for="(item,index) in data.list" :key="item.value" @click="changeSelect(item.contribution_year)">
                    {{ item.contribution_year }}
                </li>
            </ul>
        </div>
    </div>

  
    
  </template>
  
  <script setup>
import { ref,reactive,onMounted,onUnmounted,inject,watch} from 'vue';
import { useRoute, useRouter } from 'vue-router';




const route = useRoute();//用于获取当前路由的信息。返回的是当前路由的路由对象，包含了当前路由的各种信息
const router = useRouter();//进行路由的导航操作。返回的是路由的实例，可以进行各种路由操作。



//选中年份数据来源
//1.默认值来源，组件逻辑操作放在父页面，子页面仅渲染数据。父页面请求接口得到默认选中年份值，
//  把默认选中年份值传到子页面；子页面渲染选中年份（annex_title，active_contribution_year）。
//2.当用户在兄弟页面（contribution_calendar）选中贡献图中某个日期格子，监听contribution_calendar把父页面所传年份值改为点击日期的年份值，
//  本页面更新选中年份（annex_title，active_contribution_year）。
//3.当用户在本页点击选择下拉框中的某一年份，更新选中年份（annex_title，active_contribution_year）。
//  子修改父的传值 （把父页面所传年份值(yearDropdownPageUpdateYear)改为当前所选年份），父页面以选中年份值为条件请求接口获取某年贡献信息。
// （兄弟页面（contribution_calendar）监听查询参数的year且把查询参数的year相等判断yearDropdownPageUpdateYear，生成以选中年份值为条件生成某年贡献图）；
//  当父页面把获取某年贡献传值到子页面(contribution_calendar)，兄弟页面渲染页面。


 // 接收爷爷的响应式选中年份数据  选中年份默认值是当年
const contributionYearInject = inject('contributionYear');

const yearDropdownPageUpdateYearInject = inject('yearDropdownPageUpdateYear');

//子传父
// const emit = defineEmits(['child-click-contribution-year']);

//选定日期的年份(当用户在父页面选中贡献图中某个日期格子，把日期格子的年份传到子页面，子页面更新选中年份（annex_title）)
const props = defineProps({
    yearDropdown:Array
});


const	data =reactive({
    annex_title: 0,//'请选择' 2024,
    is_show_select:false,
    active_contribution_year:0,//2024
    list:[],
   
});




 //把父页面所传数据赋值到当前页面的data.list
 if (props.yearDropdown) {
    data.list = props.yearDropdown;
  }


  if(contributionYearInject){
    // console.log('contributionYearInject:',contributionYearInject.value)
    data.annex_title=contributionYearInject.value;
    data.active_contribution_year=contributionYearInject.value;
}


const stopWatchContributionCalendarPageUpdateYear = ref(null);
   
// 设置一个watch监听器,用于监听contribution_calendar把父页面所传年份值改为点击日期的年份值。
stopWatchContributionCalendarPageUpdateYear.value = watch(contributionYearInject, (newValue, oldValue) => {
    if(newValue){
        data.annex_title=contributionYearInject;
        data.active_contribution_year=contributionYearInject;
    }    
    // console.log('watch-contributionYearInject:',contributionYearInject)
});


  





// 使用ref来存储watch返回的函数
// const stopWatch = ref(null);
   
const current_route_name=ref(null);
onMounted(() => {
    //点击外部下拉菜单关闭
    window.addEventListener('click', closeselectDown); // 监听全局点击事件
    current_route_name.value=route.name;
    // 设置一个watch监听器
    // 立即监听，并存储取消监听的函数
//     stopWatch.value = watch(
//     () => props.theYearOfTheSelectedDate,
//     (newValue, oldValue) => {
//         // console.log(111);
//         // console.log('props.theYearOfTheSelectedDate:',props.theYearOfTheSelectedDate)
//         data.active_contribution_year = props.theYearOfTheSelectedDate;
//         data.annex_title=props.theYearOfTheSelectedDate;
//       // 你可以在这里根据newValue做出响应
//     },
//     // { immediate: true }
//   );

});

//下拉菜单对象
const dropdown=ref(null);
//点击外部下拉菜单关闭
function closeselectDown(e){
    if (dropdown.value && !dropdown.value.contains(e.target)) {
        // /如果点击的不是下拉框内部，则关闭下拉框
        data.is_show_select=false;
      }
}



onUnmounted(() => {
    window.removeEventListener('click', closeselectDown);// 移除全局点击事件监听
    stopWatchContributionCalendarPageUpdateYear.value(); // 如果watch返回了一个停止监听的函数，调用它
   
});


const emit = defineEmits(['yearDropdownPageUpdateYearEmit']);
//显示/隐藏
function clickSelect(){
    data.is_show_select=!data.is_show_select;
}

//点击选择下拉框中的某一年份
function changeSelect (contribution_year){
    data.active_contribution_year = contribution_year;
    data.annex_title=contribution_year;
    data.is_show_select=false;
    // emit('child-click-contribution-year',contribution_year);//子传父 
    contributionYearInject.value=contribution_year;//孙修改父的传值 （选中当年年份改为当前所选年份）响应式 
    
    // tab=overview&from=2024-09-01&to=2024-09-21
    //路由携参跳转
    router.push({ name: current_route_name.value, query: {year : contribution_year, from:`${contribution_year}-01-01`,to:`${contribution_year}-12-31` }, key: new Date().getTime() });
    yearDropdownPageUpdateYearInject.value=contribution_year;
    emit('yearDropdownPageUpdateYearEmit',contribution_year);//子传父 
    
}

</script>
  
  
  <style scoped>
          
              
              /*  重新写一个下拉框组件  */
              .select-container{
                  width:100%;
                  height:100%;
                  font-size: 14px;
                  font-weight: normal;
                  font-stretch: normal;
                  letter-spacing: 0px;
                  color: #333333;
                  /* border: 1px solid #494d59; */
                  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                 
              }


              .select-comtent {
                  /* margin-top:2px; */
                  /* width:130px;*/
                  /* height:40px;  */
                  padding: 3px;
                  border:1px solid #131D88;
                  cursor:pointer;
                  border-radius: 6px;
                  background-color: rgba(0, 0, 0, 0.03);
                
                  
                  
              }


              /* 年标题 */
              .year-dropdown.dropdown {
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    position: relative;
                    display: inline-block;
                    outline: none;
                }

                .year-dropdown.dropdown>.text {
                    display: inline-block;
                    -webkit-transition: none;
                    transition: none;
                    vertical-align: middle;
                    
                }


                .year-dropdown.dropdown>.dropdown.icon {
                    position: relative;
                    width: auto;
                    margin-left: 10px;
                    vertical-align: middle;
                }

                i.icon {
                    display: inline-block;
                    vertical-align: middle;
                    opacity: 1;
                }

              
              
              /* 下拉列表 */
              .select-list{
                  display: none;
                  position:absolute;
                  margin-top: 10px;
                  background-color:var(--bg);
                  z-index:9;
                  border-radius:5px;
                  border:1px solid #E4E7ED;
            
                  transform: translate(-100%, -30%);
                  border-radius: 6px;
              }
              .select-list>ul{
                  margin: 0;
                  padding: 0;
                 
              }
              .select-container li{
                  width:68px;
                  padding:0 3px;
                  height:34px;
                  /* line-height:34px; */
                  white-space:nowrap;
                  /*background-color:#ffffff;*/
                  white-space:nowrap;
                  text-overflow:ellipsis;
                  overflow:hidden ;
                  list-style:none;
                  cursor:pointer;
                  text-align: center
                 
              }
              .select-container li:hover{
                background-color: rgba(0, 0, 0, 0.03);
                border-radius: 999px;
                color: var(--blue);
              }

              .contribution-year-active{
                background-color: rgba(0, 0, 0, 0.03);
                border-radius: 999px;
                color: var(--blue);
              }
  </style>
  
  
  
  