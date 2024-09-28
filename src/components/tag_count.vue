<template>
    
        
        <div class="tag-count-content-container">
            
          
          <a :style="{backgroundColor:theme=='light'? getLightRandomColor():getDarkRandomColor()} " 
          :class=" {'tag-count-item':true,'active':item.tag_id === data.active_tag_count_tag_id?true:'','no-active':item.tag_id != data.active_tag_count_tag_id && data.active_tag_count_tag_id>-1?true:''}"
           v-for="(item, index) in data.list" :key="index" @click="clickTag(item.menu_name,item.tag_id,item.tag_name)">
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
      active_tag_count_tag_id:-1,
      list: [],
  })


  
const props = defineProps({
  parentPageTagCountData: {//父页面传标签数据
      type: Array
    }
  });

  if(props.parentPageTagCountData){
    data.list=props.parentPageTagCountData;
  }

  const emit = defineEmits(['getTagCountPageClickTagArticleDataEmit'])



  function clickTag(menu_name,tag_id,tag_name){
    // console.log('tag_id:',tag_id,',tag_name:',tag_name);
    if (data.active_tag_count_tag_id==tag_id) {
        data.active_tag_count_tag_id = -1;
        emit('getTagCountPageClickTagArticleDataEmit',-1,'');
      } else {
        data.active_tag_count_tag_id = tag_id;
        emit('getTagCountPageClickTagArticleDataEmit',menu_name,tag_id,tag_name);
        // console.log('getTagCountPageClickTagArticleDataEmit:',tag_id,'-name:',tag_name);
      }
      // console.log('tag_id:',tag_id,', data.active_tag_count_tag_id:', data.active_tag_count_tag_id);
  }
  //切换主题，随机颜色去除主题背景色
  const theme = ref(localStorage.getItem('theme') || 'light');


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
              /* 防止移动端重复点击同一元素没有取消选中样式 */
              @media screen and (min-width: 1200px) {
                &:hover{ 
                /* background-color: rgba(0, 0, 0, 0.03); */
                border-radius: 999px;
                color: var(--text-light-dark);
              } 
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
            border-radius:0 !important;
          }
         
           

    }



</style>