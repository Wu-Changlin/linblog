<template>
  <div>
    <input type="file" @change="handleImageUpload" />
    <!-- <canvas ref="canvas" @click="getColorAtClickPosition($event)"></canvas> -->

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
    // 设置轮播图元素的宽度和高度
      carouselContainerRef.value.style.width = img.width+'px';
      carouselContainerRef.value.style.height = img.height+'px';
      // 设置画布元素的宽度、高度及相关属性
      const ctx = canvas.value.getContext('2d');
      canvas.value.width = img.width;
      canvas.value.height = img.height;
      ctx.drawImage(img, 0, 0);
      // getColorsFromCanvas();
    };
    img.src = URL.createObjectURL(image);

    console.log('canvas.value.image:', image)

    
  
  };


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