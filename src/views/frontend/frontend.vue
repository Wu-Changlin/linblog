<template>
  <div class="tags-container">
    <span class="more-tags">显示更多标签 <i class="arrow down"></i></span>
    <div class="tags">
      <span>标签1</span>
      <span>标签2</span>
      <span>标签3</span>
      <!-- 更多标签 -->
    </div>
  </div>
</template>

<script setup>


</script>

<style scoped>
.tags-container {
  position: relative;
  width: 100%;
  height: 100%;
}
 
.more-tags {
  cursor: pointer;
}
 
.arrow {
  display: inline-block;
  width: 0;
  height: 0;
  border-left: 3px solid transparent;
  border-right: 3px solid transparent;
  border-top: 3px solid black;
  vertical-align: middle;
  margin-left: 5px;
  transition: transform 0.3s;
}
 
.down {
  transform: translateY(1px);
}
 
.up {
  transform: translateY(-100%);
}
 
.tags {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
}
 
.more-tags:hover .arrow {
  transform: translateY(-100%);
  border-top: none;
  border-bottom: 3px solid black;
}
 
.more-tags:hover .tags {
  display: block;
}
</style>