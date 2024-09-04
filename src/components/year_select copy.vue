<template>


    <div class="select-container">
        <div class="select-comtent">
            <!-- 选中后的内容 -->
            <div class="selectinfos"   @click="clickSelect()" > {{ data.annex_title }} </div>
            <!-- 三角形图标 -->
            <div style="display: flex; margin: auto; padding-top: 15px;padding-right: 3px;"><svg-icon  icon-class="arrow-down"/></div>
        </div>
        <div class="select-list" :style="{display:data.is_show_select?'block':'none'}">
        <!-- 下拉框列表 -->
            <ul>
                <li :class="{'contribution-year-active':data.active_contribution_year==item.contribution_year?'true':''}" v-for="(item,index) in data.Files" :key="item.value" @click="changeSelect(item.contribution_year)">
                    {{ item.contribution_year }}
                </li>
            </ul>
        </div>
    </div>

  
    
  </template>
  
  <script setup>
import { reactive,defineEmits} from 'vue'

const emit = defineEmits(['child-click-contribution-year'])



const	data =reactive({
    annex_title: '请选择',
    is_show_select:false,
    active_contribution_year:0,
    Files: [
        {
            contribution_year: 2024,
            contribution_year_id: 1,
        },
        {
            contribution_year: 2023,
            contribution_year_id: 2,
        },
        {
            contribution_year: 2022,
            contribution_year_id: 3,
        },
        {
            contribution_year:2021,
            contribution_year_id: 4,

        },
    ],
})

//点击外部下拉菜单关闭
window.addEventListener('click', closeselectDown());

function closeselectDown(){
    if(data.is_show_select){
        data.is_show_select=false;
    }
}

//显示/隐藏
function clickSelect(){
    data.is_show_select=!data.is_show_select;
}

//点击选择下拉框中的某一选项
function changeSelect (contribution_year){
    data.active_contribution_year = contribution_year;
    data.annex_title=contribution_year;
    emit('child-click-contribution-year',contribution_year);//子传父 
   
    closeselectDown();
}
                  
  
          
  
              
  
  </script>
  
  
  <style>
          /* 三角形图标 */
              
  
              
              /*  重新写一个下拉框组件  */
              .select-container{
                  /*width:100%;*/
                  height:100%;
                  font-family: MicrosoftYaHei-Bold;
                  font-size: 14px;
                  font-weight: normal;
                  font-stretch: normal;
                  letter-spacing: 0px;
                  color: #333333;
                  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
              
                  
              }
              .select-comtent {
                  margin-top:2px;
                  width:130px;
                  height:40px;
                  border:1px solid #131D88;
                  cursor:pointer;
              }
              .select-comtent .selectinfos{
                  width:120px;
                  height:40px;
                  text-align:center;
                  line-height:40px;
                  white-space:nowrap;
                  text-overflow:ellipsis;
                  overflow:hidden ;
                  list-style:none;
                  float:left;
                  position: relative;
              }
              
              /* 出现的下拉列表 */
              .select-list{
                  display: none;
                  position:absolute;
                  margin-top: 10px;
                  background-color:#ffffff;
                  z-index:800;
                  border-radius:5px;
                  border:1px solid #E4E7ED;
                  position: absolute;
              }
              .select-list>ul{
                  margin: 0;
                  padding: 0;
              }
              .select-container li{
                  width:168px;
                  padding:0 10px;
                  height:34px;
                  line-height:34px;
                  white-space:nowrap;
                  /*background-color:#ffffff;*/
                  white-space:nowrap;
                  text-overflow:ellipsis;
                  overflow:hidden ;
                  list-style:none;
                  cursor:pointer;
              }
              .select-container li:hover{
                  color: #409EFF;
                  font-weight: 700;
                  background-color:#F5F7FA;
              }

              .contribution-year-active{
                color: #409EFF;
                font-weight: 700;
                background-color:#F5F7FA;
              }
  </style>
  
  
  
  