import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { prismjsPlugin } from 'vite-plugin-prismjs';

import { resolve } from 'path'//用于alias文件路径别名
const pathResolve = (dir) =>resolve(__dirname, dir)

export default defineConfig({
  plugins: [
    vue(),
    prismjsPlugin({
        languages: 'all', // 语言
        plugins: ['toolbar','line-numbers','show-language','copy-to-clipboard','inline-color'], //官网有其他功能,这里开启行数和复制按钮功能
        theme: "okaidia", // 主题
        css: true,
    }),
  ],//配置需要使用的插件列表，当前添加vue到插件列表
  resolve: {
    alias: {
      '@': pathResolve("./src"),//将src目录配置别名@方便在项目中导入src目录下的文件
    },
  },
  server: {
    port: 8989,// 设置端口为8989
  },
})