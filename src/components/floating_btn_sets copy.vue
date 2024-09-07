<template>
  <div class="floating-btn-sets">

 
  <!-- 浮动按钮集合 开始-->
  <div class="main-box" ref="mainboxRef">

     <!-- 目录按钮 开始-->
     
    <!-- 这里的内容将会被父组件中添加的元素替换 -->
    <slot></slot>

    <!-- 目录按钮 结束-->

    <!-- 菜单按钮 开始-->
    <div class="content-box" ref="contentBox">
      <div class="plus" @click="clickMeun" ref="plus">
        <svg-icon :icon-class="data.menu_icon"/>
      </div>
    
      <div  :style="{'visibility' : isShow ? 'visible' : 'hidden'}" class="cont"  v-for="(menu,index) in menuInfo" :key="index" :ref="setMenuRef(menu.menu_name)">
        <a :href="menu.menu_path">
          <svg-icon class="svg_icon" :icon-class="menu.menu_name" />
        </a>
      </div>
     
    </div>
    <!-- 菜单按钮 结束-->

    <!-- 置顶按钮 开始-->
    
    <!-- 置顶按钮 结束-->

  </div>

  <div class="top" @click="scrollToTop"> 
    <div class="cont">
      <svg-icon  icon-class="top" />
      </div>
  </div>


</div>
 <!-- 浮动按钮集合 结束-->
</template>

<script setup>
import {onMounted,onUnmounted,ref,reactive} from "vue";

// menu_name: string //菜单唯一标识，与路由名保持一致
// menu_title: string //菜单显示名称

const menuInfo = ref([
    {
        menu_id:1,
        menu_name: "index",
        menu_title:"首页",
        menu_path: "/",
    },
    {
      menu_id:2,
      menu_name: "frontend",
      menu_title:"前端",
      menu_path: "/frontend",
    },
    {
      menu_id:3,
      menu_name: "backend",
      menu_title:"后端",
      menu_path: "/backend",
    },

    {
      menu_id:4,
      menu_name: "resource",
      menu_title:"资源",
      menu_path: "/resource",
    },

    {
      menu_id:5,
      menu_name: "archives",
      menu_title:"归档",
      menu_path: "/archives",
    },

    {
      menu_id:6,
      menu_name: "diary",
      menu_title:"随笔",
      menu_path: "/diary",
    },
    
]);

 
const data=reactive( {
    menu_icon:'menu', //菜单图标
});


const index = ref([])
const frontend = ref()
const backend = ref()
const resource = ref()
const archives= ref()

const diary = ref()
const mainboxRef = ref()
const plus = ref()
const isShow = ref(false)
const  isMove = ref(false)


// 创建一个引用列表
const menuRefs = ref([]);

// 设置ref的函数，将其添加到引用列表中
const setMenuRef = (maunId) => {
  return (el) => {
    if (el) {
      menuRefs.value[maunId] = el;
    }
  };
};
 

onMounted(() => {

  // 在组件挂载后，menuRefs将包含所有关联的DOM元素的引用

  // console.log(menuRefs.value);
    // menu(isShow.value)
  //监听鼠标压下
  plus.value.addEventListener("mousedown", onmousedown,true)
})




let startX = 0
let startY = 0
function  onmousedown(e){
  isMove.value = false
  e.preventDefault();
  //监听鼠标移动
  document.body.addEventListener("mousemove", onmousemove,true)
  //监听鼠标抬起
  document.body.addEventListener("mouseup", onmouseup,true)
  //设置鼠标压下的开始 x,y
  startX = e.clientX
  startY = e.clientY
}


function onmousemove(e){
  //获取移动的x距离，y距离
  const moveX = e.clientX -startX
  const moveY = e.clientY -startY
  // console.log("moveX", moveX, "moveY", moveY)
  //设置触发了移动
  isMove.value = true
  let style = window.getComputedStyle(mainboxRef.value)
  //设置right，bottom值来跟随鼠标移动
  mainboxRef.value.style.right = (parseFloat(style.right.replace("px",""))  - moveX)+"px"
  mainboxRef.value.style.bottom = (parseFloat(style.bottom.replace("px","")) - moveY)+"px"
  startX = e.clientX
  startY = e.clientY
}

function onmouseup(e){
  startX = 0
  startX = 0
  document.body.removeEventListener("mousemove", onmousemove,true)
  document.body.removeEventListener("mouseup", onmouseup,true)
}



/**
 * menu点击事件  异步 menuRefs.value 有值，同步menuRefs.value 为空
 */
