<template>
  <div class="flex-container">
    <div class="content">左内容</div>
    <div class="icon">sss</div>
 
</div>

</template>


<style scoped>
 
.flex-container {
  display: flex;
}
 
.content {
  /* 根据需要调整内容的样式 */
  flex: 1; /* 或者给定的宽度，确保内容可以填满容器 */
  padding-right: 10px; /* 可选的，为了内容和图标之间有间隔 */
}
 
.icon {
  margin-left: auto; /* 关键样式，使图标靠右 */
  /* 根据需要调整图标的样式 */
}

</style>