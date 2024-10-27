<template>
  <div>
    <input type="file" @change="handleImageUpload" />
    <!-- <canvas ref="canvas" @click="getColorAtClickPosition($event)"></canvas> -->
    <img id="img" src="" alt="">
    <img id="imgs" src="" alt="">
  </div>


  <div class="carousel-container" ref="carouselContainerRef">

    <div class="carousel-content">
      <div class="carousel-inner">
        <div class="item">
          <canvas ref="canvas" @click="getColorAtClickPosition($event)"></canvas>
        </div>
      </div>
    </div>
    
    <div class="vui-carousel" ref='dotsList' :style="{'--b-color':vui_carousel_color }">

      <div class="l-box">
        <div class="title">测试标题内容</div>

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
</template>

<script setup>
  import { ref } from 'vue';

  const canvas = ref(null);
  const carouselContainerRef = ref(null);
  const vui_carousel_color = ref('');



  function handleImageUpload(event) {
    const image = event.target.files[0];
    
    const img = new Image();
  
    img.onload = () => {

      
      var maxWidth = 1200
              var maxHeight = 675
                

                const aspectRatio = 16 / 9;
                console.log('000');
              const img_ratio=img.width/img.height;
                if(img_ratio!=aspectRatio|| img.width>maxWidth||  img.height>maxHeight){
                    console.log('图片格式或尺寸超限');
                    return;
                }else{
                  console.log('111');
                  carouselContainerRef.value.style.width = img.width+'px';
      carouselContainerRef.value.style.height = img.height+'px';
      // 设置画布元素的宽度、高度及相关属性

      const ctx = canvas.value.getContext('2d');
      canvas.value.width = img.width;
      canvas.value.height = img.height;
      ctx.drawImage(img, 0, 0);

                 

    console.log('canvas.value.image:', image)

  
    compressionFile(image);
                }
                  
              

    // 设置轮播图元素的宽度和高度
      // carouselContainerRef.value.style.width = img.width+'px';
      // carouselContainerRef.value.style.height = img.height+'px';
      // // 设置画布元素的宽度、高度及相关属性

      // const ctx = canvas.value.getContext('2d');
      // canvas.value.width = img.width;
      // canvas.value.height = img.height;
      // ctx.drawImage(img, 0, 0);
      // getColorsFromCanvas();
    };
    // img.src = URL.createObjectURL(image);

    // console.log('canvas.value.image:', image)

    img.src = URL.createObjectURL(image);
    // compressionFile(image);
    // compressImg(image);
  }



  function imageScale(width, originWidth, originHeight) {
        const scaleRatio = width / originWidth;
        const scaleHeight = scaleRatio * originHeight;
        return [width, scaleHeight];
    }


    const fileToDataURL = (file)  => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = (e) => resolve((e.target).result)
    reader.readAsDataURL(file)
  })
}

const dataURLToImage = (dataURL) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = dataURL
  })
}


const canvastoFile = (canvas, type, quality)=> {
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), type, quality))
}



 // 处理图片
