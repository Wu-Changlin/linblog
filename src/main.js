import { createApp  } from 'vue'
import App from './App.vue';
import router from './router/index.js'; //引入配置路由文件
import ElementPlus from 'element-plus'; //引入ElementPlus依赖
import 'element-plus/dist/index.css'; // 引入样式文件index.css
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue'

// pinia
const pinia = createPinia()

// meta 元数据
const head = createHead()


//  安装tooltip
import tooltip from '@/components/tooltip/directive.js';


//  引入样式文件base.css
import '@/assets/base.css';

//  引入iconfont 图标库
import '@/assets/iconfont/iconfont.js';

//  封装 svg-icon 组件
import SvgIcon from '@/components/SvgIcon.vue';


//  引入Axios 实例
// import  {putData,deleteData,getData,postData,postFormData,} from '@/utils/request.js';


//  顶部消息提示
import message from  "@/components/message/message.js";
//  校验方法
import verify from "@/utils/verify.js"

const app = createApp(App);

//全局提供方法
// app.provide('$putData',putData)
// app.provide('$deleteData',deleteData)
// app.provide('$getData',getData)
// app.provide('$postData',postData)
// app.provide('$postFormData',postFormData)

app.provide('$message',message)
app.provide('$verify',verify)


//使用 provide inject 代替getCurrentInstance
// const $putData = inject('$putData');
// const $deleteData = inject('$deleteData');
// const $getData = inject('$getData');
// const $postData = inject('$postData');
// const $postFormData = inject('$postFormData');
// const $message = inject('$message');
//   const $verify = inject('$verify');


//注册SvgIcon组件
app.component('svg-icon', SvgIcon);


//使用app.use()方法将指定的中间件功能放到指定的路径下，
//当请求的路径地址与定义的路由相同时，就会执行指定的中间件功能。
//需要注意的是，如果路由有多个子路由同样也会执行对应的中间件函数。

//  引入Axios 实例
// import http from '@/utils/request.js';
    // .use(http)
app.use(router)
    .use(pinia)
    .use(ElementPlus)
    .use(tooltip)
    .use(head)
app.mount('#app')