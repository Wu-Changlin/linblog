<template>
    <div class="so_null" :style="{ height: height }">
      <div :class="loadingClass">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="imgWrapper">
        <img :src="props.imgUrl" width="300" height="300" />
        <div class="infoWrapper">
          <slot name="content">{{ props.title }}</slot>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { defineProps, ref, watch } from "vue"; //使用语法糖才能使用他们
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
  watch(loadingClass, () => {
    if (props.loading) changeLoading();
  });
  </script>
  <style scoped>
  .so_null {
    position: relative;
    width: 100%;
  
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
  