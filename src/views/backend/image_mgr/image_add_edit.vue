<template>

  <div class="page_title_container">
    <div class="line"></div>
    <div class="title">
      {{ page_title}}
    </div>
    <div class="line"></div>
  </div>

  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm"
    label-position="left">
    <el-form-item label="图片名称" prop="img_name">
      <el-input v-model="ruleForm.image_name" placeholder="亲，请输入图片名称（没有输入，默认文件名）"></el-input>
    </el-form-item>

    <el-form-item label="类型" prop="image_type">
      <el-radio-group v-model="ruleForm.image_type" @change="checkImageTypeRadioInfo">
        <el-radio v-for="item in options_image_type_data" :key="item.image_type" :value="item.image_type"> {{
          item.image_type_name }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <div v-if="image_types[ruleForm.image_type]==='logo_image'">
      <el-form-item label="logo图片" prop="image_path">

        <div class="image-uploader">
          <img v-if="logo_image_url" ref="logoImageRef" :src="logo_image_url" class="avatar" @click="handleLogoImageSelect">
          <div v-else class="svg-icon-uploader" @click="handleLogoImageSelect">
            <svg-icon class="svg-icon" icon-class="plus"></svg-icon>
          </div>
          <input ref="uploadLogoImageFileInputRef" type="file" @change="handleLogoImage" accept="image/*"
            style="display: none;">
        </div>

      </el-form-item>

    </div>

    <div v-if="image_types[ruleForm.image_type]==='carousel_image'">

      <el-form-item label="轮播图片" prop="image_path">

        <div class="image-uploader">
          <img v-if="carousel_image_url" ref="carouselImageRef" :src="carousel_image_url" class="avatar"
            @click="handleCarouselImageSelect">
          <div v-else class="svg-icon-uploader" @click="handleCarouselImageSelect">
            <svg-icon class="svg-icon" icon-class="plus"></svg-icon>
          </div>

          <input ref="uploadCarouselImageFileInputRef" type="file" @change="handleImageUpload" accept="image/*"
            style="display: none;">
        </div>

      </el-form-item>

      <el-form-item label="底部标题" prop="vui_carousel_title">
        <el-input v-model="ruleForm.vui_carousel_title" placeholder="亲，请输入底部标题"></el-input>
      </el-form-item>

      <el-form-item label="底部背景" prop="vui_carousel_color" style="height: 500px;">

        <div style="display: flex;width: 100%;height: 100%;">
          <div style="display: flex;width: 200px;height: 480px;margin-right: 10px;">
            <div style="display: flex;flex-direction: column; /* 设置为垂直布局 */width: 100%;height: 100%;">
              <div>点击选取颜色</div>
              <div :style="{'background-color':ruleForm.vui_carousel_color,'width':'100%','height': '100%'}"></div>
            </div>

          </div>
          <div style="display: flex;flex:1;height: 450px;">
            <div class="carousel-container" ref="carouselContainerRef">
              <div class="carousel-content">
                <div class="carousel-inner">
                  <div class="item">
                    <canvas ref="canvas" @click="getColorAtClickPosition($event)"></canvas>
                  </div>
                </div>
              </div>

              <div class="vui-carousel" :style="{'--b-color':ruleForm.vui_carousel_color}">
                <!-- :style="{backgroundColor:ruleForm.vui_carousel_color}">  -->

                <div class="l-box">
                  <div v-if="ruleForm.vui_carousel_title">{{ruleForm.vui_carousel_title}}</div>
                  <div v-else class="title"> 测试标题内容</div>
                </div>

                <div class="r-box">

                  <ul class="dots">
                    <li :class="[index==1?'pacman':'dot',index==1?'l':'']" v-for="(item,index) in 2">
                      <!-- 吃豆人 -->
                      <div v-if="index==1"></div>
                      <div v-if="index==1"></div>
                    </li>
                  </ul>

                </div>

              </div>
            </div>
          </div>

        </div>

      </el-form-item>
    </div>

    <el-form-item label="下架" prop="is_pulled">
      <el-radio-group v-model="ruleForm.is_pulled">
        <el-radio v-for="(item,index) in is_pulled_data" :key="index" :value="item.is_pulled"> {{
          item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>


    <el-form-item>
      <div style="width: 100%;">
        <el-button type="primary" @click="clickSubmit()">提交</el-button>
      </div>

    </el-form-item>

  </el-form>
</template>

<script setup>
  import { ref, reactive, onMounted, computed, nextTick, inject } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import ArticleCoverList from '@/components/backend/article_cover_list.vue';
  import { sendMsg } from '@/components/cross_tag_msg/crossTagMsg.js';
  import imageModuleApi from "@/api/backend/image.js";//api接口
  //路由相关
  const route = useRoute();
  const router = useRouter();
  //使用 provide inject 代替getCurrentInstance
  const $verify = inject('$verify');
  const $message = inject('$message');

  //轮播图画布 Ref   // 使用ref引用DOM元素
  const canvas = ref(null);
  //轮播图容器 Ref   // 使用ref引用DOM元素
  const carouselContainerRef = ref(null);


  //上传图片作用类型
  const image_types = reactive({ '1': 'carousel_image', '2': 'logo_image' });
//上传logo图片和轮播图图片的限制尺寸、比例
  const image_dimensions = reactive({
    logo_image_dimensions :{
    max_width:200,
    max_height : 72,
    min_width : 100,
    min_height : 40,
    aspect_ratio:''
  },
  carousel_image_dimensions:{
    max_width:1920,
    max_height : 1080,
    min_width : 800,
    min_height : 450,
    aspect_ratio:'16/9'
  }

  })


  //预览上传logo图片地址
  const logo_image_url = ref();
  //预览上传logo图片img Ref   // 使用ref引用DOM元素
  const logoImageRef = ref(null);
  //上传logo图片input Ref   // 使用ref引用DOM元素
  const uploadLogoImageFileInputRef = ref(null);

  //预览上传轮播图图片地址
  const carousel_image_url = ref();
  //预览上传轮播图图片img Ref   // 使用ref引用DOM元素
  const carouselImageRef = ref(null);
  //上传轮播图图片input Ref   // 使用ref引用DOM元素
  const uploadCarouselImageFileInputRef = ref(null)

  //点击图片类型单选框选中值  保留选中图片
  function checkImageTypeRadioInfo(val) {
    // console.log('checkColumnRadioInfo =',val);

if(ruleForm.image_path){
  // base64转文件
  let image_object=base64toFile(ruleForm.image_path,ruleForm.image_name);
if(image_object){
  //拼接图片类型尺寸名称
const image_dimensions_name= image_types[String(ruleForm.image_type)]+'_dimensions';
  //图片类型尺寸数据
const current_image_dimensions =image_dimensions[image_dimensions_name];
// 校验图片
    verifyAspectRatioAndDimensions(image_object, current_image_dimensions.aspect_ratio, current_image_dimensions.max_width, current_image_dimensions.max_height, current_image_dimensions.min_width, current_image_dimensions.min_height, String(ruleForm.image_type));
}
}
  }



  // base64转文件
  function base64toFile(base64Str,fileName) {
	//1,先将base64转换为blob
    var arr = base64Str.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    let theBlob = new Blob([u8arr], { type: mime });
    
    //2,再将blob转换为file
	theBlob.lastModifiedDate = new Date();  // 文件最后的修改日期
	theBlob.name = fileName;                // 文件名
	return new File([theBlob], fileName, {type: theBlob.type, lastModified: Date.now()});
}



  //选择logo图片
  function handleLogoImageSelect() {
    uploadLogoImageFileInputRef.value.click();
  }

  //TODO 上传文件先转base64,后校验？ 上传文件直接校验？ 
  //TODO verifyAspectRatioAndDimensions函数以上传文件为基准
  //TODO 原上传文件直接校验，出现点击图片类型单选框选中值保留选中图片无法使用校验
  //TODO 修改：上传文件先转base64,后校验，verifyAspectRatioAndDimensions函数以上传文件地址为基准
  //获取选择的logo图片信息
  function handleLogoImage() {
    const file = uploadLogoImageFileInputRef.value.files[0]; // 获取文件信息
    //如果没有图片文件，那么直接返回
    if (!file) {
      return;
    }
    /* 校验图片的文件大小、后缀名 开始*/
    let verify_image_max_sizeAnd_suffix_name_result = verifyImageMaxSizeAndSuffixName(file);
    if (!verify_image_max_sizeAnd_suffix_name_result) {//如果验证图片的文件大小、后缀名失败，直接返回，不执行后续操作
      return;
    }
    /* 校验图片的文件大小、后缀名 结束*/

    // 校验图片比例（值为0则不检验）、尺寸(最大宽、最大高、最小宽、最小高)
     //拼接图片类型尺寸名称
const image_dimensions_name= image_types[String(ruleForm.image_type)]+'_dimensions';
  //图片类型尺寸数据
 const current_image_dimensions =image_dimensions[image_dimensions_name];
 verifyAspectRatioAndDimensions(file,current_image_dimensions.aspect_ratio, current_image_dimensions.max_width, current_image_dimensions.max_height, current_image_dimensions.min_width, current_image_dimensions.min_height, String(ruleForm.image_type));
  }




/**
 * 预览图片
 * @description:    根据图片作用类型显示相应预览图片
 * @param {*} image_type      图片作用类型
 * @param {*} image_object    image 对象
 * @param {*} minWidth        图片宽
 * @param {*} minHeight       图片高
 * @param {*} image_url       图片地址
 * @return {*}
 */
function previewImage(image_type,image_object,minWidth,minHeight,image_url){
//如果是轮播图，那么继续
if (image_type=== 'carousel_image') {
        carousel_image_url.value = image_url; //预览轮播图 
        // 设置轮播图元素的宽度和高度 （注意页面显示最小数据，非原图尺寸）
        carouselContainerRef.value.style.width = minWidth + 'px';
        carouselContainerRef.value.style.height = minHeight + 'px';
        // carouselContainerRef.value.style.width = image_object.width + 'px';
        // carouselContainerRef.value.style.height = image_object.height + 'px';
        // 设置画布元素的宽度、高度及相关属性（注意页面显示最小数据，非原图尺寸）
        const ctx = canvas.value.getContext('2d');
        canvas.value.width = minWidth;
        canvas.value.height = minHeight;
        // canvas.value.width = image_object.width;
        // canvas.value.height = image_object.height;
        ctx.drawImage(image_object, 0, 0, minWidth, minHeight);

      } else if (image_type=== 'logo_image') {//如果是log图，那么继续
        // logo_image_url.value = URL.createObjectURL(verify_file); //输出地址预览log 
        logo_image_url.value =  image_url; //输出地址预览log 
      }

}
  


  /**
 * 校验图片的文件大小、后缀名
 * @description: 
 * @param {Object} verify_file 图片文件对象
 */
  function verifyImageMaxSizeAndSuffixName(verify_file) {
    /* 校验图片文件大小 开始*/

    //图片文件大小
    const verify_file_size = verify_file.size;
    // 允许的最大文件大小，这里设置为2MB
    const maxSize = 2 * 1024 * 1024;
    // 检查文件大小是否超出限制
    if (verify_file_size > maxSize) {
      $message('文件大小超出限制!最大文件大小:2MB', 'error');
      return false;
    }
    /* 校验图片文件大小 结束*/

    /* 校验图片后缀名 开始*/
    const file_extension = verify_file.name.split('.').pop().toLowerCase();
    const valid_image_types = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const is_valid_image_suffix_name = valid_image_types.includes(file_extension);
    if (!is_valid_image_suffix_name) {
      $message('请上传有效的图片格式文件！图片格式范围：jpg、jpeg、png、gif、webp', 'error');
      return false;
    }
    /* 校验图片后缀名 结束*/

    return true;
  }


  /**
 *  校验图片比例（值为0则不检验）、尺寸(最大宽、最大高、最小宽、最小高)
 * @description: 
 * @param {Object}  verify_file           图片文件对象
 * @param {String}  verify_aspect_ratio     比例
 * @param {Number}  verify_image_max_width   最大宽
 * @param {Number}  verify_image_max_height   最大高
 * @param {Number}  verify_image_min_width  最小宽
 * @param {Number}  verify_image_min_height 最小高
 * @param {String}  image_type              图片类型
 * @return {bool}    true  false
 */
  function verifyAspectRatioAndDimensions(verify_file, verify_aspect_ratio, verify_image_max_width, verify_image_max_height, verify_image_min_width, verify_image_min_height, image_type) {
    let image = new Image();
    // 不再需要时释放内存
    console.log('校验-ruleForm.image_path:', ruleForm.image_path)
    // if(image.src){
    //   URL.revokeObjectURL(image.src);
    // }
    image.onload = function () {
      
      /* 校验图片尺寸 开始*/
      let is_valid_dimensions = (image.width <= verify_image_max_width && image.width >= verify_image_min_width) || (image.height <= verify_image_max_height && image.height >= verify_image_min_height)

      if (!is_valid_dimensions) {//如果验证图片尺寸失败，直接返回，不执行后续操作
        const error_msg = '不支持图片尺寸！尺寸范围：最大宽' + verify_image_max_width + '，最大高' + verify_image_max_height + '；最小宽' + verify_image_min_width + '，最小高' + verify_image_min_height + '。';
        $message(error_msg, 'error');
        // 不再需要时释放内存
        URL.revokeObjectURL(image.src);
        return;
      }
      /* 校验图片尺寸 结束*/

      /* 校验图片比例 开始*/
      if (verify_aspect_ratio) {
        // 图片尺寸比例
        const img_ratio = image.width / image.height;
        // 字符串比例转小数
        let verify_aspect_ratio_to_number = getStrRatioToNumber(verify_aspect_ratio);
        const isValidRatio = Math.abs(img_ratio - verify_aspect_ratio_to_number) < 0.01;
        if (!isValidRatio) {//如果验证图片比例失败，直接返回，不执行后续操作
          const error_msg = '不支持的图片比例！比例范围：' + verify_aspect_ratio + '（宽/高)';
          $message(error_msg, 'error');
          // 不再需要时释放内存
          URL.revokeObjectURL(image.src);
          return;
        }
      }
      /* 校验图片比例 结束*/
      
      // 预览图片
      previewImage(image_types[image_type],image,verify_image_min_width,verify_image_min_height,image.src);
      

      //接收图片base64数据；
      compressionFile(verify_file).then(base64_str => {
        ruleForm.image_path = base64_str;
        console.log('接收图片base64数据；', base64_str); // 输出: Hello, world!
      });
    };
    image.src = URL.createObjectURL(verify_file); // 替换为你的图片路径
    //  // 不再需要时释放内存
    // URL.revokeObjectURL(image.src);

  }



  /**
   * 字符串比例转小数
   * @description: indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置
   * 截取字符串比例获取分子和分母；后转数值
   * @param {*} strRatio  字符串比例
   * @return {*} result_number  比例小数
   */
  function getStrRatioToNumber(str_ratio) {
    //找到字符串中第一个'/'的位置
    let index = str_ratio.indexOf('/');
    //从0开始截取到字符串中第一个'/'的位置截止 （‌分子）
    let numerator = str_ratio.substring(0, index);
    //从字符串中第一个'/'的位置到最后截止 （‌分母）
    let denominator = str_ratio.substring(index + 1);
    //字符串值转数字值
    numerator = Number(numerator);
    denominator = Number(denominator);
    //计算小数
    const result_number = numerator / denominator;
    //返回比例小数
    return result_number;
    // console.log('/前字符',result); // 输出: "16"
    // console.log('/后字符',results); // 输出: "16"
  }


  // 处理文件上传
  // const handleFileUpload = () => {
  //   //这里可以执行文件上传的操作，axios等
  //   console.log(file);
  // };




  //选择轮播图图片
  function handleCarouselImageSelect() {
    uploadCarouselImageFileInputRef.value.click();
  }


  //获取选择的轮播图图片信息
  function handleImageUpload() {
    const file = uploadCarouselImageFileInputRef.value.files[0]; // 获取文件信息

    //如果没有图片文件，那么直接返回
    if (!file) {
      return;
    }
    /* 校验图片的文件大小、后缀名 开始*/
    let verify_image_max_sizeAnd_suffix_name_result = verifyImageMaxSizeAndSuffixName(file);
    if (!verify_image_max_sizeAnd_suffix_name_result) {//如果验证图片的文件大小、后缀名失败，直接返回，不执行后续操作
      return;
    }
    /* 校验图片的文件大小、后缀名 结束*/

    // 校验图片比例（值为0则不检验）、尺寸(最大宽、最大高、最小宽、最小高)
     //拼接图片类型尺寸名称
const image_dimensions_name= image_types[String(ruleForm.image_type)]+'_dimensions';
  //图片类型尺寸数据
 const current_image_dimensions =image_dimensions[image_dimensions_name];
 verifyAspectRatioAndDimensions(file,current_image_dimensions.aspect_ratio, current_image_dimensions.max_width, current_image_dimensions.max_height, current_image_dimensions.min_width, current_image_dimensions.min_height, String(ruleForm.image_type));

 };



  // 图像文件转base64编码
  const fileToDataURL = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = (e) => resolve((e.target).result)
      reader.readAsDataURL(file)
    })
  }

  // base64编码转图像文件
  const dataURLToImage = (dataURL) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.src = dataURL
    })
  }


  //画布转比特流  将Canvas转换为Blob对象
  const canvastoFile = (canvas, type, quality) => {
    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), type, quality))
  }


  /**
   * 图片压缩方法
   * @param {Object}  file 图片文件
   * @param {String} type 想压缩成的文件类型  如果输入和输出图片都是png类型，那么输出图片比原图大33%
   * @param {Nubmber} quality 压缩质量参数
   * @returns 压缩后的新图片
   * toDataURL是用base64对图像进行编码的，且编码后的源文件比编码前大33%，base64只是对图片对应的二进制码，
   * 按照六位对应一个字符规则做转换，转码后是反而比原图片文件大的。
   * 但是对于小图片而言，经转换后多出来的字节传输远比多建立一个http连接开销小，所以会利用base64对小图转码来提高页面加载速度。
   */
  const compressionFile = async (files, type = 'image/jpeg', quality = 0.3) => {
    if (!files) {
      return;
    }
    const file = files;
    const fileName = file.name;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const base64 = await fileToDataURL(file);
    const img = await dataURLToImage(base64);
    canvas.width = img.width;
    canvas.height = img.height;
    context.clearRect(0, 0, img.width, img.height);
    // 在canvas绘制前填充白色背景  ！！！ 注意：填充白色背景可能出现图片全白；可改为黑色背景
    context.fillStyle = '#fff';
    context.fillRect(0, 0, img.width, img.height);
    context.drawImage(img, 0, 0, img.width, img.height);
    const blob = (await canvastoFile(canvas, type, quality)); // quality:0.5可根据实际情况计算
    const f = await new File([blob], fileName, {
      type: type
    })
    // const re = [{
    //   originalFileObj: f,
    //   path: file.path,
    //   size: f.size,
    //   type: file.type
    // }]
    // console.log('f:', f);
    // 图片文件转base64
    const img_base64_str = await fileToDataURL(f);
    // console.log('img_base64_str:', img_base64_str);
    // 返回数据；
    return img_base64_str;
    // imgs.src = URL.createObjectURL(f);
    // 输出图片多少kb
    // console.log(' img.src = URL.createObjectURL(f):', f.size/1024)

    // return re;
  }



  //点击图片获取颜色，用于轮播图图片底部的渐变部分的背景色 
  function getColorAtClickPosition(event) {
    // 如果没有图片，那么直接返回
    if (!ruleForm.image_path) {
      return;
    }
    // Multiple readback operations using getImageData are faster with the willReadFrequently attribute set
    // HTML Canvas2D：设置willReadFrequently属性为true可加快多个getImageData读取操作的速度
    // HTML Canvas2D中的willReadFrequently属性是一个布尔值，用于控制是否将图像数据缓存在GPU内存中，当设置为true时，浏览器会尽量将图像数据缓存在GPU内存中，从而提高多个getImageData读取操作的速度。
    const context = canvas.value.getContext('2d', { willReadFrequently: true });
    const rect = canvas.value.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const imgData = context.getImageData(x, y, 1, 1);
    const data = imgData.data;
    const r = data[0];
    const g = data[1];
    const b = data[2];
    const a = data[3];
    ruleForm.vui_carousel_color = `rgba(${r}, ${g}, ${b}, ${a})`;
    // console.log(`Clicked RGBA: (${r}, ${g}, ${b}, ${a})`);
    // console.log(`ruleForm.vui_carousel_color: (${ruleForm.vui_carousel_color})`);
  };


  //表单ref
  const ruleFormRef = ref();
  //初始化添加数据
  const ruleForm = reactive({
    image_id: 0,
    image_name: "",
    image_path: "",
    image_type: 1,
    is_pulled: 0,
    vui_carousel_color: "",
    vui_carousel_title: "",
    action:''//操作

  })

  //校验
  const rules = {
    email: [
      { required: true, message: "请输入邮箱" },
      { max: 50, message: "邮箱长度超限" },
      // { validator: proxy.$verify.email, message: "邮箱格式有误" },
    ],
  };

  //提交修改数据
  function clickSubmit() {
    //valid 类型：布尔值 。fields 没有通过校验的字段，类型：对象
    ruleFormRef.value.validate((valid, fields) => {
      if (valid) {
        console.log("表单数据:", JSON.stringify(ruleForm))
        // 处理提交逻辑
        imageModuleApi.clickSubmitAddOrEditData(ruleForm)
          .then(response => {
            //把修改或添加消息广播出去
            // const msg_content=response.action_success_data;
            if (route.query.action == "edit") {
              //模拟
              let msg_content = {
                image_id: route.query.id ? Number(route.query.id) : 1,
                image_name: ruleForm.image_name,
                image_path: ruleForm.image_path,
                image_type: ruleForm.image_type,
                vui_carousel_color: ruleForm.vui_carousel_color,
                vui_carousel_title: ruleForm.vui_carousel_title,
                is_pulled: ruleForm.is_pulled,
                created_time: "1687938191",
                update_time: "1728874350",
              }

              sendMsg('edit-image', msg_content);
              $message('修改成功', 'success');

            } else if (route.query.action == "add") {
              //模拟
              let msg_content = {
                image_id: 999,
                image_name: ruleForm.image_name,
                image_path: ruleForm.image_path,
                image_type: ruleForm.image_type,
                vui_carousel_color: '',
                vui_carousel_title: '',
                is_pulled: ruleForm.is_pulled,
                created_time: "1687938191",
                update_time: "1728874350",
              }

              sendMsg('add-image', msg_content);
              $message('添加成功', 'success');
            }

          })
          .catch(error => {
            // console.log(' getPageLayoutData()=>error:',error)
            $message('请求未找到', 'error');
            // $message('请求未找到', 'error');
          });

      } else {
        // 有字段没有通过验证
        let obj = Object.keys(fields)[0];
        //使用formEl.scrollToField方法来焦点定位并滚动到特定的表单字段,这里跳到第一个字段
        ruleFormRef.value.scrollToField(obj);
        $message('输入数据有误，请检查', 'warning');
        return false;
      }
    });
  }

  //获取编辑id的数据
  function getEditCurrentIdData(edit_current_id_data) {
    imageModuleApi.getEditCurrentIdData(edit_current_id_data)
      .then(response => {
        ruleForm.image_id = response.image_id;
        ruleForm.image_name = response.image_name;
        ruleForm.image_path = response.image_path;
        ruleForm.image_type = response.image_type;
        ruleForm.vui_carousel_color = response.vui_carousel_color;
        ruleForm.vui_carousel_title = response.vui_carousel_title;
        ruleForm.is_pulled = response.is_pulled;
         //显示图片
        const img = new Image();
          const minWidth = 800;
          const minHeight = 450;
          img.onload = () => {
             // 预览图片
      previewImage(image_types[ruleForm.image_type],img,minWidth,minHeight,img.src);
    
          }
          img.src = ruleForm.image_path;
      })
      .catch(error => {
                // console.log('请求接口错误-提示：', error);
                // // 处理错误
                // let message_str = error.message;
                // if (error.data) {
                //     message_str = error.data.data.message;
                // }

                // $message(message_str, 'error');
            });

  }

  //选择器数据
  const options_image_type_data = ref([]);
  const is_pulled_data=ref();

  // 获取页面框架数据
  function getAddAndEditPageLayoutData() {
    imageModuleApi.getPageLayoutData({})
      .then(response => {
        options_image_type_data.value = response.options_image_type_data;
        is_pulled_data.value = response.is_pulled_data;
        
        
      })
      .catch(error => {
                // console.log('请求接口错误-提示：', error);
                // // 处理错误
                // let message_str = error.message;
                // if (error.data) {
                //     message_str = error.data.data.message;
                // }

                // $message(message_str, 'error');
            });

  }
  // 页面操作标题
  const page_title = ref('');
  onMounted(() => {
    if (Object.keys(route.query).length > 0) {
      //如果是action=="edit"，那么获取当前编辑id数据
      if (route.query.action == "edit") {
         // 字符串值转数字值
        let id_string_to_number=Number(route.query.id);
        // 拼接数据
        let edit_current_id_data={
          'id':id_string_to_number
        }
        getEditCurrentIdData(edit_current_id_data);
        getAddAndEditPageLayoutData();
        page_title.value = '编辑图片';
        ruleForm.action = "edit";//编辑操作
      } else if (route.query.action == "add") {
        getAddAndEditPageLayoutData();
        page_title.value = '添加图片';
        ruleForm.action = "add";//添加操作

      } else {
        $message('非法操作', 'error');
        router.push({ path: '/404' });//重定向到404页面
        return;
      }


    } else {
      $message('非法请求', 'error');
    }
  });

