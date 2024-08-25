<template>

      <div style="display: flex;">

        <div class="tag-container">
    
          <div :class=" {'content-container':true,'show-all-tag':data.tagWrap}" >
            <div   :class=" {'tag-content':true,'hidden-tag':data.tagNoWrap,'show-all-tag':data.tagWrap}" ref="tagRef"> 
                <div class="tag-item" v-for="(item, index) in Showhidden()" :key="index" @click="clickFronEndTag(item.tag_id)"> {{ item.tag_name }}</div>
              </div>
          </div>
          
          <div v-if="data.tagBtn" class="tag-show-all-bnt-container"   @click="clickTagBtn()">
            <div>
              <svg-icon :icon-class="data.tagBtnType?'arrow-up':'arrow-down'"/>
            </div> 
          </div>
      
        </div>

      </div>
   

     
 
</template>


<script setup>
    import { reactive ,ref,nextTick} from 'vue';
    import { useRouter } from "vue-router";
    const router = useRouter();
    const tagRef = ref();//获取元素高度

     const data=reactive({
        tagHeight:0,
        tagBtn:false,
        tagNoWrap:false,
        tagBtnType:false,
        tagWrap:false,
        list: [
          { tag_id: 1, tag_name: "c" },
          { tag_id: 2, tag_name: "C++" },
          { tag_id: 3, tag_name: "Java" },
          { tag_id: 4, tag_name: "Python" },
          { tag_id: 5, tag_name: "PHP" },
          { tag_id: 6, tag_name: "Go" },
          { tag_id: 7, tag_name: "Ruby" },
          { tag_id: 8, tag_name: "Node.js" },
          // { tag_id: 9, tag_name: "C#" },
          // { tag_id: 10, tag_name: "html" },
          // { tag_id: 11, tag_name: "html5" },
          // { tag_id: 12, tag_name: "css" },
          // { tag_id: 13, tag_name: "css3" },
          // { tag_id: 14, tag_name: "js" },
          // { tag_id: 15, tag_name: "ts" },
          // { tag_id: 16, tag_name: "vue2" },
          // { tag_id: 17, tag_name: "vue3" },
          // { tag_id: 18, tag_name: "jq" },
          // { tag_id: 19, tag_name: "React" },
          // { tag_id: 20, tag_name: "Swift" },
          // { tag_id: 21, tag_name: "Kotlin" },
          // { tag_id: 22, tag_name: "Fortran" },
          // { tag_id: 23, tag_name: "MATLAB" },
          // { tag_id: 24, tag_name: "r" },
          // { tag_id: 25, tag_name: "d" },
          // { tag_id: 26, tag_name: "sas" },
          // { tag_id: 27, tag_name: "c" },
          // { tag_id: 28, tag_name: "C++" },
          // { tag_id: 29, tag_name: "Java" },
          // { tag_id: 30, tag_name: "Python" },
          // { tag_id: 31, tag_name: "PHP" },
          // { tag_id: 32, tag_name: "Go" },
          // { tag_id: 33, tag_name: "Ruby" },
          // { tag_id: 34, tag_name: "Node.js" },
          // { tag_id: 35, tag_name: "C#" },
          // { tag_id: 36, tag_name: "html" },
          // { tag_id: 37, tag_name: "html5" },
          // { tag_id: 38, tag_name: "css" },
          // { tag_id: 39, tag_name: "css3" },
          // { tag_id: 40, tag_name: "js" },
          // { tag_id: 41, tag_name: "ts" },
          // { tag_id: 42, tag_name: "vue2" },
          // { tag_id: 43, tag_name: "vue3" },
          // { tag_id: 44, tag_name: "jq" },
          // { tag_id: 45, tag_name: "React" },
          // { tag_id: 46, tag_name: "Swift" },
          // { tag_id: 47, tag_name: "Kotlin" },
          // { tag_id: 48, tag_name: "Fortran" },
          // { tag_id: 49, tag_name: "MATLAB" },
          // { tag_id: 50, tag_name: "r" },
          // { tag_id: 51, tag_name: "d" },
          // { tag_id: 52, tag_name: "sas" },
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
        if(data.tagHeight>72){//元素高度大于72说明需要数据溢出需隐藏
          data.tagNoWrap=true; 
          data.tagBtn=true; //显示打开或收起
          
        }
        
      });
     

      return data.list;
      
    }



//点击标签按钮事件；下折叠false，上展开true。    
function clickTagBtn () {
  //取反值
  data.tagBtnType=!data.tagBtnType;
  if(data.tagBtnType){
    data.tagNoWrap=false;
    data.tagWrap=true;
  }else{
    data.tagNoWrap=true;
    data.tagWrap=false;
  }

};

    




      
</script>

<style>



.tag-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
    -webkit-user-select: none;
    position: fixed;
    z-index: 1000;
    width: 100%;
    max-width: 1285px;
  

    .content-container {
      display: inline-grid;
      flex: 1;
      height: 100%;
      position: relative;
      /* backdrop-filter: blur(20px); */
      background-color: var(--bg);
      width: 100%;
      /* display: flex; */
      user-select: none;
      -webkit-user-select: none;
      align-items: center;
      font-size: 16px;
      color: var(--text);
      height: 40px;
      /* white-space: wrap; */
      height: 72px;
      /* height: auto; */
      overflow: hidden;
      .tag-content {
        display: flex;
        color: var(--text);
         /*这是关键属性，flex模式允许换行 */
        flex-wrap: wrap;
        overflow: hidden;
        .active {
          font-weight: 600;
          background: var(--bg);
          border-radius: 999px;
          color: var(--text);
        }

        .tag-item {
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



  .tag-show-all-bnt-container{
    position: absolute;
    right: 0px;
    width: 28px;
    height: 28px;
    padding: 8px;
    margin-left: 10px;
    align-self: start;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: 4px;
    transition: .2s;
    bottom: 10px;
    background-color: var(--bg);
}



  /* 
  show就是展开的时候使用的样式名称，
  hidde是显示一行是使用的样式（主要就是控制容器高度） 
  */




 
    .hidden-tag{
    /*这是关键属性，flex模式禁止换行 */
    flex-wrap: nowrap !important;
		/* .tag-content {
         
          flex-wrap: nowrap;
    } */
	}



  .show-all-tag{
    height: auto!important;
    flex-wrap: wrap!important;
        /* .content-container{
          
        } */

        /*这是关键属性，flex模式允许换行 */
        /* .tag-content {
          
         
        } 
        */
    }


</style>