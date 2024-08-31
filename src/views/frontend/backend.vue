<template>


  <div style="padding-top: 200px;"></div>

    
  <div id="select_module">
    <div class="divSelect">
        <div class="divSelectinput">
            <!-- 选中后的内容 -->
            <div class="selectinfos"   @click="clickSelect()" :title="annexTitle"> {{ data.annexTitle }} </div>
            <!-- 三角形图标 -->
            <div class="imgthree"></div>
        </div>
        <div class="Selectlist" :style="{display:data.is_show_select?'block':'none'}">
        <!-- 下拉框列表 -->
            <ul>
                <li v-for="(item,index) in data.Files" :key="item.value" @click="changeSelect(item.FileName)">
                    {{ item.FileName }}
                </li>
            </ul>
        </div>
    </div>
</div>

  
</template>

<script setup>
    import { reactive,} from 'vue'
 
			const	data =reactive({
					annexTitle: '请选择',
                    is_show_select:false,
					Files: [
						{
							FileName: '第一个：法律',
							value: 1,
						},
						{
							FileName: '第二个：经济',
							value: 2,
						},
						{
							FileName: '第三个：政治',
							value: 3,
						},
						{
							FileName: '第四个：安全',
							value: 4,
						},
					],
				})
				
				
                
                function clickSelect(){
                    data.is_show_select=!data.is_show_select;
                    console.log(111);
                }
                
                //点击选择下拉框中的某一选项
                function changeSelect (FileName){
						data.annexTitle = FileName;
					}
				

		

			

</script>


<style>
    	/* 三角形图标 */
			.imgthree {
				margin-top: 17px;
				width: 6px;
				height: 6px;
				background: url(../img/shape.png) 0px 0px;
				background-repeat: no-repeat;
				float: left;

			}

			.imgthree2 {
				animation: imgthreeanimation2 0.5s forwards;
			}

			@keyframes imgthreeanimation2 {
				0% {
					transform: rotate(0deg);
				}

				100% {
					transform: rotate(180deg);
				}
			}
			/*  重新写一个下拉框组件  */
			.divSelect{
			    /*width:100%;*/
			    height:100%;
			
			    font-family: MicrosoftYaHei-Bold;
				font-size: 14px;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 0px;
				color: #333333;
			
			    
			}
			.divSelectinput {
			    margin-top:2px;
			    width:130px;
			    height:40px;
				border:1px solid #131D88;
			    cursor:pointer;
			}
			.divSelectinput .selectinfos{
			    width:120px;
			    height:40px;
			    text-align:center;
			    line-height:40px;
			    white-space:nowrap;
			    text-overflow:ellipsis;
				overflow:hidden ;
			    list-style:none;
			    float:left;
			}
			
			/* 出现的下拉列表 */
			.Selectlist{
                display: none;
			    position:absolute;
				margin-top: 10px;
			    background-color:#ffffff;
			    z-index:800;
			    border-radius:5px;
			    border:1px solid #E4E7ED;
			}
			.Selectlist>ul{
				margin: 0;
				padding: 0;
			}
			.divSelect li{
			    width:238px;
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
			.divSelect li:hover{
			    color: #409EFF;
			    font-weight: 700;
			    background-color:#F5F7FA;
			}
</style>



