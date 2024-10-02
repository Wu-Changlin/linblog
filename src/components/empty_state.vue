<template>
    <div class="so_null" :style="{ height: height }">
      <div :class="loadingClass">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="imgWrapper">
        <img :src="props.imgUrl" :width="imgWidth" :height="imgHeight" />
        <div class="infoWrapper">
          <slot name="content">{{ props.title }}</slot>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { ref, watch,onUnmounted } from "vue"; //使用语法糖才能使用他们
  const props = defineProps({
    height: {
      type: String,
      default: "calc(100vh)",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    withoutLoading: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "暂无数据",
    },
    imgUrl: {
      type: String,
      default: "/empty-state.png",
    },
    imgWidth: {
      type: String,
      default: "300px",
    },
    imgHeight: {
      type: String,
      default: "300px",
    },
  });
  let loadingClass = ref("so-loading");
  
  const changeLoading = () => {
    if (!props.withoutLoading) {
      loadingClass.value = "";
      return;
    }
    loadingClass.value = "so-loading";
    setTimeout(() => {
      loadingClass.value = "";
    }, 1000);
  };
  changeLoading();


  // 使用ref来存储watch返回的函数
const stopWatchLoadingClass = ref(null);

stopWatchLoadingClass.value =watch(loadingClass, () => {
    if (props.loading) changeLoading();
  });

  onUnmounted(() => {
    stopWatchLoadingClass.value=null; // 如果watch返回了一个停止监听的函数，调用它
  });


  </script>
  <style scoped>
  .so_null {
    position: relative;
    width: 100%;
    /* overflow-y: hidden;禁止容器y轴方向滚动 */
  
    .imgWrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: inline-block;
      img {
        position: relative;
        left: 50%;
        transform: translateX(-50%);
      }
      .infoWrapper {
        text-align: center;
        color: gray;
      }
    }
  }
  .so-loading {
    display: flex;
    justify-content: center;
  }
  </style>
  