/**
 * 图片压缩方法
 * @param {Object}  file 图片文件
 * @param {String} type 想压缩成的文件类型  如果输入和输出图片都是png类型，那么输出图片比原图大33%
 * @param {Nubmber} quality 压缩质量参数
 * @returns 压缩后的新图片
 * 
 * toDataURL是用base64对图像进行编码的，且编码后的源文件比编码前大33%，base64只是对图片对应的二进制码，
 * 按照六位对应一个字符规则做转换，转码后是反而比原图片文件大的。
 * 但是对于小图片而言，经转换后多出来的字节传输远比多建立一个http连接开销小，所以会利用base64对小图转码来提高页面加载速度。
 */
 const compressionFile = async(files, type = 'image/jpeg', quality = 0.5) => {
  const file = files;
  console.log('file.name:',file);
  const fileName = file.name;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const base64 = await fileToDataURL(file);
  const img = await dataURLToImage(base64);

  // const reader = new FileReader() // 创建 FileReader
  //     reader.onload = ({
  //       target: {
  //         result: src
  //       }
  //     }) => {
  //       const image = new Image() // 创建 img 元素
  //       image.onload = async () => {

  //       }
  //     }

  // var targetWidth = image.width;
  // var targetHeight = image.height;
  // var originWidth = image.width;
  // var originHeight = image.height;

  // var maxWidth = 1260;
  //               var maxHeight = 760;

  canvas.width = img.width
  canvas.height = img.height
  context.clearRect(0, 0, img.width, img.height)
  // 在canvas绘制前填充白色背景
  context.fillStyle = '#fff'
  context.fillRect(0, 0, img.width, img.height)
  context.drawImage(img, 0, 0, img.width, img.height)
  const blob = (await canvastoFile(canvas, type, quality)); // quality:0.5可根据实际情况计算
  const f = await new File([blob], fileName, {
    type: type
  })
  const re = [{
    originalFileObj: f,
    path: file.path,
    size: f.size,
    type: file.type
  }]
  console.log('f:',f);

  imgs.src = URL.createObjectURL(f);
  console.log(' img.src = URL.createObjectURL(f):', f.size/1024)
  console.log('re:',re);
  return re;
}



  /**
   * 压缩图片方法
   * @param {file} file 文件
   * @param {Number} quality 图片质量(取值0-1之间默认0.92)
   */
 function compressImg(file, quality) {
    var qualitys = 0.2
    console.log(parseInt((file.size / 1024).toFixed(2)),'kb')

    if (quality) {
      qualitys = quality
    }
      return new Promise((resolve) => {
        console.log(file)
        if ((file.size / 1024).toFixed(2) < 300) {
          resolve({
            file: file
          })
        } else {
          const reader = new FileReader() // 创建 FileReader
          reader.onload = ({
            target: {
              result: src
            }
          }) => {
            const image = new Image() // 创建 img 元素
            image.onload = async() => {
              const canvas = document.createElement('canvas') // 创建 canvas 元素
              const context = canvas.getContext('2d')
              var targetWidth = image.width
              var targetHeight = image.height
              var originWidth = image.width
              var originHeight = image.height

              var maxWidth = 1200
              var maxHeight = 675
                targetWidth = originWidth
                targetWidth = originHeight

                const aspectRatio = 16 / 9;
                // console.log('image.width ,image.height:', image.width ,',', image.height)

    // const img_ratio = image.width / image.height;

    // if ( img_ratio> aspectRatio) {
    //             targetWidth = originHeight * 16 / 9;
            
              
    //         } else {
    //             targetHeight = originWidth * 9 / 16;
    //         }



    // if (targetWidth / targetWidth > aspectRatio) {
    //   targetWidth = targetWidth / aspectRatio;
    //   } else {
    //     targetWidth = targetWidth * aspectRatio;
    //   }


           if (originWidth > maxWidth) {
                    // 更宽，按照宽度限定尺寸
                    targetHeight = maxHeight
                    targetWidth = maxWidth
                
              console.log('1- targetWidth, targetHeight:', targetWidth,',', targetHeight)

                  } else {
                    targetWidth = maxWidth
                    targetHeight = Math.round(originHeight * (targetWidth / originWidth))
              console.log('2- targetWidth, targetHeight:', targetWidth,',', targetHeight)

                  }
    
 

            console.log('1- targetWidth, targetHeight:', targetWidth,',', targetHeight)

                // 图片尺寸超过的限制
              //   if (originWidth > maxWidth || originHeight > maxHeight) {
              //     if (originWidth / originHeight > maxWidth / maxHeight) {
              //       // 更宽，按照宽度限定尺寸
              //       targetWidth = maxWidth
              //       targetHeight = Math.round(maxWidth * (originHeight / originWidth))
              // console.log('1- targetWidth, targetHeight:', targetWidth,',', targetHeight)

              //     } else {
              //       targetHeight = maxHeight
              //       targetWidth = Math.round(maxHeight * (originWidth / originHeight))
              // console.log('2- targetWidth, targetHeight:', targetWidth,',', targetHeight)

              //     }
              //   }

              console.log('3- targetWidth, targetHeight:', targetWidth,',', targetHeight)
              
              canvas.width = targetWidth
              canvas.height = targetHeight
              context.clearRect(0, 0, targetWidth, targetHeight)
              context.drawImage(image, 0, 0, targetWidth, targetHeight) // 绘制 canvas
              const canvasURL = canvas.toDataURL('image/jpeg', qualitys)
              const buffer = atob(canvasURL.split(',')[1])
              let length = buffer.length
              const bufferArray = new Uint8Array(new ArrayBuffer(length))
              while (length--) {
                bufferArray[length] = buffer.charCodeAt(length)
              }
              const miniFile = new File([bufferArray], file.name, {
                type: 'image/jpeg'
              })
              console.log({
                file: miniFile,
                origin: file,
                beforeSrc: src,
                afterSrc: canvasURL,
                beforeKB: Number((file.size / 1024).toFixed(2)),
                afterKB: Number((miniFile.size / 1024).toFixed(2)),
                qualitys: qualitys
              })
              resolve({
                file: miniFile,
                origin: file,
                beforeSrc: src,
                afterSrc: canvasURL,
                beforeKB: Number((file.size / 1024).toFixed(2)),
                afterKB: Number((miniFile.size / 1024).toFixed(2))
              })

        

            }
            image.src = src
          }
          reader.readAsDataURL(file)
        }
      })
    
  }



