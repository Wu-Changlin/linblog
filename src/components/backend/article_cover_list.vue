<template>

<div class="dialog">
  
  <el-dialog :model-value="is_show" :show-close="false" width="100%" align-center>
    <template  #header>
      <div class="header"> 
          <div class="left">
              <el-button type="danger"  @click="close">
                 
						<svg-icon style="width: 20;height: 20;" class="reds-icon" icon-class="error" />

						

                取消
              </el-button>
          </div>

          

            <div class="right">
              <el-button :type="selected.cover_id ? 'success' :'info'" @click="selected.cover_id ? success(selected.cover_id,selected.cover_path) :''">
                <svg-icon style="width: 20;height: 20;" class="reds-icon" icon-class="success" />
                确认 <span v-if="selected.cover_id"> {{ selected.cover_id  }} </span>
              </el-button>
            </div>
      </div>
    </template>
    

    <div class="img-list">
      <div class="img-item" v-for="(item, index) in data.coverList" :class="selected.cover_id==item.id ? 'active' :''" :key="index" @click="changeList(item.id,item.path)">
        <img class="cover_img" :src="item.path" alt="">
      </div>
    </div>

  </el-dialog>

</div>

</template>

<script  setup>
import { ref, reactive} from "vue"

const props=defineProps({  // props 接收父组件传过来的
    is_show:{
        type:Boolean,
        default:false,
    },
})


const emit=defineEmits();

function  close(){
    emit('close');
}


function success(id,path){
  // console.log("success"+id);
  emit('success',id,path);
  emit('close');

}

const selected=reactive({
  cover_id:'',
  cover_path:'',
})


function changeList(id,path){
      if(selected.cover_id == id){
        selected.cover_id  =  false;//初始化
      }else{
        selected.cover_id  =  id;   //添加选中样式
      }
      selected.cover_path  = path;
}


const data=reactive({
      
      coverList: [
        {
          id: "001",
          path:'/public/1.png'
        },
        {
          id: "002",
          path:'/public/2.jpg'
        },
        {
          id: "003",
          path:'/public/3.png'
        },
        {
          id: "004",
          path:'/public/4.jpg'
        },
        {
          id: "005",
          path:'/public/5.png'
        },
        {
          id: "006",
          path:'/public/6.png'
        },
        {
          id: "007",
          path:'/public/7.png'
        },
        {
          id: "008",
          path:'/public/8.png'
        },
        {
          id: "009",
          path:'/public/9.png'
        },
        {
          id: "010",
          path:'/public/10.png'
        },
        {
          id: "011",
          path:'/public/11.png'
        },
        
        {
          id: "012",
          path:'/public/5.png'
        },
          
        {
          id: "013",
          path:'/public/6.png'
        },
          
        {
          id: "014",
          path:'/public/11.png'
        },
          
        {
          id: "015",
          path:'/public/9.png'
        },
        {
          id: "016",
          path:'/public/1.png'
        },
        {
          id: "017",
          path:'/public/2.jpg'
        },
        {
          id: "018",
          path:'/public/3.png'
        },
        {
          id: "019",
          path:'/public/4.jpg'
        },
        {
          id: "020",
          path:'/public/5.png'
        },
        {
          id: "021",
          path:'/public/6.png'
        },
        {
          id: "022",
          path:'/public/7.png'
        },
        {
          id: "023",
          path:'/public/3.png'
        },
        {
          id: "024",
          path:'/public/4.jpg'
        },
        {
          id: "025",
          path:'/public/5.png'
        },
        {
          id: "026",
          path:'/public/6.png'
        },
        {
          id: "027",
          path:'/public/7.png'
        },
        


        {
          id: "001",
          path:'/public/1.png'
        },
        {
          id: "002",
          path:'/public/2.jpg'
        },
        {
          id: "003",
          path:'/public/3.png'
        },
        {
          id: "004",
          path:'/public/4.jpg'
        },
        {
          id: "005",
          path:'/public/5.png'
        },
        {
          id: "006",
          path:'/public/6.png'
        },
        {
          id: "007",
          path:'/public/7.png'
        },
        {
          id: "008",
          path:'/public/8.png'
        },
        {
          id: "009",
          path:'/public/9.png'
        },
        {
          id: "010",
          path:'/public/10.png'
        },
        {
          id: "011",
          path:'/public/11.png'
        },
        
        {
          id: "012",
          path:'/public/5.png'
        },
          
        {
          id: "013",
          path:'/public/6.png'
        },
          
        {
          id: "014",
          path:'/public/11.png'
        },
          
        {
          id: "015",
          path:'/public/9.png'
        },
        {
          id: "016",
          path:'/public/1.png'
        },
        {
          id: "017",
          path:'/public/2.jpg'
        },
        {
          id: "018",
          path:'/public/3.png'
        },
        {
          id: "019",
          path:'/public/4.jpg'
        },
        {
          id: "020",
          path:'/public/5.png'
        },
        {
          id: "021",
          path:'/public/6.png'
        },
        {
          id: "022",
          path:'/public/7.png'
        },
        {
          id: "023",
          path:'/public/3.png'
        },
        {
          id: "024",
          path:'/public/4.jpg'
        },
        {
          id: "025",
          path:'/public/5.png'
        },
        {
          id: "026",
          path:'/public/6.png'
        },
        {
          id: "027",
          path:'/public/7.png'
        },


      ]


})








</script>
  
<style  scoped>


.dialog{
  :deep(.el-dialog) {
      background-color: var(--bg) !important;
      
      
    }

    :deep(.el-dialog__header){
        padding: 0px 0px 0px 0px;
        width: 100%;
      }


      :deep(.el-dialog__body){
         padding: 0px 0px 0px 0px;
      }

}



  
.header{
  height: 60px;
  background-color: var(--card_bg);
  padding: 0px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .left{
    display: flex;
    align-items: center;
    .el-button{
        margin-left: 10px;
      }
  }
  
  .right{
      display: flex;
      align-items: center;
      .el-button{
        margin-right: 10px;
      }
  }

}
  
  
.img-list{
    width: 100%;
    padding-top: 3px;
    background-color:  var(--card_bg);
    display: flex;
    flex-wrap: wrap; /*让弹性盒元素在必要的时候拆行 */
    
    .active{
        display: block;
        line-height: 0;
        font-size: 0;
        vertical-align: middle;
        border: 3px solid #2b89fd;
        -webkit-transform: rotate(0deg);

    }
    .active::before{
        content: "";
        position: absolute;
        right: 0;
        bottom: 0;
        border: 12px solid #2b89fd;
        border-top-color: transparent;
        border-left-color: transparent;
    }
    .active::after{
        content: "";
        display: block;
        width: 5px;
        height: 10px;
        position: absolute;
        right: 4px;
        bottom: 5px;
        border: 1px solid #fff;
        border-top-color: transparent;
        border-left-color: transparent;
        transform: rotate(45deg);
        cursor: pointer;
    }

  
    .img-item{
        width: 205px;
        height: 115px;
        overflow: hidden;
        background-color: var(--card_bg);
        margin: 3px 6px;
        cursor: pointer;
        .cover_img{
            width:  100%;
            height: 100%;
            display: block;
        }
        
    }

}
  
  
  
  </style>
  