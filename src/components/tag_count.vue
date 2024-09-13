<template>
    
        
        <div class="tag-count-content-container">
            
          
          <a :style="{backgroundColor: getDarkRandomColor()} " 
          :class=" {'tag-count-item':true,'active':data.active_id==item.tag_id?true:'','no-active':data.active_id!=item.tag_id && data.active_id!=-1?true:''}"
           v-for="(item, index) in data.list" :key="index" @click="clickTag(item.tag_id,item.tag_name)">
            {{ item.tag_name }}
          </a>
        </div>

</template>


<script setup>
  import { reactive ,ref,nextTick,onMounted,onUnmounted} from 'vue';
  import { useRouter } from "vue-router";
  const router = useRouter();
  const tagRef = ref();//获取元素高度

   const data=reactive({
      active_id:-1,
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
        { tag_id: 27, tag_name: "c" },
        { tag_id: 28, tag_name: "C++" },
        { tag_id: 29, tag_name: "Java" },
        { tag_id: 30, tag_name: "Python" },
        { tag_id: 31, tag_name: "PHP" },
        { tag_id: 32, tag_name: "Go" },
        { tag_id: 33, tag_name: "Ruby" },
        { tag_id: 34, tag_name: "Node.js" },
        { tag_id: 35, tag_name: "C#" },
        { tag_id: 36, tag_name: "html" },
        { tag_id: 37, tag_name: "html5" },
        { tag_id: 38, tag_name: "css" },
        { tag_id: 39, tag_name: "css3" },
        { tag_id: 40, tag_name: "js" },
        { tag_id: 41, tag_name: "ts" },
        { tag_id: 42, tag_name: "vue2" },
        { tag_id: 43, tag_name: "vue3" },
        { tag_id: 44, tag_name: "jq" },
        { tag_id: 45, tag_name: "React" },
        { tag_id: 46, tag_name: "Swift" },
        { tag_id: 47, tag_name: "Kotlin" },
        { tag_id: 48, tag_name: "Fortran" },
        { tag_id: 49, tag_name: "MATLAB" },
        { tag_id: 50, tag_name: "r" },
        { tag_id: 51, tag_name: "d" },
        { tag_id: 52, tag_name: "sas" },
      ],
  })


  const emit = defineEmits(['child-click-tag'])



  function clickTag(tag_id,tag_name){
    // console.log('tag_id:',tag_id,',tag_name:',tag_name);
    

    if (data.active_id==tag_id) {
        data.active_id = -1;
      } else {
        data.active_id = tag_id;
      }
      console.log('tag_id:',tag_id,', data.active_id:', data.active_id);

    emit('child-click-tag',tag_id,tag_name);
    // console.log('data.tagActive:',data.tagActive);
  }



  //问题：切换主题随机颜色没有响应
function getandomColor(){
  // 从取缓存中取值，给个默认值。
  const theme = ref(localStorage.getItem('theme') || 'light');

  if(theme.value='light'){
    getLightRandomColor();

  }else{
    getDarkRandomColor();
    
  }
}


// 确保颜色不是白色
function getLightRandomColor() {
  let r, g, b;
  do {
    r = Math.floor(Math.random() * 256);
    g = Math.floor(Math.random() * 256);
    b = Math.floor(Math.random() * 256);
  } while (r === 255 || g === 255 || b === 255); // 确保颜色不是白色
 
  return `rgb(${r},${g},${b})`;
}
 
// 排除黑色
function getDarkRandomColor() {
  const min = 1; // 最小颜色值
  const max = 255; // 最大颜色值
  const randomR = Math.floor(Math.random() * (max - min + 1)) + min;
  const randomG = Math.floor(Math.random() * (max - min + 1)) + min;
  const randomB = Math.floor(Math.random() * (max - min + 1)) + min;
 
  // 排除黑色（完全透明或者RGB全为0）
  if (randomR === 0 && randomG === 0 && randomB === 0) {
    return getRandomColor(); // 递归调用自身，直到生成一个不是黑色的随机颜色
  }
 
  return `rgb(${randomR},${randomG},${randomB})`;
}
 

   
</script>

<style scoped>



    .tag-count-content-container{
        display: flex;
        width: 100%;
        flex-wrap: wrap;
      
       
        .tag-count-item {
            /* flex: 1; */
            display :block; 
            text-align:center;
            width: auto;
            margin: 10px;
            height: 30px;
            padding: 10px;
            color: var(--text-light-dark);
            opacity: 5;
            line-height: 50%;
              /*鼠标移入效果*/
              &:hover{ 
                /* background-color: rgba(0, 0, 0, 0.03); */
                border-radius: 999px;
                color: var(--text-light-dark);
              }
         
          }

          .active {
            /* background-color: rgba(0, 0, 0, 0.03); */
            border-radius: 999px;
            color: var(--text-light-dark);
          }

          .no-active {
            /* background-color: rgba(0, 0, 0, 0.03); */
            opacity: 1;
          }
         
           

    }



</style>