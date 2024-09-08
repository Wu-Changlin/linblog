<template>

  <div style="padding-top: 200px;"></div>
  <div class="container">
    
    <div class="content">
      <!-- 左侧显示的内容 -->
      这里是内容
    </div>

    <div class="icon">
      <!-- 右侧显示的图标 -->
      <!-- 这里使用了 Font Awesome 图标库，你可以根据需要更改为其他图标库或图标 -->
      更多
    </div>

  </div>

</template>
 
<script>
export default {
  // 组件逻辑
};
</script>
 
<style scoped>
.container {
  display: flex;
  align-items: center;
}
 
.content {
  flex: 1; /* 占据剩余空间 */
  padding-right: 10px; /* 右边距，可根据需要调整 */
}
 
.icon {
  flex-basis: auto; /* 根据内容自动调整宽度 */
  text-align: right; /* 图标右对齐 */
}
 
.icon i {
  cursor: pointer; /* 鼠标悬停时显示指针光标 */
}
</style>