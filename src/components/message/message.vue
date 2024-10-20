<template>
  <Transition name="down">


    <div class="my-message" :style="style[type]" v-show='isShow'>
      <!-- 上面绑定的是样式 -->
      <!-- 不同提示图标会变 -->

      <svg class="svg-icon" :style="style[type]" aria-hidden="true">
        <use :xlink:href="'#icon-'+type"></use>
      </svg>

      <span class="text">{{text}}</span>

    </div>



  </Transition>

</template>

<script>
  export default {
    name: 'myMessage'
  }
</script>
<script setup>
  import { onMounted, ref } from 'vue'


  const props = defineProps({

    text: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      // warn 警告  error 错误  success 成功
      default: 'warn'
    }

  });


  // 定义一个对象，包含三种情况的样式，对象key就是类型字符串
  const style = {
    success: {
      color: '#67C23A',
      fill: '#67C23A',
      backgroundColor: 'rgb(240, 249, 235)',
      borderColor: 'rgb(225, 243, 216)'
    },
    message: {
      color: '#999999',
      fill: '#999999',
      backgroundColor: 'rgb(220, 220, 220)',
      borderColor: 'rgb(220, 219, 219)',
    },
    warning: {
      color: '#E6A23C',
      fill: '#E6A23C',

      backgroundColor: 'rgb(253, 246, 236)',
      borderColor: 'rgb(250, 236, 216)'
    },
    error: {
      color: '#F56C6C',
      fill: '#F56C6C',

      backgroundColor: 'rgb(254, 240, 240)',
      borderColor: 'rgb(253, 226, 226)'
    }

  }
  // 控制动画
  const isShow = ref(false)
  // 组件模板渲染成功后触发
  onMounted(() => {
    isShow.value = true
  })

</script>
<style scoped>
  /* .down {
    &-enter {
      &-from {
      transform: translate3d(0, -75px, 0);
      opacity: 0;
      }
      &-active {
      transition: all 0.5s;
      }
      &-to {
      transform: none;
      opacity: 1;
      }
    }
   } */

  .down-enter-from {
    /* transform: translate3d(0, -75px, 0); */
    opacity: 0;
  }

  .down-enter-active {
    transition: all 0.5s;
  }

  .down-enter-to {
    transform: none;
    opacity: 1;
  }

  .my-message {
    padding: 0;
    margin: 0;
    width: 300px;
    height: 50px;
    position: fixed;
    z-index: 9999;
    left: 50%;
    margin-left: -150px;
    top: 15px;
    line-height: 50px;
    padding: 0 25px;
    border: 1px solid #e4e4e4;
    background: #f5f5f5;
    color: #999;
    border-radius: 4px;


    .svg-icon {
      width: 16px !important;
      height: 16px !important;
      /* fill:red !important; */
      vertical-align: middle !important;
    }

    .text {
      margin-left: 10px;
      vertical-align: middle;
    }
  }
</style>