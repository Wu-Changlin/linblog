<template>
    <div class="feeds-page">
        <div class="feeds-container">

            <el-form ref="ruleFormRef"  :model="config_item" label-width="120px"
                style="padding-top: 100px;" class="demo-ruleForm" label-position="left">

                <el-form-item label="配置名称">
                    <span>配置值</span>
                </el-form-item>

                <div v-for="(item,index) in config_item">

                    <el-form-item   :label="item.cn_name" prop="form_tag_active_value‌" :key="item.configuration_id">
                        <template v-if="item.form_tag_name==='input'">
                            <el-input v-model="item.form_tag_active_value‌"></el-input>
                        </template>

                        <template v-if="item.form_tag_name==='textarea'">
                            <el-input v-model="item.form_tag_active_value‌"></el-input>
                        </template>

                        <template v-if="item.form_tag_name==='radio'">

                            <el-radio-group v-model="item.form_tag_active_value‌" @change="checkColumnRadio">
                                <el-radio
                                    v-for="(item_form_tag_value‌s,index_form_tag_value‌s) in item.form_tag_value‌s.split(',')"
                                    :key="index_form_tag_value‌s" :value="item_form_tag_value‌s">
                                    {{item_form_tag_value‌s}}
                                </el-radio>
                            </el-radio-group>

                        </template>

                        <template v-if="item.form_tag_name==='checkbox'">
                            <el-input v-model="item.form_tag_active_value‌"></el-input>
                        </template>

                        <template v-if="item.form_tag_name==='select'">
                            <el-input v-model="item.form_tag_active_value‌"></el-input>
                        </template>

                    </el-form-item>






                </div>

                <el-form-item>
                    <div style="width: 100%;">
                        <el-button type="primary" @click="clickSubmit()">提交</el-button>
                    </div>

                </el-form-item>

            </el-form>


        </div>


    </div>
</template>

<script setup>
    import { ref, reactive, inject, onMounted, onUnmounted, computed } from "vue";
    import { useRoute, useRouter } from "vue-router";
    import ArticleCoverList from '@/components/backend/article_cover_list.vue';
    import Table from "@/components/backend/table.vue";
    import { listenMsg } from '@/components/cross_tag_msg/crossTagMsg.js';
    import configurationModuleApi from "@/api/backend/configuration.js";//api接口


    const route = useRoute();
    const router = useRouter();

    //使用 provide inject 代替getCurrentInstance
    const $verify = inject('$verify');
    const $message = inject('$message');

    const ruleForm = ref();
    const ruleFormRef = ref(null);


    function checkColumnRadio(val) {
        console.log('checkColumnRadio:', val);
    }

    //表头  //scopedSlot 自定义插槽的名字
    const table_header = ref([]);
    //选择器数据
    const options_form_tag_type_data = ref([]);

    // 获取页面框架数据
    function getPageLayoutData() {

        configurationModuleApi.getPageLayoutData({})
            .then(response => {
                table_header.value = response.table_header;
                options_form_tag_type_data.value = response.options_form_tag_type_data;
            })
            .catch(error => {
                // console.log(' getPageLayoutData()=>error:',error)
                $message('请求未找到', 'error');
                // $message('请求未找到', 'error');
            });

    }

 

    // 提交修改
    function clickSubmit() {
        //valid 类型：布尔值 。fields 没有通过校验的字段，类型：对象

        // 处理提交逻辑
        // configurationModuleApi.batchEditConfigItem(ruleForm)
        //     .then(response => {

        //         console.log("response:", response)
        //     })


        // 提交部分数据，例如configuration_id和form_tag_active_value‌
  const dataToSubmit = config_item.value.map(item => ({ configuration_id: item.configuration_id, form_tag_active_value‌: item.form_tag_active_value‌ }));
  console.log('Submitting data:', dataToSubmit);

                console.log("表单数据:", config_item.value)
                $message('修改成功', 'success');
    


    }






    const config_item = ref();



    //获取数据
    function getConfigItemData() {

        configurationModuleApi.getConfigItemData({})
            .then(response => {
                config_item.value = response.config_item_list_data;


                console.log('config_item', config_item.value)



            })
    }




    onMounted(() => {
        getConfigItemData()
    });



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
        height: 100vh;
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

    .flex-form {
        display: flex;
        flex-wrap: wrap;
    }

    .flex-form>.el-form-item {
        flex: 0 0 auto;
        /* 不允许缩放，基于内容宽度 */
        margin: 15px;
        /* 表单项间隔 */
        width: 220px;
    }


    .el-form-item-button {
        width: 100% !important;
    }
</style>