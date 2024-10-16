<template>

  <el-select v-model="selectedValue" placeholder="请选择">
    <template #prefix>
      <!-- 将前置插槽数据设置为label的值 -->
      <span style="font-weight:600;background-color: red"> {{selectedLabel }}</span>
    </template>


    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>

</template>

<script setup>
  import { ref ,computed} from 'vue';
  import { Check } from '@element-plus/icons-vue';

  const options = [
    { label: '选项1', value: 'option1' },
    { label: '选项2', value: 'option2' },
    { label: '选项3', value: 'option3' },
  ];

  const selectedValue = ref(null);
  const selectedLabel = computed(() => {
    const selectedOption = options.find(option => option.value === selectedValue.value);
    return selectedOption ? selectedOption.label : '';
  });
</script>