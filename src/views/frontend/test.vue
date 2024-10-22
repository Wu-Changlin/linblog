<template>

</template>

<script setup>
  import { ref, reactive, onMounted, provide, watch, onUnmounted,inject ,computed} from "vue";
  import  Base64 from "@/hooks/useBase64.js";
  import  {getAchieveUseSignData} from "@/hooks/useSign.js";


  const data = {
        page_head_title: "首页",
        page_head_keyword: "关键字",
        page_head_description: "描述首页",
        total_pages: 1,
        current_page: 1,
        current_active_tag_id: 20,
        current_active_tag_name: "html",
        website_approve_title: "桂icp0000号",
        website_approve_url: "https://beian.miit.gov.cn/#/Integrated/index",
        tag_data: '1,2,3',
        tag_ids_name: "C++,Java,Python",
        visits: 3000,
        word_count: 30000,
        read_time: "19:47",
        title: "后端（Back-end）： 执行应用的核心逻辑，处理用户的请求，与数据库交互，返回相应的数据。",
        author_name: "原创",
        created_time: "2024-09-13 23:29:17",
        article_content: '## 3.2. 【拉开序幕的 setup】 ### setup 概述 `setup`是`Vue3`中一个新的配置项，值是一个函数，它是 `Composition API` **“表演的舞台**_**”**_，组件中所用到的：数据、方法、计算属性、监视......等等，均配置在`setup`中。 ```go package main import "fmt" func main() { fmt.Println("Google" + "Runoob") } ``` ```htmlHTMLCSSJavaScriptFlutterVueReactSvelte``` * `Vue2`的生命周期 > 创建阶段：`beforeCreate`、`created` > > 挂载阶段：`beforeMount`、`mounted` > > 更新阶段：`beforeUpdate`、`updated` > > 销毁阶段：`beforeDestroy`、`destroyed` | 日期 | 月 | | ------------ | ------------ | |09 | 09 | | 09 |08 | 特点如下： - `setup`函数返回的对象中的内容，可直接在模板中使用。 - `setup`中访问`this`是`undefined`。 - `setup`函数会在`beforeCreate`之前调用，它是“领先”所有钩子执行的。 ```html ``` ### setup 的返回值 - 若返回一个**对象**：则对象中的：属性、方法等，在模板中均可以直接使用**（重点关注）。** - 若返回一个**函数**：则可以自定义渲染内容，代码如下： ```jsx setup(){ return ()=> "你好啊！" } ``` ### setup 与 Options API 的关系 - `Vue2` 的配置（`data`、`methos`......）中**可以访问到** `setup`中的属性、方法。 - 但在`setup`中**不能访问到**`Vue2`的配置（`data`、`methos`......）。 - 如果与`Vue2`冲突，则`setup`优先。 ### setup 语法糖 `setup`函数有一个语法糖，这个语法糖，可以让我们把`setup`独立出去，代码如下： ```html ``` 扩展：上述代码，还需要编写一个不写`setup`的`script`标签，去指定组件名字，比较麻烦，我们可以借助`vite`中的插件简化 1. 第一步：`npm i vite-plugin-vue-setup-extend -D` 2. 第二步：`vite.config.ts` ```jsx import { defineConfig } from "vite" import VueSetupExtend from "vite-plugin-vue-setup-extend" export default defineConfig({ plugins: [ VueSetupExtend() ] }) ``` 3. 第三步：`")'
    }

  // 获取实现签名后数据
  getAchieveUseSignData(data);

  

  const str_two = ref('一');
const asciiString = ref('');


let asciiCode = str_two.value.charCodeAt(0);


// console.log('asciiCode:',asciiCode); // 输出: 65

// 转换函数
function convertToAscii(inputStr) {
  let result = '';
  for (let i = 0; i < inputStr.length; i++) {
    const charCode = inputStr.charCodeAt(i);
    result +=charCode.toString(16).padStart(4, '0');
  }
  return result;
}

// console.log(str_two.value.charCodeAt())


// console.log('str_two.value.charCodeAt(0):',str_two.value.charCodeAt(0));

// 将字符串转换为 ASCII 码
function stringToAscii(str) {
  let ascii = '';
  for (let i = 0; i < str.length; i++) {
    ascii += (str[i].charCodeAt(0) & 0xFF).toString(16);
  }
  return ascii;
}

// 示例
// console.log(stringToAscii('Javascript')); // 4a617661736372697074


// 示例
// console.log('stringToAscii(Javascript):',stringToAscii('中')); 


const chineseChar = ref('中');
const asciiValue = computed(() => chineseChar.value.charCodeAt(0));
// 应用转换
asciiString.value = convertToAscii(str_two.value);
</script>