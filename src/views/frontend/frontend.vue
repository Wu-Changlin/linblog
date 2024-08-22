<template>
  <div class="mainBox" ref="mainBox">
    <div class="contentBox" ref="contentBox">
      <div class="plus cont" @click="menu" ref="plus">
        <img src="../../../assets/images/icons/plus.png" alt="">
      </div>
      <div class="cont" ref="index">
        <img src="../../../assets/images/icons/index.png" alt="">
      </div>
      <div class="cont" ref="frontend">
        <img src="../../../assets/images/icons/frontend.png" alt="">
      </div>
      <div class="cont" ref="backend">
        <img src="../../../assets/images/icons/backend.png" alt="">
      </div>
      <div class="cont" ref="resource">
        <img src="../../../assets/images/icons/resource.png" alt="">
      </div>
      <div class="cont" ref="archives">
        <img src="../../../assets/images/icons/archives.png" alt="">
      </div>
      <div class="cont" ref="diary">
        <img src="../../../assets/images/icons/diary.png" alt="">
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted,ref} from "vue";
const index = ref()
const backend = ref()
const resource = ref()
const diary = ref()
const mainBox = ref()
const plus = ref()
const isShow = ref(false)
const  isMove = ref(false)
onMounted(() => {
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
  console.log("moveX", moveX, "moveY", moveY)
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
 * menu点击事件
 */
function menu() {
  //如果移动中不处理
  if(isMove.value){
    return
  }
  isShow.value = !isShow.value
  index.value.classList.remove("index")
  backend.value.classList.remove("backend")
  resource.value.classList.remove("resource")
  diary.value.classList.remove("diary")
  if (isShow.value) {
    index.value.classList.add("index")
    backend.value.classList.add("backend")
    resource.value.classList.add("resource")
    diary.value.classList.add("diary")
  }
}
</script>

<style scoped>
.mainBox {
  /* //鼠标拖拽时通过改变right bottom值来根据鼠标移动 */
  position: fixed;
  right: 50px;
  bottom: 50px;
}
.contentBox {
  /* //<!--父容器相对定位--> */
  position: relative;
}
.cont {
  /* //<!--5个图标绝对定位  罗列在一起  通过z-index属性设置+号为最上级--> */
  position: absolute;
  width: 32px;
  height: 32px;
  background-color: #6cd083;
  transition: 1s;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
img {
  width: 22px;
  height: 22px;
}
.plus {
  z-index: 1;
}

.plus:active {
  transform: rotate(45deg);
}
.index {
  transform: translate(-100px, 0px) rotate(360deg);
}
.backend {
  transform: translate(-82px, -47px) rotate(360deg);
}
.resource {
  transform: translate(-50px, -83px) rotate(360deg);
}
.diary {
  transform: translate(0px, -100px) rotate(360deg);
}
</style>