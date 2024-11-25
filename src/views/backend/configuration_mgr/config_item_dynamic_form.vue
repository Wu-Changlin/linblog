<template>
    <!-- <el-form :model="props.formItemData" :rules="rules" ref="ruleFormRef" label-width="120px" style="padding-top: 100px;"
        class="demo-ruleForm" label-position="left">
        <el-form-item label="配置名称">
            <span>配置值</span>
        </el-form-item>
        <el-form-item v-for="(item, index) in props.formItemData" :label="item.cn_name" :key="index" :prop="index + '.form_tag_active_value‌'">
            <el-input v-model="item.form_tag_active_value‌" :key="index"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
    </el-form> -->

    <el-form :model="config_item" :rules="rules" ref="ruleFormRef" label-width="120px" style="padding-top: 100px;"
        class="demo-ruleForm" label-position="left">
        <el-form-item label="配置名称">
            <span>配置值</span>
        </el-form-item>
        <el-form-item v-for="(item, index) in config_item" :label="item.cn_name" :key="index"
            :prop="index + '.form_tag_active_value‌'">
            <el-input v-model="item.form_tag_active_value‌" :key="index"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
    </el-form>

</template>



<script setup>
    import { ref, onMounted, inject, watch } from 'vue';
    import configurationModuleApi from "@/api/backend/configuration.js";//api接口
    import configItemDynamicForm from "@/views/backend/configuration_mgr/config_item_dynamic_form.vue";



    const config_item = ref();

    const loading = ref(false);
    const rules = ref();

    //获取数据
    function getConfigItemData() {
        configurationModuleApi.getConfigItemData({})
            .then(response => {

                config_item.value = response.config_item_list_data;
                loading.value = true;
                rules.value = generateRules(12, [
                    { required: true, message: '请输入值', trigger: 'blur' },
                    { pattern: /^[0-9]*$/, message: '只能输入数字', trigger: 'blur' },
                ])

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



    onMounted(() => {
        getConfigItemData()
    });




    //使用 provide inject 代替getCurrentInstance
    const $message = inject('$message');

    const ruleFormRef = ref(null)
    // const formItemData = ref({});

    //     const props = defineProps({
    //         formItemData: {//父页面传标签数据
    //         type: Object
    //     },

    //   });

    // console.log('props.formItemData:',props.formItemData)
    // 生成循环规则
    const generateRules = (num, validator) => {
        console.log('num:', num)
        const rules = {};
        for (let i = 0; i < num; i++) {

            rules[`${i}.form_tag_active_value‌`] = validator;
        }
        return rules;
    };

    // const rules = generateRules(Object.keys(props.formItemData).length, [
    //     { required: true, message: '请输入值', trigger: 'blur' },
    //     { pattern: /^[0-9]*$/, message: '只能输入数字', trigger: 'blur' },
    // ]);



    const submitForm = () => {
        // props.formItemData.value.items.forEach((item, index) => {
        //   props.formItemData.value.items[index].value = item.value.trim();
        // });
        // props.formItemData.value.items = props.formItemData.value.items.filter(item => item.value !== '');
        ruleFormRef.value.validate((valid) => {
            if (valid) {
                $message('提交成功', 'success');
            } else {
                $message('表单验证失败', 'error');
                return false;
            }
        });
    };
</script>