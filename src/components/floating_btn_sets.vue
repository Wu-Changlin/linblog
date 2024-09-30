<template>
   <!-- 浮动按钮集合 开始-->
  <div class="floating-btn-sets side-toolbar">

      <!-- 菜单按钮 开始-->
    <div class="menu-container">
      <div class="btn-wrapper">
        <div class="main-box" ref="mainBoxRef">

          <div class="content-box" ref="contentBox">
            <div class="plus" @click="clickMenu" ref="plus">
              <svg-icon :icon-class="current_active_menu_icon" />
            </div>

            <div :style="{'visibility' : isShow ? 'visible' : 'hidden'}" class="cont" v-for="(menu,index) in parentPageMenuData"
              :key="index" :ref="setMenuRef(menu.menu_name)">
              <a :href="menu.menu_path">
                <svg-icon class="svg-icon" :icon-class="menu.menu_name" />
              </a>
              <span class="svg-icon-text">{{menu.menu_title}}</span>
            </div>
          </div>
         
        </div>
      </div>

      <div class="tip-container">
        <span class="tip-text">导航</span>
      </div>

    </div>
     <!-- 菜单按钮 结束-->

    
    <!-- 置顶按钮 开始-->   
    <div class="top" @click="scrollToTop">
      <div class="btn-wrapper">
        <div class="cont">
          <svg-icon icon-class="top" />
        </div>
      </div>


      <div class="tip-container">
        <span class="tip-text">置顶</span>
      </div>

    </div>
    <!-- 置顶按钮 结束-->

    <!-- 目录按钮 开始-->
    <!-- 这里的内容将会被父组件中添加的元素替换 -->
    <slot></slot>
    <!-- 目录按钮 结束-->

  </div>

  <!-- 浮动按钮集合 结束-->
</template>

<script setup>
  import { onMounted, onUnmounted, ref, reactive,nextTick } from "vue";

  // menu_name: string //菜单唯一标识，与路由名保持一致
  // menu_title: string //菜单显示名称
  const props = defineProps({

	  parentPageMenuData: {
			type: Array,
    	},
    
});


  const index = ref([])
  const frontend = ref()
  const backend = ref()
  const resource = ref()
  const archives = ref()

  const diary = ref()
  const mainBoxRef = ref()
  const plus = ref()
  const isShow = ref(false)
  const isMove = ref(false)


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
    plus.value.addEventListener("mousedown", onmousedown, true)
  })




  let startX = 0
  let startY = 0
  function onmousedown(e) {
    isMove.value = false
    e.preventDefault();
    //监听鼠标移动
    document.body.addEventListener("mousemove", onmousemove, true)
    //监听鼠标抬起
    document.body.addEventListener("mouseup", onmouseup, true)
    //设置鼠标压下的开始 x,y
    startX = e.clientX
    startY = e.clientY
  }


  function onmousemove(e) {
    //获取移动的x距离，y距离
    const moveX = e.clientX - startX
    const moveY = e.clientY - startY
    // console.log("moveX", moveX, "moveY", moveY)
    //设置触发了移动
    isMove.value = true
    let style = window.getComputedStyle(mainBoxRef.value)
    //设置right，bottom值来跟随鼠标移动
    mainBoxRef.value.style.right = (parseFloat(style.right.replace("px", "")) - moveX) + "px"
    mainBoxRef.value.style.bottom = (parseFloat(style.bottom.replace("px", "")) - moveY) + "px"
    startX = e.clientX
    startY = e.clientY
  }

  function onmouseup(e) {
    startX = 0
    startX = 0
    document.body.removeEventListener("mousemove", onmousemove, true)
    document.body.removeEventListener("mouseup", onmouseup, true)
  }


