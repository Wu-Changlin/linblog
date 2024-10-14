
<template>
  <div>
    <div v-show="visible" class="drawer_mask" />
    <el-drawer
      ref="elDrawer"
      :title="title"
      :visible="visible"
      :append-to-body="false"
      :modal-append-to-body="false"
      :modal="false"
      style="position: absolute;"
      :direction="direction"
      :size="size"
      :wrapper-closable="false"
      destroy-on-close
      @close="onClose"
      @open="onOpen"
    >
      <div>
        <slot />
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'CustElDrawer',
  props: {
    title: {
      type: String,
      default: '测试'
    },
    visible: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'rtl'
    },
    size: {
      type: [String, Number],
      default: '30%'
    }
  },
  mounted() {
    // 获取一级父组件和子组件
    // 设置在指定的 包裹该子组件的父dom节点打开 抽屉
    const fatherDom = this.$parent.$el
    const allCss = window.getComputedStyle(fatherDom, null)
    console.log(allCss.position, fatherDom.classList, Array.from(fatherDom.classList).includes('el-drawer__wrapper'), 'allCssallCss')
    if (Array.from(fatherDom.classList).includes('el-drawer__wrapper')) {
      fatherDom.style.position = 'absolute'
    } else {
      if (allCss.position == 'static') {
        // 不是el-drawer
        fatherDom.style.position = 'relative'
      }
    }
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    onOpen() {
      // Drawer 的内容是懒渲染的，即在第一次被打开之前，
      // 传入的默认 slot 不会被渲染到 DOM 上。
      // 因此，如果需要执行 DOM 操作，
      // 或通过 ref 获取相应组件，请在 open 事件回调中进行。
      this.$nextTick(() => {
        // // 只有一个div dom传入,清除在父组件使用slot时候 传入的position属性
        if (this.$slots.default && this.$slots.default.length === 1) {
          console.log(this.$slots.default[0], 'defaultSlots')
          this.$slots.default[0].elm.style = `
          position : static !important
          ` // 默认值，元素的位置有文档流决定，不受top,left等影响
        }
      })
    }
  }
}
</script>

  <style  scoped>
      .drawer_mask {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.5);
      }
  </style>

