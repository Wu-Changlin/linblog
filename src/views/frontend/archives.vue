
<template>
    <div>
      <div @mouseenter="showMore = true" @mouseleave="showMore = false">
        鼠标移入显示更多
        <span v-if="showMore">
          <span>|</span>
          <a href="#">更多操作1</a>
          <a href="#">更多操作2</a>
        </span>
      </div>
    </div>
  </template>
   
  <script>
  export default {
    data() {
      return {
        showMore: false,
      };
    },
  };
  </script> 