const current_active_menu_icon=ref('menu')

  /**
   * menu点击事件  异步 menuRefs.value 有值，同步menuRefs.value 为空
   */
  const clickMenu = async () => {
    // console.log('点击事件触发', menuRefs.value['index']);

    // console.log(menuRefs.value);
    if (isMove.value) {
      return
    }

    isShow.value = !isShow.value
     for(let i=0;i<props.parentPageMenuData.length;i++){
      const menu_name=props.parentPageMenuData[i].menu_name;
       menuRefs.value[menu_name].classList.remove(menu_name);
     }
   
    //  menuRefs.value['index'].classList.remove("index")
    // menuRefs.value['frontend'].classList.remove("frontend")
    // menuRefs.value['backend'].classList.remove("backend")
    // menuRefs.value['resource'].classList.remove("resource")
    // menuRefs.value['archives'].classList.remove("archives")
    // menuRefs.value['diary'].classList.remove("diary")
    current_active_menu_icon.value = 'menu';//显示菜单图标
    if (isShow.value) {

      for(let i=0;i<props.parentPageMenuData.length;i++){
      const menu_name=props.parentPageMenuData[i].menu_name;
       menuRefs.value[menu_name].classList.add(menu_name);
     }

      // menuRefs.value['index'].classList.add("index")
      // menuRefs.value['frontend'].classList.add("frontend")
      // menuRefs.value['backend'].classList.add("backend")
      // menuRefs.value['resource'].classList.add("resource")
      // menuRefs.value['archives'].classList.add("archives")
      // menuRefs.value['diary'].classList.add("diary")
      current_active_menu_icon.value = 'close';//显示关闭图标
    }
  };



  const interval = ref(null);
  const duration = 500; // 动画总时长，单位毫秒
  const isScrolling = ref(null);

  // 滚动到页面顶部的函数
  function scrollToTop() {
    console.log(111);
    // 如果当前正在滚动，则不再执行
    if (isScrolling.value) return;

    // 标记开始滚动
    isScrolling.value = true;
    console.log(222);
  
      // let scrollElem = document.querySelector('.search-page-container');
      let layoutPageScrollElem = document.querySelector('.feeds-page');
     

      if(layoutPageScrollElem){
        console.log('layoutPageScrollElem:',layoutPageScrollElem.offsetTop)
        layoutPageScrollElem.scrollTo({ top:0, behavior: 'smooth' });
      }

      let searchPageScrollElem = document.querySelector('.search-page');
      if(searchPageScrollElem){
        console.log('searchPageScrollElem:',searchPageScrollElem.offsetTop)
        searchPageScrollElem.scrollTo({ top:0, behavior: 'smooth' });
      }
      let articlePageScrollElem = document.querySelector('.article-page');
      if(articlePageScrollElem){
        console.log('articlePageScrollElem:',articlePageScrollElem.offsetTop)
        window.scrollTo({ top:0, behavior: 'smooth' });
      }
     

  

      // document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      // document.body.scrollTo({ top: 0, behavior: 'smooth' });
      

      console.log(333);
    
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset;


      console.log('scrollTop',scrollTop)

    console.log(444);
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
    -ms-flex-direction: column;
    width: 40px;
    grid-gap: 8px;
    gap: 8px;
    right: 5px;
    bottom: 50px;
    z-index: 11;
  }


  .menu-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    /* border: 1px solid var(--color-border);
                box-shadow: var(--elevation-low-shadow); */
    /* border-radius: 50%; */
    cursor: pointer;
   
    /* background: var(--elevation-low-background) */
  }


  .menu-container .btn-wrapper {
    width: 100%;
    height: 100%;
    /* border-radius: 50%; */
    display: flex;
    align-items: center;
    justify-content: center;
    /* color: var(--color-secondary-label) */
  }


  .tip-container {
    position: absolute;
    height: 28px;
    padding: 0 8px;
    border: 1px solid var(--color-border);
    box-shadow: var(--elevation-low-shadow);
    background: var(--elevation-low-background);
    font-size: 12px;
    color: var(--color-secondary-label);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    right: 48px;
    visibility: hidden
  }

  .tip-container .tip-text {
    width: 100%;
    white-space: nowrap;
    line-height: 140%
  }

  .menu-container:hover .tip-container {
    visibility: visible
  }

  .spinner {
    animation: spin-3e5a2ad2 .6s ease-in-out infinite;
    transition: opacity .45s ease-in-out
  }

  @keyframes spin-3e5a2ad2 {
    0% {
      transform: rotate(0)
    }

    to {
      transform: rotate(1turn)
    }
  }




  .top {
    width: 40px;
    height: 40px;
    /* background: var(--elevation-low-background);
                border: 1px solid var(--color-border);
                box-shadow: var(--elevation-low-shadow); */
    /*border-radius: 50%; */
    /* color: var(--color-secondary-label); */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .2s;
    cursor: pointer
  }


  .top .btn-wrapper {
    width: 100%;
    height: 100%;
    /* border-radius: 50%; */
    display: flex;
    align-items: center;
    justify-content: center;
    /* background: var(--color-background) */
  }


  .tip-container {
    position: absolute;
    height: 28px;
    padding: 0 8px;
    border: 1px solid var(--color-border);
    box-shadow: var(--elevation-low-shadow);
    background: var(--elevation-low-background);
    font-size: 12px;
    color: var(--color-secondary-label);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    right: 48px;
    visibility: hidden
  }

  .tip-container .tip-text {
    width: 100%;
    white-space: nowrap;
    line-height: 140%
  }

  .top:hover .tip-container {
    visibility: visible
  }





  :deep(.article-catalog-slot) {
    width: 40px;
    height: 40px;
    /* background: var(--elevation-low-background);
                border: 1px solid var(--color-border);
                box-shadow: var(--elevation-low-shadow); */
    /*border-radius: 50%; */
    /* color: var(--color-secondary-label); */
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .2s;
    cursor: pointer
  }


  :deep(.article-catalog-slot .btn-wrapper) {
    width: 100%;
    height: 100%;
    /* border-radius: 50%; */
    display: flex;
    align-items: center;
    justify-content: center;
    /* background: var(--color-background) */
  }


  :deep(.tip-container) {
    position: absolute;
    height: 28px;
    padding: 0 8px;
    border: 1px solid var(--color-border);
    box-shadow: var(--elevation-low-shadow);
    background: var(--elevation-low-background);
    font-size: 12px;
    color: var(--color-secondary-label);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    right: 48px;
    visibility: hidden
  }

  :deep(.tip-container .tip-text) {
    width: 100%;
    white-space: nowrap;
    line-height: 140%
  }

  :deep(.article-catalog-slot:hover .tip-container) {
    visibility: visible
  }





  :deep(.cont) {
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

    .svg-con {
      fill: var(--primary) !important;

    }



    :deep(&:hover) {

      cursor: pointer;
      box-shadow:
        0 0 0 var(--floating_btn_box_shadow_one),
        0 0 0 var(--floating_btn_box_shadow_two),
        inset 10px 10px 20px var(--floating_btn_box_shadow_three),
        inset -10px -10px 20px var(--floating_btn_box_shadow_four);


    }
  }





  .main-box {
    /* //鼠标拖拽时通过改变right bottom值来根据鼠标移动 */
    position: fixed;
    /* right: 55px; */
    /* bottom: 72px; */
  }


  .content-box {
    /* //<!--父容器相对定位--> */
    position: relative;
    background-color: #fff;
    border-radius: 50%;

  }


  .cont .svg-icon-text {
    position: absolute;
    height: 28px;
    padding: 0 8px;
    border: 1px solid var(--color-border);
    box-shadow: var(--elevation-low-shadow);
    background: var(--elevation-low-background);
    font-size: 12px;
    color: var(--color-secondary-label);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    right: 40px;
    top:-3px;
    opacity: 5;
    visibility: hidden;

  }

  .cont:hover .svg-icon-text {
    visibility: visible;
    opacity: 1;
    width: 100%;
    white-space: nowrap;
    line-height: 140%
  }


  /* 
.cont .tip-container {
                position: absolute;
                height: 28px;
                padding: 0 8px;
                border: 1px solid var(--color-border);
                box-shadow: var(--elevation-low-shadow);
                background: var(--elevation-low-background);
                font-size: 12px;
                color: var(--color-secondary-label);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                right: 48px;
                visibility: hidden
            }

            .cont .tip-container .tip-text {
                width: 100%;
                white-space: nowrap;
                line-height: 140%
            }

            .cont:hover .tip-container {
                visibility: visible
            } */



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

    .svg-con {
      fill: var(--primary) !important;

    }



    &:hover {

      cursor: pointer;
      box-shadow:
        0 0 0 var(--floating_btn_box_shadow_one),
        0 0 0 var(--floating_btn_box_shadow_two),
        inset 10px 10px 20px var(--floating_btn_box_shadow_three),
        inset -10px -10px 20px var(--floating_btn_box_shadow_four);

      .svg-con {
        fill: var(--blue) !important;

      }

    }
  }


  .plus {
    z-index: 1;
    /* position: absolute; */
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
    transform: translate(-28px, -76px) rotate(360deg);
  }

  .resource {
    transform: translate(-83px, -27px) rotate(360deg);
  }

  .backend {
    transform: translate(-55px, -52px) rotate(360deg);
  }

  .archives {
    transform: translate(-108px, 0px) rotate(360deg);
  }

  .diary {
    transform: translate(-134px, 27px) rotate(360deg);
  }
</style>