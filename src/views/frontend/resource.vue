<template>
  <ContentBanner></ContentBanner>
    <div style="width: 100%;height: auto;">
      <ul @mouseenter="data.showAll = true" @mouseleave="data.showAll = false">
        <li v-for="(item, index) in Showhidden()" :key="index" @click="clickFronEndTag(item.tag_id)" >
          {{ item.tag_name }}
        </li>

          <!-- <li v-if="data.showAll" v-for="(item, index) in showAll()" :key="index" @click="clickFronEndTag(item.tag_id)">
            {{ item.tag_name }}
          </li>  -->
      </ul>  
    </div>

   
      <!-- <div v-if="data.showAll">
          <ul>
            <li v-for="(item, index) in showAll()" :key="index">
              {{ item.age }}
              {{ item.name }}
            </li>
          </ul>
      </div> -->




  </template>
   <script setup>
    import ContentBanner from '@/components/content_banner.vue'
    import { ref,reactive } from 'vue';
     const data=reactive({
        list: [
          { tag_id: 13, tag_name: "张三" },
          { tag_id: 14, tag_name: "李四" },
          { tag_id: 15, tag_name: "王五" },
          { tag_id: 16, tag_name: "赵六" },
          { tag_id: 17, tag_name: "小明" },
          { tag_id: 18, tag_name: "小米" },
          { tag_id: 19, tag_name: "小高" },
          { tag_id: 20, tag_name: "小任" },
          { tag_id: 21, tag_name: "小茹" },
          { tag_id: 22, tag_name: "小白" },
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


   </script>

  <style scoped>
  ul {
     margin: 0;
    padding: 0;
   position:relative;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  li {
    flex: 1;
    height: 30px;
    border: 1px solid pink;
    background-color: #999;
    width: calc((100% - 10px) / 4);
    min-width: calc((100% - 10px) / 4);
    max-width: calc((100% - 10px) / 4);
  }
  li:nth-child(4n) {
    margin-right: 0;
  }
  .show-more {
    width: 100px;
    height: 50px;
    display: flex;

  }
  </style>