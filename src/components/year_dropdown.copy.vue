
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


//选中年份数据来源
//1.默认值来源，组件逻辑操作放在爷页面，孙页面仅渲染数据。爷页面请求接口得到默认选中年份值，
//  把默认选中年份值传到孙页面；孙页面渲染选中年份（annex_title，active_contribution_year）。
//2.当用户在父页面选中贡献图中某个日期格子，把日期格子的年份传到子页面；子页面更新选中年份（annex_title，active_contribution_year）。
//3.当用户在当前页点击选择下拉框中的某一年份，更新选中年份（annex_title，active_contribution_year）。
// （子页面传值到父页面，父页面以选中年份值为条件生成某年贡献图）
// （孙修改爷的传值 （选中当年年份改为当前所选年份），爷页面以选中年份值为条件请求接口获取某年贡献信息）
 // 接收爷爷的响应式选中年份数据  选中年份默认值是当年
const contributionYearInject = inject('contributionYear');

//  接收爷爷的响应式年份列表数据
const archivesContributionYearDataInject=inject("archivesContributionYearData");

//子传父
const emit = defineEmits(['child-click-contribution-year']);



const	data =reactive({
    annex_title: 0,//'请选择' 2024,
    is_show_select:false,
    active_contribution_year:0,//2024
    list:[],
   
});


if(contributionYearInject){
    data.annex_title=contributionYearInject.value;
    data.active_contribution_year=contributionYearInject.value;

}

if(archivesContributionYearDataInject){
    data.list=archivesContributionYearDataInject.value;
}

//选定日期的年份(当用户在父页面选中贡献图中某个日期格子，把日期格子的年份传到子页面，子页面更新选中年份（annex_title）)
const props = defineProps({
    theYearOfTheSelectedDate: Number
});


// 使用ref来存储watch返回的函数
const stopWatch = ref(null);
   

onMounted(() => {
    //点击外部下拉菜单关闭
    window.addEventListener('click', closeselectDown); // 监听全局点击事件
    // 设置一个watch监听器
    // 立即监听，并存储取消监听的函数
    stopWatch.value = watch(
    () => props.theYearOfTheSelectedDate,
    (newValue, oldValue) => {
        // console.log(111);
        // console.log('props.theYearOfTheSelectedDate:',props.theYearOfTheSelectedDate)
        data.active_contribution_year = props.theYearOfTheSelectedDate;
        data.annex_title=props.theYearOfTheSelectedDate;
      // 你可以在这里根据newValue做出响应
    },
    // { immediate: true }
  );

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
    stopWatch.value (); // 如果watch返回了一个停止监听的函数，调用它
});

//显示/隐藏
function clickSelect(){
    data.is_show_select=!data.is_show_select;
}

//点击选择下拉框中的某一年份
function changeSelect (contribution_year){
    data.active_contribution_year = contribution_year;
    data.annex_title=contribution_year;
    data.is_show_select=false;
    emit('child-click-contribution-year',contribution_year);//子传父 
    contributionYearInject.value=contribution_year;//孙修改爷的传值 （选中当年年份改为当前所选年份）响应式 
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


              .select-content {
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
  
  
  
  