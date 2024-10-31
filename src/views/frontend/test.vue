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


  function getEditCurrentIdData(edit_current_id_data) {
    imageModuleApi.getEditCurrentIdData(edit_current_id_data)
      .then(response => {
        ruleForm.image_id = response.image_id;
        ruleForm.image_name = response.image_name;
        ruleForm.image_path = response.image_path;
        ruleForm.image_type = response.image_type;
        ruleForm.vui_carousel_color = response.vui_carousel_color;
        ruleForm.vui_carousel_title = response.vui_carousel_title;
        ruleForm.is_pulled = response.is_enable == 1 ? true : false;
        if (image_types[ruleForm.image_type] === 'carousel_image') {

          carousel_image_url.value = ruleForm.image_path; //轮播图 小图

          //轮播图 大图 用于点击选取颜色和显示标题
          const img = new Image();
          const minWidth = 800;
          const minHeight = 450;
          img.onload = () => {
            // 设置轮播图元素的宽度和高度 （注意页面显示最小数据，非原图尺寸）
            carouselContainerRef.value.style.width = minWidth + 'px';
            carouselContainerRef.value.style.height = minHeight + 'px';
            // carouselContainerRef.value.style.width = img.width + 'px';
            // carouselContainerRef.value.style.height = img.height + 'px';
            // 设置画布元素的宽度、高度及相关属性（注意页面显示最小数据，非原图尺寸）
            const ctx = canvas.value.getContext('2d');
            canvas.value.width = minWidth;
            canvas.value.height = minHeight;
            // canvas.value.width = img.width;
            // canvas.value.height = img.height;
            ctx.drawImage(img, 0, 0, minWidth, minHeight);

          }
          img.src = ruleForm.image_path;


        } else if (image_types[ruleForm.image_type] === 'log_image') {//如果是log图，那么继续
          log_image_url.value = ruleForm.image_path; //预览log 
          console.log(222);
        }
      })

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