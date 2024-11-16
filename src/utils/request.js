/**axios封装* 请求拦截、相应拦截、错误统一处理*/
import axios from 'axios';
import router from '@/router';
// import router from '@/router/index.js'; //Vue Router实例导出自`@/router`
import { getAchieveUseSignData } from "@/hooks/useSign.js";
import $message from "@/components/message/message.js";
import userModuleApi from "@/api/backend/user.js";// 用户模块 api接口
import { useUserStore } from '@/stores/useUserStore.js';//持久存储登录用户相关信息(昵称、令牌、刷新令牌)  会话级


// 令牌
const jsw_access_token=useUserStore().getUserAccessToken;
// console.log('jsw_access_token:',jsw_access_token);

// 创建了3个axios对象:
// 一个前端请求用（axiosServiceFrontend），
// 一个后台请求用（axiosServiceBackend），
// 另一个专门刷新token用（axiosServiceRefreshToken），这样写的好处是省去了易错的判断逻辑

// 使用create 创建axios示例 （当然这里存在很多配置选项，具体需要具体配置）
const axiosServiceFrontend = axios.create({
    //来自相应环境.env文件VITE_BASE_API
    baseURL:import.meta.env.VITE_BASE_API,
    // baseURL:'http://localhost:9090/api/',
    // 请求超时之后做一个重新请求。设置超时
    timeout:5000
})


// 使用create 创建axios示例 （当然这里存在很多配置选项，具体需要具体配置）
const axiosServiceBackend = axios.create({
    //来自相应环境.env文件VITE_BASE_API
    baseURL:import.meta.env.VITE_BASE_API,
    // baseURL:'http://localhost:9090/api/',
    // 请求超时之后做一个重新请求。设置超时
    timeout:5000
})


// 刷新token专用
const axiosServiceRefreshToken=axios.create({
    baseURL:import.meta.env.VITE_BASE_API,
    // baseURL:'http://localhost:9090/api/',
    timeout:5000
})



let token_data={
    backend: jsw_access_token,
}

/* 刷新token 开始*/


let jwt_refresh_token=useUserStore().getRefreshToken;

//前端 请求拦截
axiosServiceFrontend.interceptors.request.use(
    config => {
        // console.log('token_data.backend:',token_data.backend);
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

    // 可以在这里获取请求地址(没有域名部分),如：backend/backend/getAdminOrMenuListData
    const request_url_str= config.url;
     //找到字符串中第一个'/'的位置
    let one_path = request_url_str.indexOf('/');
     //从0开始截取到字符串中第一个'/'的位置截止 （前缀）
    let prefix_name = request_url_str.substring(0, one_path);
    // 根据前缀名称添加相应的token。如果没有用户token，使用数据的签名作为token
    let authorization_str=token_data[prefix_name]??data.sign;
    // 请求头重带着jwt的信息
    config.headers['Authorization'] = 'Bearer '+authorization_str;


        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

// let authorization_str=token_data[prefix_name]??data.sign;
// ??运算符被称为“空值合并运算符”（Nullish Coalescing Operator），用于获取两个表达式中的非空值‌。
// 当左侧表达式为null或undefined时，??运算符会返回右侧表达式的值；否则，返回左侧表达式的值‌

//前端 响应拦截器
axiosServiceFrontend.interceptors.response.use(
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
    async  error => {

console.log('error:',error);

        $message('服务器异常', 'error');
    /* 使用失效token请求的提交数据 配置*/
    let originalRequest=error.config;
    console.log('originalRequest:',originalRequest);
    // 重新请求
//     originalRequest.headers.Authorization = `Bearer ${new_jwt_access_token}`
//     return axiosService.request(originalRequest)  
        /* 刷新token 开始*/

/* 刷新token 结束*/
        

        return Promise.reject(error)
    }
);



// 后端 请求拦截
axiosServiceBackend.interceptors.request.use(
    config => {
        // console.log('token_data.backend:',token_data.backend);
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

    // 可以在这里获取请求地址(没有域名部分),如：backend/backend/getAdminOrMenuListData
    const request_url_str= config.url;
     //找到字符串中第一个'/'的位置
    let one_path = request_url_str.indexOf('/');
     //从0开始截取到字符串中第一个'/'的位置截止 （前缀）
    let prefix_name = request_url_str.substring(0, one_path);
    // 根据前缀名称添加相应的token。如果没有用户token，使用数据的签名作为token
    let authorization_str=token_data[prefix_name]??data.sign;
    // 请求头重带着jwt的信息
    config.headers['Authorization'] = 'Bearer '+authorization_str;


        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

// let authorization_str=token_data[prefix_name]??data.sign;
// ??运算符被称为“空值合并运算符”（Nullish Coalescing Operator），用于获取两个表达式中的非空值‌。
// 当左侧表达式为null或undefined时，??运算符会返回右侧表达式的值；否则，返回左侧表达式的值‌

//后端 响应拦截器
axiosServiceBackend.interceptors.response.use(
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
    async  error => {

console.log('error:',error);

        $message('服务器异常', 'error');
    /* 使用失效token请求的提交数据 配置*/
    let originalRequest=error.config;
    console.log('originalRequest:',originalRequest);
    // 重新请求
//     originalRequest.headers.Authorization = `Bearer ${new_jwt_access_token}`
//     return axiosService.request(originalRequest)  
        /* 刷新token 开始*/

/* 刷新token 结束*/
        

        return Promise.reject(error)
    }
);


// let { message } = error
// if (message === 'Network Error') {
//   message = '网络异常'
// } else if (message.includes('timeout')) {
//   message = '系统接口请求超时'
// } else if (message.includes('failed with status code 500')) {
//   message = '系统接口异常'
// } else if (message.includes('400')) {
//   message = '请求参数错误'
// } else if (message.includes('405')) {
//   message = '请求方法错误'
// } else if (message.includes('401')) {
//   message = '身份验证错误'
// }
// Message({
//   message: message,
//   type: 'error',
//   duration: 5 * 1000
// })






//这里是刷新token专用的axios对象，他的作用是给请求加上刷新token专用的refreshToken
axiosServiceRefreshToken.interceptors.request.use(config=>{
    let token=""
    token=sessionStorage.getItem("refreshToken")
    if(token){
      config.headers.Authorization="Bearer "+token
    }
    return config
  },error=>{
    Promise.reject(error)
  })





export default {axiosServiceFrontend ,axiosServiceBackend,axiosServiceRefreshToken}
