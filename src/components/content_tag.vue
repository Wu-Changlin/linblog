<template>
    <div class="channel-container">
    
        <div  class="channel-scroll-container" >
          <div  class="content-container" @mouseenter="data.showAll = true" @mouseleave="data.showAll = false">
            
              <div class="channel" v-for="(item, index) in Showhidden()" :key="index" @click="clickFronEndTag(item.tag_id)"> {{ item.tag_name }}</div>
              
              
  
          </div>
          <div class="channel" > <svg-icon icon-class="arrow-up"/> <svg-icon icon-class="arrow-down"/></div>
          
        </div>

  
      </div>

 
  <div class="sticky-box" :style="{display:(data.isFixed?'block':'none')}">
    <div class="channel-container">
    
      <div  class="channel-scroll-container" >
        <div  class="content-container" @mouseenter="data.showAll = true" @mouseleave="data.showAll = false">
          
            <div class="channel" v-for="(item, index) in Showhidden()" :key="index" @click="clickFronEndTag(item.tag_id)"> {{ item.tag_name }}</div>
            
            

        </div>
        <div class="channel"> 更多</div>
      </div>


   



    </div>
  </div>
</template>


<script setup>
    import { reactive ,ref} from 'vue';
    import { useRouter } from "vue-router";
    const router = useRouter();


     const data=reactive({
        isFixed:false, //悬浮内容标签栏 
        list: [
          { tag_id: 1, tag_name: "c" },
          { tag_id: 2, tag_name: "C++" },
          { tag_id: 3, tag_name: "Java" },
          { tag_id: 4, tag_name: "Python" },
          { tag_id: 5, tag_name: "PHP" },
          { tag_id: 6, tag_name: "Go" },
          { tag_id: 7, tag_name: "Ruby" },
          { tag_id: 8, tag_name: "Node.js" },
          { tag_id: 9, tag_name: "C#" },
          { tag_id: 10, tag_name: "html" },
          { tag_id: 11, tag_name: "html5" },
          { tag_id: 12, tag_name: "css" },
          { tag_id: 13, tag_name: "css3" },
          { tag_id: 14, tag_name: "js" },
          { tag_id: 15, tag_name: "ts" },
          { tag_id: 16, tag_name: "vue2" },
          { tag_id: 17, tag_name: "vue3" },
          { tag_id: 18, tag_name: "jq" },
          { tag_id: 19, tag_name: "React" },
        ],
        showAll: false,
      
    })


      function  Showhidden() {
        if (data.showAll == false) {
          //不显示全部数据
          var showList = []; //空数组
          if (data.list.length > 6) {
            //只显示6条
            for (var i = 0; i < 6; i++) {
              showList.push(data.list[i]); //将数组对象的前5条存放到showList数组中
            }
          } else {
            showList = data.list; //个数足够显示，不需要在截取
          }
          return showList;
        } else {
          //显示全部数据
          return data.list;
        }
      }


    // function  Showhidden() {
    //     var showList = []; //空数组
    //       if (data.list.length > 6) {//数组长度大于6 默认值根据屏幕大小配置显示数量
    //         showList=data.list.slice(0, 5);//将数组对象的前5条存放到showList数组中
    //     }else{//数组长度小于6 
    //         showList= data.list;
    //     } 
    //     return showList;
    //   }

      function  showAll() {
        var showList = []; //空数组
        showList=data.list.slice(5);//将数组对象的第5条后存放到showList数组中
        return showList;
      }


      function clickFronEndTag(tagId){

        console.log('tagId:'+tagId);
        data.showAll=false;//关闭鼠标移入效果

      }


    /*吸顶效果 开始*/
    //滑动监听
    const scrollTop=()=>{
        let top=document.documentElement.scrollTop || window.pageYOffset ||document.body.scrollTop; //兼容写法
        let offsetTop = document.querySelector('.channel-scroll-container').offsetTop;//获取内容标签栏高度
        if(top > offsetTop){//如果下滑超过内容标签栏，那么显示悬浮内容标签栏
          data.isFixed=true;
        }else{
          data.isFixed=false;
        }
    
    }
    
    //初始化
    async function getInit(){
      if(data.isFixed!=true){
        window.addEventListener('scroll',scrollTop);  
      }          
    }
    
    getInit();
      
    /*吸顶效果 结束*/
    </script>

    <style>

.channel-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    -webkit-user-select: none;
    position: relative;/*相对固定 防止吸顶时页面会上下跳*/
 
    .channel-scroll-container {
      backdrop-filter: blur(20px);
      background-color: transparent;
      width: 100%;
      display: flex;
      user-select: none;
      -webkit-user-select: none;
      align-items: center;
      font-size: 16px;
      color: var(--text);
      height: 40px;
      white-space: nowrap;
      height: 72px;
      overflow: hidden;
    
      .content-container {
        display: flex;
        /* white-space: nowrap; */
        color: var(--text);


        .active {
          font-weight: 600;
          background: var(--bg);
          border-radius: 999px;
          color: var(--text);
        }

        .channel {
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 16px;
          cursor: pointer;
          -webkit-user-select: none;
          user-select: none;
            /*鼠标移入效果*/
          &:hover{ 
            background-color: rgba(0, 0, 0, 0.03);
            border-radius: 999px;
            color: var(--text);
          }
        }
       
      }
    }
  }

   /* 占位 吸顶标签栏 */
 .sticky-box  {
      margin: 0px 0px;
      top: 72px;
      width: 100%;
      height: 72px;
      background: var(--mask-paper);
      display: flex;
      justify-content: center;
      z-index: 1001;
      position: fixed;
      background: var(--bg);
      color: var(--text);
    }
    </style>