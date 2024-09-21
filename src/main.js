import { createApp } from 'vue'
// import './style.css'
import App from './App.vue';
import router from './router/index.js'; //引入配置路由文件
import ElementPlus from 'element-plus'; //引入ElementPlus依赖
import 'element-plus/dist/index.css'; // //引入样式文件index.css



// 安装tooltip
import tooltip from '@/components/tooltip/directive.js';


//引入样式文件base.css
import '@/assets/base.css';

// 引入iconfont 图标库
import './assets/iconfont/iconfont.js';

//封装 svg-icon 组件
import SvgIcon from '@/components/SvgIcon.vue';
 
const app = createApp(App);


//注册SvgIcon组件
app.component('svg-icon', SvgIcon);

//使用app.use()方法将指定的中间件功能放到指定的路径下，
//当请求的路径地址与定义的路由相同时，就会执行指定的中间件功能。
//需要注意的是，如果路由有多个子路由同样也会执行对应的中间件函数。

// 注册highlight的vue插件

app.use(router)
    .use(ElementPlus)
    .use(tooltip)
app.mount('#app')