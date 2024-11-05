<template>
  <div style="padding-top: 100px;"></div>
  <el-form :model="config_item" :rules="rules" ref="ruleFormRef" label-width="120px"
  style="padding-top: 100px;" class="demo-ruleForm" label-position="left">
    
    <el-form-item v-for="(item, index) in config_item"  :key="index" :prop="index + '.form_tag_active_value‌'">
      <el-input v-model="item.form_tag_active_value‌" :key="index"></el-input>
    </el-form-item>
    <el-button type="primary" @click="submitForm">提交</el-button>
  </el-form>
</template>



<script setup>
  import { ref,onMounted} from 'vue';
  import { ElMessage } from 'element-plus';
  import configurationModuleApi from "@/api/backend/configuration.js";//api接口

  const ruleFormRef=ref(null)
      const config_item = ref({
      
      });

      const form_data = ref({
        items: [
          {id:1, form_tag_active_value‌: 'value1' },
          { id:2,form_tag_active_value‌: 'value2' },
          // 可以根据需要添加更多的items
        ],
      });

const loading=ref(false);


      //获取数据
    function getConfigItemData() {

configurationModuleApi.getConfigItemData({})
    .then(response => {
      config_item.value = response.config_item_list_data;
    })
}

      // 生成循环规则
      const generateRules = (num, validator) => {
 
        const rules = {};
        for (let i = 0; i < num; i++) {
          
          rules[`${i}.form_tag_active_value‌`] = validator;
        }
        return rules;
      };

      const rules = generateRules(Object.keys(config_item).length, [
        { required: true, message: '请输入值', trigger: 'blur' },
        { pattern: /^[0-9]*$/, message: '只能输入数字', trigger: 'blur' },
      ]);

      const submitForm = () => {
        // config_item.value.items.forEach((item, index) => {
        //   config_item.value.items[index].value = item.value.trim();
        // });
        // config_item.value.items = config_item.value.items.filter(item => item.value !== '');

        ruleFormRef.value.validate((valid) => {
          if (valid) {
            ElMessage.success('提交成功');
          } else {
            ElMessage.error('表单验证失败');
            return false;
          }
        });
      };


      onMounted(() => {
        getConfigItemData()
    });
</script>