const clickMeun = async () => {
  // console.log('点击事件触发', menuRefs.value['index']);

  // console.log(menuRefs.value);
  if(isMove.value){
    return
  }

  isShow.value = !isShow.value
  menuRefs.value['index'].classList.remove("index")
  menuRefs.value['frontend'].classList.remove("frontend")
  menuRefs.value['backend'].classList.remove("backend")
  menuRefs.value['resource'].classList.remove("resource")
  menuRefs.value['archives'].classList.remove("archives")
  menuRefs.value['diary'].classList.remove("diary")
  data.menu_icon='menu';//显示菜单图标
  if (isShow.value) {
    
    menuRefs.value['index'].classList.add("index")
    menuRefs.value['frontend'].classList.add("frontend")
    menuRefs.value['backend'].classList.add("backend")
    menuRefs.value['resource'].classList.add("resource")
    menuRefs.value['archives'].classList.add("archives")
    menuRefs.value['diary'].classList.add("diary")
    data.menu_icon='close';//显示关闭图标
  }
};



const interval = ref(null);
const duration = 500; // 动画总时长，单位毫秒
const isScrolling = ref(null);

// 滚动到页面顶部的函数
function scrollToTop() {
 // 如果当前正在滚动，则不再执行
 if (isScrolling.value) return;
 
 // 标记开始滚动
 isScrolling.value = true;

   window.scrollTo({
    top:0,
    behavior:"smooth"
   });
   isScrolling.value = false;
  // if (interval.value) {
  //   clearInterval(interval.value);
  // }
  // interval.value = setInterval(() => {
  //   const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
  //   if (currentScroll > 0) {//滚动过程
  //     window.scrollTo(0, currentScroll - (currentScroll / duration * 10));
  //     // console.log('currentScroll -if:'+currentScroll)
  //   } else {//已滚动到顶部
  //     isScrolling.value = false;
  //       //  console.log('currentScroll -else:'+currentScroll)
  //     clearInterval(interval.value);
  //   }
  // }, 10); // 每10毫秒执行一次

}


</script>

<style scoped>



.floating-btn-sets {
                position: fixed;
                display: flex;
                flex-direction: column;
                width: 40px;
                grid-gap: 8px;
                gap: 8px;
                right: 50px;
                bottom: 50px;
            }

            /* @media screen and (max-width: 959px) {
                .floating-btn-sets[data-v-75df8d6e] {
                    bottom:calc(48px + var(--horizontal)*1px)
                }
            } */
    

    .main-box {
      /* //鼠标拖拽时通过改变right bottom值来根据鼠标移动 */
        position: fixed;
        right: 55px;
        bottom: 72px;
    }

    .top {
      position: fixed;
      width: 32px;
      height: 32px;
      bottom: 5px;
      border-radius: 50%;
      /* transition: opacity 0.5s ease; */
      box-shadow: 
              inset 10px 10px 12px var(--floating_btn_box_shadow_three),
              inset -10px -10px 12px var(--floating_btn_box_shadow_four);
    }
    
    .content-box {
      /* //<!--父容器相对定位--> */
      position: relative;
      background-color: #fff;

    }
    
    .cont {
      /* //<!--6个图标绝对定位  罗列在一起  通过z-index属性设置+号为最上级--> */
      position: absolute;
      width: 32px;
      height: 32px;
      /* background-color: #73e8e8; */
      /* background: linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0)); */
      /* background-color:  var(--blue);  */
      transition: 1s;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: var(--bg);
      box-shadow: 10px 10px 20px #bebebe,
                  -10px -10px 20px #ffffff;
      transition: all 0.2s ease-in-out;     
      .svg_icon {
        fill: var(--primary)!important;
      
      }
  


  &:hover {
  
    cursor: pointer;  
    box-shadow:
        0 0 0 var(--floating_btn_box_shadow_one),  
        0 0 0 var(--floating_btn_box_shadow_two),  
        inset 10px 10px 20px var(--floating_btn_box_shadow_three),   
        inset -10px -10px 20px var(--floating_btn_box_shadow_four);

    .svg_icon {
        fill: var(--blue)!important;
       
      }
      
	}
}


.plus {
  z-index: 1;
  position: absolute;
  width: 32px;
  height: 32px;
  transition: 1s;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: var(--bg);
  box-shadow: 4px 4px 5px #bebebe,
              -4px -4px 5px #ffffff;
}

.plus:active {
  transform: rotate(45deg);
  box-shadow: 
    
    0 0 0 var(--floating_btn_box_shadow_one),  
    0 0 0 var(--floating_btn_box_shadow_two),
    inset 4px 4px 12px var(--floating_btn_box_shadow_three),
    inset -4px -4px 12px var(--floating_btn_box_shadow_four);
}

.index {
  transform: translate(0px, -100px) rotate(360deg);
}

.frontend {
  transform:  translate(-28px, -76px) rotate(360deg);
}

.resource {
  transform: translate(-83px, -27px) rotate(360deg);
}

.backend {
  transform:translate(-55px, -52px) rotate(360deg);
}

.archives {
  transform: translate(-108px, 0px) rotate(360deg);
}

.diary {
  transform: translate(-134px, 27px) rotate(360deg);
}
</style>