// const compressionFile = async(files, type = 'image/jpeg', quality = 0.5) => {
//   const file = files;
//   console.log('file.name:',file);
//   const fileName = file.name;
//   const canvas = document.createElement('canvas');
//   const context = canvas.getContext('2d');
//   const base64 = await fileToDataURL(file);
//   const img = await dataURLToImage(base64);
//   canvas.width = img.width;
//   canvas.height = img.height;
//   context.clearRect(0, 0, img.width, img.height);
//   // 在canvas绘制前填充白色背景
//   context.fillStyle = '#fff';
//   context.fillRect(0, 0, img.width, img.height);
//   context.drawImage(img, 0, 0, img.width, img.height);
//   const blob = (await canvastoFile(canvas, type, quality)); // quality:0.5可根据实际情况计算
//   const f = await new File([blob], fileName, {
//     type: type
//   })
//   const re = [{
//     originalFileObj: f,
//     path: file.path,
//     size: f.size,
//     type: file.type
//   }]
//   console.log('f:',f);

//   imgs.src = URL.createObjectURL(f);
//   console.log(' img.src = URL.createObjectURL(f):', f.size/1024)
//   console.log('re:',re);
//   return re;
// }


  function getColorAtClickPosition(event) {
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
    vui_carousel_color.value = `rgba(${r}, ${g}, ${b}, ${a})`;
    // console.log(`Clicked RGBA: (${r}, ${g}, ${b}, ${a})`);

  };
</script>


<style scoped>
  .carousel-container {
    padding: 0;
    width: 100%;
    margin: 0;
  }

  /* 轮播图 开始*/
  .carousel-content {
    width: 100%;
    height: 0;
    /* 宽高比 16/9 */
    padding-top: 56.25%;
    position: relative;
    overflow: hidden;

  }

  .carousel-inner {
    width: 100%;
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
    --b-color: rgba(0,0,0);
    background-color: var(--b-color) !important;
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


  /* 骨架屏 */
  .content-banner-skeleton {
    margin: 5px;
  }

  /* 骨架屏缩放动画 */
  .scale-down-enter-active,
  .scale-down-leave-active {
    transition: all 0.8s ease;
  }

  .scale-down-enter-from,
  .scale-down-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }
</style>