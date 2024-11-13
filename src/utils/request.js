/**axios封装* 请求拦截、相应拦截、错误统一处理*/
import axios from 'axios';
import router from '@/router';
// import router from '@/router/index.js'; //Vue Router实例导出自`@/router`
import { getAchieveUseSignData } from "@/hooks/useSign.js";
import $message from "@/components/message/message.js";



// console.log('route.name:',route);


// 使用create 创建axios示例 （当然这里存在很多配置选项，具体需要具体配置）
const axiosService = axios.create()


// console.log(import.meta.env.VITE_BASE_API)

// axiosService.defaults.baseURL = '/api';
//来自相应环境.env文件VITE_BASE_API
axiosService.defaults.baseURL = import.meta.env.VITE_BASE_API;

let token_data={
    backend: sessionStorage.getItem('jwt'),
}

//请求拦截
axiosService.interceptors.request.use(
    config => {
        // console.log(config)
        // 每次发送请求之前判断vuex中是否存在token        
        // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断 
        // config.headers.token = sessionStorage.getItem('token')
        // config.data=config.data
        //  在发送请求之前添加公共参数

        // 比如添加一个公共的token
        // config.headers['Authorization'] = 'Bearer your-token';
        // 添加公共的query参数
        // config.params = { ...config.params, params: 'params' };
        // 添加公共的body参数
        let data={};
        if (config.method === 'post') {
            data = getAchieveUseSignData(config.data);
            config.data = data;

        } else if (config.method === 'get') {
            data = getAchieveUseSignData(config.params);
            config.params = data;
        }
        // 使用签名作为前端token
        token_data.frontend=data.sign;

    // 可以在这里获取请求地址(没有域名部分),如：backend/backend/getAdminOrMenuListData
    const request_url_str= config.url;
     //找到字符串中第一个'/'的位置
    let one_path = request_url_str.indexOf('/');
     //从0开始截取到字符串中第一个'/'的位置截止 （前缀）
    let prefix_name = request_url_str.substring(0, one_path);
    // 根据前缀名称添加相应的token
    
    let authorization_str=token_data[prefix_name]??data.sign;
    config.headers['Authorization'] = 'Bearer '+authorization_str;


        return config;
    },
    error => {
        return Promise.reject(error);
    }
)
// 响应拦截器
axiosService.interceptors.response.use(
    response => {
        //response数据 
        // 示例{'config'{} 'headers':{} 'request':{}  'status':200,'statusText''Ok','data':{"code": 0,"data": [{}]"msg": "xxx"}}
        if (response.data.code === 200) {
            // $message(response.data.msg,'success');
            //返回response数据中的data对象
        
            return Promise.resolve(response.data);

            //进行中
        } else {// 服务器状态码不是200的情况
            if (response.data.msg) {//如果存在错误消息，那么在顶部显示消息提示。
                $message(response.data.msg, 'error');
            }
        
            return Promise.reject(response); //失败
        }
    },
    error => {
console.log('error:',error);

        $message('服务器异常', 'error');
        // if (error.response.status) {
        //     switch (error.response.status) {
        //         // 401: 未登录                
        //         // 未登录则跳转登录页面，并携带当前页面的路径                
        //         // 在登录成功后返回当前页面，这一步需要在登录页操作。                
        //         case 401:// 自定义过期之后的操作break// 403 token过期                
        //         // 登录过期对用户进行提示                
        //         // 清除本地token和清空vuex中token对象                
        //         // 跳转登录页面                
        //         console.log("跳转登录页面")
        //         break
        //         case 403:
        //         sessionStorage.clear()
        //         break// 404请求不存在                
        //         case 404:break;// 其他错误，直接抛出错误提示                
        //         default:
        //     }
        //     return Promise.reject(error.response);
        // }
    }
);

export default axiosService
