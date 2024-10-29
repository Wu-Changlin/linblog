

<template>
  <div class="content">
    <div class="info">
      <img :src="imageUrl" alt="" @click="handleSelect">
      <div class="handle">
        <button @click="handleSelect">选择图片</button>
        <button @click="handleFileUpload">开始上传</button>
        <input ref="fileInput" type="file" @change="handleImage" accept="image/*" style="display: none;">
      </div>
    </div>
  </div>
</template>
<script setup>
  import { ref } from 'vue';

  const fileInput = ref(null); // 使用ref引用DOM元素
  const imageUrl = ref("https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"); // 存储图片预览的URL

  const file = ref(null)

  // 处理文件上传
  const handleFileUpload = () => {
    //这里可以执行文件上传的操作，axios等
    console.log(file.value);
  };

  //选择图片
  const handleSelect = () => {
  console.log('fileInput.value:',fileInput.value);

    fileInput.value.click()
  }

  //获取选择的图片信息
  const handleImage = () => {
    file.value = fileInput.value.files[0]; // 获取文件信息

    if (!file) return;

    // 预览图片
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target.result; // 更新图片预览的URL
    };
    reader.readAsDataURL(file.value); // 读取文件内容
  }
</script>
<style scoped>
  .content {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
  }

  .info {
    width: 300px;
    height: 500px;
    margin-top: 30px;
  }

  img {
    width: 100px;
    height: 100px;
    border: 1px solid red;
    border-radius: 50%;
  }
</style>