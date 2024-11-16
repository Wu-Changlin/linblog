/**axios封装* 请求拦截、相应拦截、错误统一处理*/
import axios from 'axios';
import router from '@/router';
// import router from '@/router/index.js'; //Vue Router实例导出自`@/router`
import  getRefreshAccessToken  from "@/api/backend/token.js";
import { getAchieveUseSignData } from "@/hooks/useSign.js";
import $message from "@/components/message/message.js";
import { useUserStore } from '@/stores/useUserStore.js';//持久存储登录用户相关信息(昵称、令牌、刷新令牌)  会话级




/* 
创建了3个axios对象（这样写的好处是省去了易错的判断逻辑）:
    1. 前端请求用（axiosServiceFrontend）。
    2. 后台请求用（axiosServiceBackend）。
    3. 专门刷新token用（axiosServiceRefreshToken）。
*/

// 使用create 创建前端 axiosServiceFrontend示例 （当然这里存在很多配置选项，具体需要具体配置）
const axiosServiceFrontend = axios.create({
    //来自相应环境.env文件VITE_BASE_API
    baseURL: import.meta.env.VITE_BASE_API,
    // baseURL:'http://localhost:9090/api/',
    // 请求超时之后做一个重新请求。设置超时
    timeout: 5000
})


// 使用create 创建后端 axiosServiceBackend 
const axiosServiceBackend = axios.create({
    //来自相应环境.env文件VITE_BASE_API
    baseURL: import.meta.env.VITE_BASE_API,
    // baseURL:'http://localhost:9090/api/',
    // 请求超时之后做一个重新请求。设置超时
    timeout: 5000
})


// 刷新token专用
const axiosServiceRefreshToken = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    // baseURL:'http://localhost:9090/api/',
    timeout: 5000
})

/* 前端axios实例 开始*/

//前端 请求拦截
axiosServiceFrontend.interceptors.request.use(
    config => {
        //  在发送请求之前添加公共参数
        // 比如添加一个公共的token
        // config.headers['Authorization'] = 'Bearer your-token';
        // 添加公共的query参数
        // config.params = { ...config.params, params: 'params' };
        // 添加公共的body参数
        let data = {};
        if (config.method === 'post') {
            data = getAchieveUseSignData(config.data);
            config.data = data;

        } else if (config.method === 'get') {
            data = getAchieveUseSignData(config.params);
            config.params = data;
        }

        if(data.sign){
            
            // 请求头Authorization使用数据的签名作为token
        config.headers['Authorization'] = 'Bearer ' + data.sign;
        }

        
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

/* 
??运算符被称为“空值合并运算符”（Nullish Coalescing Operator），用于获取两个表达式中的非空值‌。
当左侧表达式为null或undefined时，??运算符会返回右侧表达式的值；否则，返回左侧表达式的值‌。
示例：message=message??'未知错误';
*/
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
    async error => {

        console.log('Frontend-Error:', error);

        let { message } = error
        if (message === 'Network Error') {
            message = '网络异常'
        } else if (message.includes('timeout')) {
            message = '系统接口请求超时'
        } else if (message.includes('failed with status code 500')) {
            message = '系统接口异常'
        } else if (message.includes('400')) {
            message = '请求参数错误'
        } else if (message.includes('405')) {
            message = '请求方法错误'
        } else if (message.includes('401')) {
            message = '身份验证错误'
        }
        //防止空消息提示
        message=message??'未知错误';

        $message(message, 'error');

        return Promise.reject(error)
    }
);

/* 前端axios实例 结束*/


/* 刷新token 开始*/

// 访问令牌
const jwt_access_token = useUserStore().getUserAccessToken;
// console.log('jwt_access_token:',jwt_access_token);
// 刷新令牌
let jwt_refresh_token = useUserStore().getRefreshToken;

/* 后端axios实例 开始*/

// 后端 请求拦截
axiosServiceBackend.interceptors.request.use(
    config => {
        // console.log('token_data.backend:',token_data.backend);
        // 每次发送请求之前判断pinia中是否存在token        
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
        let data = {};
        if (config.method === 'post') {
            data = getAchieveUseSignData(config.data);
            config.data = data;

        } else if (config.method === 'get') {
            data = getAchieveUseSignData(config.params);
            config.params = data;
        }

        if(jwt_access_token){
            // 请求头Authorization带着jwt的访问令牌信息
            config.headers['Authorization'] = 'Bearer ' + jwt_access_token;
        }
        


        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

/*
一个 refreshing 的标记，记录是否正在刷新token，如果在刷新，那就返回一个 promise，
并且把它的 resolve 方法还有 config 加入到一个队列(originalRequestQueue)里。
*/
let refreshing = false; // 防止同时刷新Token
// 原始请求数据、配置  (存储失败的请求)
let originalRequestQueue=[]; 

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
    async error => {

        console.log('error:', error);

        $message('服务器异常', 'error');
        /* 使用失效token原始请求数据、配置*/

        let { status, config } = error.response;
        
        if(refreshing) {
            return new Promise((resolve) => {
                originalRequestQueue.push({
                    config,
                    resolve
                });
            });
        }
        console.log('data.statusCode === 401 && !config.url.includes(/refresh)',status ,',',!config.url.includes('/refresh'))

        if (status === 401 && !config.url.includes('backend/token/getRefreshAccessToken')) {
            refreshing = true;
            console.log(111);
            // 刷新访问令牌 AccessToken
            const get_refresh_access_token_res = await getRefreshAccessToken();

            refreshing = false;
            console.log('get_refresh_access_token_res:',get_refresh_access_token_res);

            if(get_refresh_access_token_res.code === 200) {

                originalRequestQueue.forEach(({config, resolve}) => {
                     //   清空队列
                 originalRequestQueue = [];
                    resolve(axiosServiceBackend(config))
                })
  //   清空队列
//   originalRequestQueue = [];
                return axiosServiceBackend(config);
            } else {
        $message('登录过期，请重新登录!', 'error');
        router.push('/login');
            
            }
        } else {
            return error.response;
        }


        // 重新请求
        //     originalRequest.headers.Authorization = `Bearer ${new_jwt_access_token}`
        //     return axiosService.request(originalRequest)  
        /* 刷新token 开始*/

        /* 刷新token 结束*/


        return Promise.reject(error)
    }
);
/* 后端axios实例 结束*/

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


/* 刷新token axios实例 开始*/

//刷新token 请求拦截器，作用是给请求加上刷新token专用的jwt_refresh_token
axiosServiceRefreshToken.interceptors.request.use(config => {

    // 请求头Authorization带着jwt的jwt_refresh_token刷新令牌信息
    if (jwt_refresh_token) {
        
        config.headers.Authorization = "Bearer " + jwt_refresh_token;
    }
    return config
}, error => {
    Promise.reject(error)
})

/* 刷新token axios实例 结束*/


export { axiosServiceFrontend, axiosServiceBackend, axiosServiceRefreshToken };