import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { resolve } from 'path'//用于alias文件路径别名
const pathResolve = (dir) =>resolve(__dirname, dir)

export default defineConfig({
  plugins: [vue()],//配置需要使用的插件列表，当前添加vue到插件列表
  resolve: {
    alias: {
      '@': pathResolve("./src"),//将src目录配置别名@方便在项目中导入src目录下的文件
    },
  },
  server: {
    port: 8989,// 设置端口为8989
  },
})
