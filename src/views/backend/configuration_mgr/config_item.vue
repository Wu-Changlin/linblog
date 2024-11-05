<template>
    <div class="feeds-page">
        <div class="feeds-container">

            <div class="page-container">
                <el-form v-if="loading" :model="config_item_list_data" :rules="rules" ref="ruleFormRef"
                    label-width="120px" class="demo-ruleForm" label-position="left">
                    <el-form-item label="配置名称">
                        <span>配置值</span>
                    </el-form-item>
                    <el-form-item v-for="(item, index) in config_item_list_data" :label="item.cn_name" :key="index"
                        :prop="index + '.form_tag_active_value'">
                        <!-- <el-input v-model="item.form_tag_active_value‌" :key="index"></el-input> -->

                        <template v-if="item.form_tag_name==='input'">
                            <el-input v-model="item.form_tag_active_value" :key="index"></el-input>
                        </template>

                        <template v-if="item.form_tag_name==='textarea'">
                            <el-input type="textarea" v-model="item.form_tag_active_value" :key="index"></el-input>
                        </template>

                        <template v-if="item.form_tag_name==='radio'">

                            <el-radio-group v-model="item.form_tag_active_value" :key="index">
                                <el-radio
                                    v-for="(item_form_tag_values,index_form_tag_values) in item.form_tag_values.split(',')"
                                    :key="index_form_tag_values" :value="item_form_tag_values">
                                    {{item_form_tag_values}}
                                </el-radio>
                            </el-radio-group>

                        </template>

                        <template v-if="item.form_tag_name==='checkbox'">
                            <el-checkbox-group v-model="item.form_tag_active_value" :key="index"
                                style="display: flex;overflow: hidden;flex-wrap: wrap;">
                                <el-checkbox
                                    v-for="(item_checkbox_values,index_checkbox_values) in item.form_tag_values.split(',')"
                                    :key="index_checkbox_values" :value="item_checkbox_values"
                                    :label="item_checkbox_values" size="large" style="margin-top: 10px;">
                                    <el-tag>{{ item_checkbox_values }}</el-tag>
                                </el-checkbox>
                            </el-checkbox-group>

                        </template>

                        <template v-if="item.form_tag_name==='select'">

                            <el-select v-model="item.form_tag_active_value" :key="index" size="large">

                                <el-option
                                    v-for="(item_select_values,index_select_values) in item.form_tag_values.split(',')"
                                    :key="index_select_values" :label="item_select_values"
                                    :value="item_select_values" />

                            </el-select>

                        </template>

                    </el-form-item>
                    <div class="submit-form-button">
                        <el-button type="primary" @click="submitBatchEditConfigItem">提交</el-button>

                    </div>

                </el-form>
            </div>
        </div>
    </div>
</template>



<script setup>
    import { ref, onMounted, inject, watch } from 'vue';
    import configurationModuleApi from "@/api/backend/configuration.js";//api接口
    import configItemDynamicForm from "@/views/backend/configuration_mgr/config_item_dynamic_form.vue";
    //配置项数据
    const config_item_list_data = ref();

    const loading = ref(false);
    // 验证规则引用
    const rules = ref();

    //获取数据
    function getConfigItemData() {
        configurationModuleApi.getConfigItemData({})
            .then(response => {

                config_item_list_data.value = response.config_item_list_data;
                loading.value = true;
                const config_item_count = Object.keys(config_item_list_data.value).length;
                //输出验证规则
                rules.value = generateRules(config_item_count, [
                    { required: true, message: '请输入值', trigger: 'blur' },
                    { max: 30, message: "长度在30 个字符以内", trigger: 'blur' },
                ])

            })
    }



    onMounted(() => {
        getConfigItemData()
    });




    //使用 provide inject 代替getCurrentInstance
    const $message = inject('$message');

    const ruleFormRef = ref(null)


    // console.log('props.formItemData:',props.formItemData)
    // 生成循环规则
    function generateRules(num, validator) {

        const rules = {};
        for (let i = 0; i < num; i++) {

            rules[`${i}.form_tag_active_value‌`] = validator;
        }
        return rules;
    };


    let objectsArray = [
        { name: 'cbox', v: ['x', 'a'] },
        // 可以添加更多对象
    ];

    let result = objectsArray.map(obj => {
        return {
            name: obj.name,
            vString: obj.v.join(',')
        };
    });

    console.log(result);





    //提交批量修改表单数据
    function submitBatchEditConfigItem() {
        //校验表单项
        ruleFormRef.value.validate((valid, fields) => {
            if (fields) { // 有字段没有通过验证
                // 获取第一个没有通过验证的表单项
                let prop_name = Object.keys(fields)[0];
                //使用formEl.scrollToField方法来焦点定位并滚动到特定的表单字段,这里跳到第一个字段
                ruleFormRef.value.scrollToField(prop_name);
                // console.log('prop_name:',prop_name)
                $message('表单验证失败，请检查', 'warning');
                return false;
            }
        });

        let objects = [{ name: 'cbox', v: ['x', 'a'] }, { name: 'i', v: 'k' }];

        // 提取configuration_id和form_tag_active_value值，并将form_tag_active_value值(数组)转换为字符串。
        // 提交部分数据，例如configuration_id和form_tag_active_value‌
        let part_data = config_item_list_data.value.map(obj => {
            let configuration_id = obj.configuration_id;
            let form_tag_active_value = Array.isArray(obj.form_tag_active_value) ? obj.form_tag_active_value.join(',') : obj.form_tag_active_value; // 如果v是数组，使用join转换成字符串
            return { configuration_id, form_tag_active_value };
        });



        let part_data_to_str = JSON.stringify(part_data);

        let submit_data = {
            part_data: part_data_to_str
        }

        configurationModuleApi.batchEditConfigItem(submit_data)
            .then(response => {
                $message('成功修改', 'success');

            })

    };
</script>

<style scoped>
    .feeds-page {
        flex: 1;
        width: 100%;
        margin: 0;
        /* padding:0px 12px; */
        /* max-width: 1260px; */
        /* 修改盒子大小属性 */
        padding: 0px 12px;
        /* background-color: var(--bg); */
        /* height: 100vh; */
        overflow: auto;
        background-color: #eee;

        /* 底部栏内容高度 */
        /* position: relative; */
        .feeds-container {
            /* top: 72px; */
            position: relative;
            margin: 0;
            width: 100%;
            transition: width 0.5s;
            margin-top: 10px;
            /* max-width: 1236px; */
            min-height: 100%;
        }

    }



    .page-container {
        margin-top: 72px;
        background-color: var(--bg);
        height: 100%;
    }


    :deep(.submit-form-button) {
        display: flex;
        margin-left: 0px;
        justify-content: center;
        padding: 20px 0px;

    }
</style>