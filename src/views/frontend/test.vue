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
    console.log('fileInput.value:', fileInput.value);

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


  /**

* @Description 图片尺寸验证

* @Author： yanxh

* @Date 2019/10/28 13:06

* @Version 1.0

* @Params file 文件上传的input

* @Params fixedWidth 上传图片的规格宽度

* @Params fixedHeight 上传图片的规格高度

* @Params callBack 图片上传回显成功后需要执行的回调方法

*/

  function checkImageSize(file, fixedWidth, fixedHeight, callBack) {

    var filePath = file.value;

    if (filePath) {

      //读取图片数据

      var filePic = file.files[0];

      var reader = new FileReader();

      reader.onload = function (e) {

        var data = e.target.result;

        //加载图片获取图片真实宽度和高度

        var image = new Image();

        image.onload = function () {

          var width = image.width;

          var height = image.height;

          if (width == fixedWidth && height == fixedHeight) {

            // 执行回调

            callBack(file);

          } else {

            layer.alert("图片规格限于" + fixedWidth + "*" + fixedHeight + "px", { icon: 4 });

            file.value = "";

          }

        };

        image.src = data;

      };

      reader.readAsDataURL(filePic);

    } else {

      file.value = "";

    }

  }

  callBack


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