</script>


<style scoped>
  .page_title_container {
    display: flex;
    align-items: center;
    /* 垂直居中 */
    justify-content: space-between;
    /* 水平间隔 */
    height: 100px;

    /* 容器高度 */
    .title {
      text-align: center;
      flex: 1;
      /* 占据剩余空间 */
    }

    .line {
      flex: 1;
      /* 占据剩余空间 */
      border-top: 2px solid #999999;
      /* 横线样式 */
      margin: 0 10px;
      /* 横线外边距 */
    }
  }


  .carousel-container {
    padding: 0;
    width: 100%;
    margin: 0;
    max-width: 1920px;
  }

  /* 轮播图 开始*/
  .carousel-content {
    width: 100%;
    height: 100%;
    /* 宽高比 16/9 */
    /* padding-top: 56.25%; */
    position: relative;
    overflow: hidden;

  }

  .carousel-inner {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    display: flex;
    transition: transform 1s ease-in-out;
  }


  .item {
    flex: 0 0 100%;
  }

  .carousel-inner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }


  /* 轮播图底部交互 开始*/
  .vui-carousel {
    display: flex;
    /* 计算底部区域高度 */
    /* height: 100%; */
    /* --b-color是自定义属性，接口返回进行动态赋值 */
    --b-color: rgba(0, 0, 0);
    background-color: var(--b-color);
    color: var(--text);
    /* 相对定位 */
    position: relative;
  }

  /* 图片底部的渐变部分 */
  .vui-carousel::before {
    content: "";
    width: 100%;
    height: 50px;
    /* 背景渐变（透明——底部区域同色，上到下） */
    background: linear-gradient(to bottom, transparent, var(--b-color));
    /* 绝对定位 位置上移它的高度 */
    position: absolute;
    top: -50px;
    /* 确保了伪元素不会接收或阻止鼠标事件，从而允许父元素接收到点击事件。 */
    pointer-events: none;
  }

  /* 底部区域的左侧部分 */
  .vui-carousel .l-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 12px;
    width: 100%;
  }

  .vui-carousel .title {
    width: 100%;
    font-size: 18px;
    line-height: 25px;
    /* 标题不换行，溢出显示省略号 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .vui-carousel .dots {
    display: flex;
    margin-top: 13px;
    margin-right: 0;
  }

  /* 指示器（小圆点） */
  .vui-carousel li {
    width: 8px;
    height: 8px;
    background-color: rgba(128, 128, 128, 0.7);
    margin: 4px;
    border-radius: 50%;
    cursor: pointer;
  }

  /* 指示器选中态（吃豆人） */
  .vui-carousel li.pacman {
    position: relative;
    width: 14px;
    height: 14px;
    background-color: transparent;
    margin-top: 1px;
  }

  /* 吃豆人由两个div组成 */
  .vui-carousel li.pacman div {
    width: 0;
    height: 0;
    border: 7px solid var(--vui_carousel_bg);
    border-radius: 50%;
    border-right-width: 7px;
    border-right-color: transparent;
    /* 绝对定位 两个重合 */
    position: absolute;
  }

  /* 吃豆人朝向左 */
  .vui-carousel li.pacman.l {
    transform: rotate(180deg);
  }

  /* 接下来分别为吃豆人的两个部分设置动画 */
  .vui-carousel li.pacman div:nth-child(1) {
    /* 执行动画：动画名 时长 线性的 停留在最后一帧 */
    animation: pacman1 0.75s linear forwards;
  }

  .vui-carousel li.pacman div:nth-child(2) {
    animation: pacman2 0.75s linear forwards;
  }

  /* 底部区域的右侧部分 */
  .vui-carousel .r-box {
    display: flex;
    margin-right: 10px;
  }


  /* 定义吃豆人动画 */
  @keyframes pacman1 {
    0% {
      transform: rotate(360deg);
    }

    40% {
      transform: rotate(270deg);
    }

    60% {
      transform: rotate(360deg);
    }

    100% {
      transform: rotate(270deg);
    }
  }

  @keyframes pacman2 {
    0% {
      transform: rotate(0deg);
    }

    40% {
      transform: rotate(90deg);
    }

    60% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(90deg);
    }
  }

  /* 轮播图底部交互 结束*/

  /* 轮播图 结束*/


  /* 上传图片 */
  .image-uploader {
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .image-uploader:hover {
    border-color: #409eff;
  }

  .svg-icon-uploader {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 115px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>