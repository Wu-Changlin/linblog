<template>
  
  <!-- 浮动按钮集合 开始-->

   <!-- 菜单按钮 开始-->
  <div class="main-box" ref="main-box">
    <div class="content-box" ref="contentBox">
      <div class="plus" @click="clickMeun" ref="plus">
        <svg-icon :icon-class="data.menu_icon"/>
      </div>
     
      <div class="cont"  v-for="(menu,index) in menuInfo" :key="index" :ref="setMenuRef(menu.menu_name)">
        <a :href="menu.menu_path">
          <svg-icon class="svg_icon" :icon-class="menu.menu_name" />
        </a>
      </div>
     
    </div>
  </div>
   <!-- 菜单按钮 结束-->

   <!-- 置顶按钮 开始-->
  <div class="top" @click="toTop"> 
    <div class="cont">
      <svg-icon  icon-class="top" />
    </div>
  </div>
 <!-- 置顶按钮 结束-->

 <!-- 浮动按钮集合 结束-->
</template>

<script setup>
import {onMounted,ref,reactive} from "vue";

// menu_name: string //菜单唯一标识，与路由名保持一致
// menu_chinese_name: string //菜单显示名称

const menuInfo = ref([
    {
        menu_id:1,
        menu_name: "index",
        menu_chinese_name:"首页",
        menu_path: "/",
    },
    {
      menu_id:2,
      menu_name: "frontend",
      menu_chinese_name:"前端",
      menu_path: "/frontend",
    },
    {
      menu_id:3,
      menu_name: "backend",
      menu_chinese_name:"后端",
      menu_path: "/backend",
    },

    {
      menu_id:4,
      menu_name: "resource",
      menu_chinese_name:"资源",
      menu_path: "/resource",
    },

    {
      menu_id:5,
      menu_name: "archives",
      menu_chinese_name:"归档",
      menu_path: "/archives",
    },

    {
      menu_id:6,
      menu_name: "diary",
      menu_chinese_name:"随笔",
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
const mainBox = ref()
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
  let style = window.getComputedStyle(mainBox.value)
  //设置right，bottom值来跟随鼠标移动
  mainBox.value.style.right = (parseFloat(style.right.replace("px",""))  - moveX)+"px"
  mainBox.value.style.bottom = (parseFloat(style.bottom.replace("px","")) - moveY)+"px"
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

</script>

<style scoped>
    .top {
      position: fixed;
      width: 32px;
      height: 32px;
      bottom: 20px;
      right: 20px;
    }

    .main-box {
      /* //鼠标拖拽时通过改变right bottom值来根据鼠标移动 */
        position: fixed;
        right: 50px;
        bottom: 100px;
    }
    .content-box {
      /* //<!--父容器相对定位--> */
      position: relative;

    }
.cont {
  /* //<!--5个图标绝对定位  罗列在一起  通过z-index属性设置+号为最上级--> */
  position: absolute;
  width: 32px;
  height: 32px;
  /* background-color: #73e8e8; */
  /* background: linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0)); */
  background-color:  var(--blue); 
  transition: 1s;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;

  .svg_icon {
    fill: var(--primary)!important;
  }

  &:hover {
      border: 1px solid var(--blue);
      .svg_icon {
        fill: var(--blue)!important;
      }
      background-color: var(--bg);
      /* background: linear-gradient(45deg, rgba(255,255,255,3), rgba(255,255,255,6)); */
	}
}


.plus {
  z-index: 1;
  position: absolute;
  width: 32px;
  height: 32px;
  background-color:  #4298e7; 
  transition: 1s;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

/* .plus:active {
  transform: rotate(45deg);
} */

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