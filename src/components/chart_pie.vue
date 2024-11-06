<template>

  <div ref="chartContainerRef" class="chart-container">
    <canvas ref="chartCanvasRef"></canvas>
  </div>

</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { Chart as chartJs } from 'chart.js/auto';

  //  chart容器dom引用
  const chartContainerRef = ref(null);
  //  Canvas容器dom引用
  const chartCanvasRef = ref(null);

  const props = defineProps({
    parentPageVisitsIpCountData: {//父页面传标签数据
      type: Object
    }
  });


  onMounted(() => {

    const ctx = chartCanvasRef.value.getContext('2d');
    const chart = new chartJs(ctx, {
      type: 'pie', // 或者 'line', 'pie', 等等
      data: props.parentPageVisitsIpCountData,
      options: {}
    });


    // let chart = new chartJs(ctx, {
    //   type: 'pie', // 或者 'line', 'pie', 等等
    //   data: {
    //     labels: pro,
    //     datasets: [{
    //       label: '数量',
    //       data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
    //       backgroundColor: ['rgb(255, 255, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(0, 255, 255)', 'rgb(255, 0, 255)', 'rgb(255, 255, 128)', 'rgb(121, 36, 35)', 'rgb(176, 224, 230)', 'rgb(65, 105, 225)', 'rgb(106, 90, 205)', 'rgb(135, 206, 235)', 'rgb(8, 46, 84)', 'rgb(250, 235, 215)', 'rgb(255, 97, 0)', 'rgb(127, 255, 212)', 'rgb(64, 224, 208)', 'rgb(237, 145, 33)', 'rgb(127, 255, 0)', 'rgb(245, 222, 179)', 'rgb(244, 164, 197)', 'rgb(148, 0, 211)', 'rgb(75, 0, 130)', 'rgb(106, 90, 205)', 'rgb(186, 85, 211)', 'rgb(139, 0, 139)', 'rgb(138, 226, 238)', 'rgb(176, 224, 230)', 'rgb(99, 165, 166)', 'rgb(167, 189, 218)', 'rgb(247, 187, 179)', 'rgb(243, 156, 109)', 'rgb(249, 237, 189)', 'rgb(255, 123, 123)', 'rgb(128, 123, 123)', 'rgb(255, 0, 0)'],
    //     }]
    //   },
    //   options: {}
    // });

  });
</script>


<style scoped>
  .chart-container {
  position: relative;
  margin: auto;
  height: 100%;
  width: 100%;
}

</style>