<template>
    <div class="channel-container">
    
        <div  class="channel-scroll-container" >
          <div  class="content-container" ref="tagRef">

              <div class="channel" v-for="(item, index) in Showhidden()" :key="index" @click="clickFronEndTag(item.tag_id)"> {{ item.tag_name }}</div>
              <div class="channel" v-if="data.tagHeight>72" @click="data.tagType = !data.tagType"> <svg-icon :icon-class="data.tagType?'arrow-up':'arrow-down'"/></div>
          
          </div>
          
        </div>

      </div>


       

 
  <!-- <div class="sticky-box" :style="{display:(data.isFixed?'block':'none')}">
    <div class="channel-container">
    
      <div  class="channel-scroll-container" >
        <div  class="content-container" @mouseenter="data.showAll = true" @mouseleave="data.showAll = false">
          
            <div class="channel" v-for="(item, index) in Showhidden()" :key="index" @click="clickFronEndTag(item.tag_id)"> {{ item.tag_name }}</div>
            
            

        </div>
        <div class="channel"> 更多</div>
      </div>


   



    </div>
  </div> -->
</template>


<script setup>
    import { reactive ,ref,nextTick} from 'vue';
    import { useRouter } from "vue-router";
    const router = useRouter();
    const tagRef = ref(null);//获取元素高度

     const data=reactive({
        tagHeight:0,
        tagType:false,
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
          { tag_id: 20, tag_name: "Swift" },
          { tag_id: 21, tag_name: "Kotlin" },
          { tag_id: 22, tag_name: "Fortran" },
          { tag_id: 23, tag_name: "MATLAB" },
          { tag_id: 24, tag_name: "r" },
          { tag_id: 25, tag_name: "d" },
          { tag_id: 26, tag_name: "sas" },
        ],
        showAll: false,
      
    })

// nextTick() 的使用场景
// 在数据变化后等待DOM更新
// 这是 nextTick() 最常见的用途。
//例如，你可能更改了一个数据属性，该属性控制一个元素的可见性。
// 然后你可能想要等待DOM更新以便可以获取该元素的新的宽度或高度。
// 在这种情况下，你可以使用 nextTick() 来确保你的代码在DOM更新后执行。


    function  Showhidden() {
      
      nextTick(() => {
        // console.log('tagRef:',tagRef.value.clientHeight);
        data.tagHeight=tagRef.value.clientHeight;//元素高度
        
      });
     

      return data.list;
      
    }


      // function  Showhidden() {
      
      //   if (data.showAll == false) {
      //     //不显示全部数据
      //     var showList = []; //空数组
      //     if (data.list.length > 6) {
      //       //只显示6条
      //       for (var i = 0; i < 6; i++) {
      //         showList.push(data.list[i]); //将数组对象的前5条存放到showList数组中
      //       }
      //     } else {
      //       showList = data.list; //个数足够显示，不需要在截取
      //     }
      //     return showList;
      //   } else {
      //     //显示全部数据
      //     return data.list;
      //   }
      // }


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
    // const scrollTop=()=>{
    //     let top=document.documentElement.scrollTop || window.pageYOffset ||document.body.scrollTop; //兼容写法
    //     let offsetTop = document.querySelector('.channel-scroll-container').offsetTop;//获取内容标签栏高度
    //     if(top > offsetTop){//如果下滑超过内容标签栏，那么显示悬浮内容标签栏
    //       data.isFixed=true;
    //     }else{
    //       data.isFixed=false;
    //     }
    
    // }
    
    // //初始化
    // async function getInit(){
    //   if(data.isFixed!=true){
    //     window.addEventListener('scroll',scrollTop);  
    //   }          
    // }
    
    // getInit();
      
    /*吸顶效果 结束*/
    </script>

<style>

.channel-container {
    /* display: flex; */
    justify-content: space-between;
    align-items: center;
    user-select: none;
    -webkit-user-select: none;
    position: fixed;/*固定*/
    z-index: 1000;
    width: 100%;
     /* 
    .feeds-page {
      flex: 1;
      padding-left: 12px;
      padding-right: 12px;
      box-sizing: border-box; 修改盒子大小属性 
    }
    子元素继承父元素padding-left  手机端左边留白
    子元素固定定位产生了空白，可以通过调整子元素的top或left属性来对齐它。
    */
    @media screen and (max-width: 695px) {
      left: 0px; 
      
		}
   
		@media screen and (min-width: 696px) and (max-width: 959px) {
      left: 0px;
		}  

    .channel-scroll-container {
      backdrop-filter: blur(20px);
      background-color: var(--bg);
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
      @media screen and (max-width: 959px) {
			 left: 0px;
			/* visibility: hidden; */
			
		}
    
      .content-container {
        display: flex;
        /* white-space: nowrap; */
        color: var(--text);
        /*这是关键属性，flex模式允许换行 */
        /* flex-wrap: wrap;  */
        /* overflow: hidden; */
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

</style>