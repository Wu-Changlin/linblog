/**axios封装* 请求拦截、相应拦截、错误统一处理*/
import axios from 'axios';
// import router from '@/router';
import router from '@/router/index.js'; //Vue Router实例导出自`@/router`
import getRefreshAccessToken from "@/api/token/token.js";//使用刷新令牌获取新访问令牌
import { getAchieveUseSignData } from "@/hooks/useSign.js";//生成提交参数的签名
import $message from "@/components/message/message.js";
import { useUserStore } from '@/stores/useUserStore.js';//持久存储登录用户相关信息(昵称、令牌、刷新令牌)  会话级


// 在Axios库中，默认情况下，HTTP 4xx 和 5xx 的错误会被当作成功响应处理，虽然它们都不是 2xx 的成功状态码，但是会进入.then()。
// 自定义validateStatus函数的例子，它将2xx状态码以外的所有状态码都认为是错误的，并将它们导向.catch()块
const validateStatus = (status) => {
    // console.log('validateStatus-status:',status)
    return status >= 200 && status < 300; // 只认为2xx状态码是成功的
};


/* 封装AbortController取消重复请求 
1.在封装axios的全局文件中，先定义两个变量。在全局封装axios的request.js文件的全局里定义两个变量

2.定义一个函数，用来取消请求和删除cacheRequest里对应的请求

3.在请求拦截器里加入取消重复请求的逻辑，所有都加入。

4.在响应拦截器里加入判断。如果请求成功后，清除cacheRequest里对应的存储；并且在error里判断，取消的请求不做任何处理

开始*/
// isCancel-取消标识 可以根据这个值判断请求是否被取消
const { isCancel } = axios;
// cacheRequest 用来存储需要取消重复请求的接口
const cacheRequest = {};



// 删除缓存队列中的请求
function abortCacheRequest(reqKey) {
    if (cacheRequest[reqKey]) {
        // 通过AbortController实例上的abort来终止请求
        cacheRequest[reqKey].abort()
        delete cacheRequest[reqKey]
    }
}

/* 封装AbortController取消重复请求 结束*/


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
    timeout: 5000,
    // 使用自定义的validateStatus函数，将2xx状态码以外的所有状态码都认为是错误的，并将它们导向.catch()块
    validateStatus: validateStatus,
    
})


// 使用create 创建后端 axiosServiceBackend 
const axiosServiceBackend = axios.create({
    //来自相应环境.env文件VITE_BASE_API
    baseURL: import.meta.env.VITE_BASE_API,
    // baseURL:'http://localhost:9090/api/',
    // 请求超时之后做一个重新请求。设置超时
    timeout: 5000,
    // 使用自定义的validateStatus函数，将2xx状态码以外的所有状态码都认为是错误的，并将它们导向.catch()块
    validateStatus: validateStatus,
})


// 刷新token专用
const axiosServiceRefreshToken = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    // baseURL:'http://localhost:9090/api/',
    timeout: 5000,
    // 使用自定义的validateStatus函数，将2xx状态码以外的所有状态码都认为是错误的，并将它们导向.catch()块
    validateStatus: validateStatus,
})

/* 前端axios实例 开始*/

//前端 请求拦截
axiosServiceFrontend.interceptors.request.use(
    config => {

        // 请求地址和请求方式组成唯一标识，将这个标识作为取消函数的key，保存到请求队列中
        const reqKey = `${config.url}&${config.method}`;
        // 如果config传了需要清除重复请求的isAbort，则如果存在重复请求，删除之前的请求
        abortCacheRequest(reqKey);
        // 将请求加入请求队列，通过AbortController来进行手动取消
        const controller = new AbortController();
        config.signal = controller.signal;
        cacheRequest[reqKey] = controller;

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

        if (data.sign) {

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
/??运算符被称为“空值合并运算符”（Nullish Coalescing Operator），用于获取两个表达式中的非空值‌。
当左侧表达式为null或undefined时，??运算符会返回右侧表达式的值；否则，返回左侧表达式的值‌。
示例：message=message??'未知错误';
*/
//前端 响应拦截器
axiosServiceFrontend.interceptors.response.use(
    response => {
        // 请求成功，从队列中移除
        const { url, method } = response.config;
        delete cacheRequest[`${url}&${method}`];
        //response数据 
        // 示例{'config'{} 'headers':{} 'request':{}  'status':200,'statusText''Ok','data':{"code": 0,"data": [{}]"msg": "xxx"}}
        if (response.data.code === 200) {
            // $message(response.data.message,'success');
            //返回response数据中的data对象
            return Promise.resolve(response.data);
            //进行中
        } else {// 服务器状态码不是200的情况
            if (response.data.message) {//如果存在错误消息，那么在顶部显示消息提示。
                $message(response.data.message, 'error');
            }

            return Promise.reject(response); //失败
        }
    },
    error => {
        
        if (isCancel(error)) {

            // 通过AbortController取消的请求不做任何处理
            return Promise.reject({
                message: '重复请求，已取消'
            })
        }

        console.log('Frontend-Error:', error);

        let { message } = error
    
        //防止空消息提示
        message = message ?? error.data.message;

        $message(message, 'error');
        
        return Promise.reject(error)
    }
);

/* 前端axios实例 结束*/


/* 刷新token 开始*/

// 访问令牌 （刷新token 后出现，没有响应式用的旧数据） 
const jwt_access_token = useUserStore().getUserAccessToken;
// console.log('jwt_access_token:',jwt_access_token);
// 刷新令牌
let jwt_refresh_token = useUserStore().getRefreshToken;

/* 后端axios实例 开始*/

// 后端 请求拦截
axiosServiceBackend.interceptors.request.use(
    config => {

        // 请求地址和请求方式组成唯一标识，将这个标识作为取消函数的key，保存到请求队列中
        const reqKey = `${config.url}&${config.method}`;
        // 如果config传了需要清除重复请求的isAbort，则如果存在重复请求，删除之前的请求
        abortCacheRequest(reqKey);
        // 将请求加入请求队列，通过AbortController来进行手动取消
        const controller = new AbortController();
        config.signal = controller.signal;
        cacheRequest[reqKey] = controller;

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

        // 当左侧表达式为null或undefined时，??运算符会返回右侧表达式的值；否则，返回左侧表达式的值‌。
        //有jwt_access_token就是使用，否则使用data.sign
        let token = jwt_access_token ?? data.sign;
        // 请求头Authorization带着jwt的访问令牌信息
        config.headers['Authorization'] = 'Bearer ' + token;


console.log('axios data参数：',config.data)

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
let originalRequestQueue = [];

// 路由地址包含admin字符串才需要刷新访问令牌access_token 
/*
includes()方法用于判断一个数组是否包含一个指定的值，如果包含则返回true，否则返回false。
‌使用includes()检查字符串中是否包含某个字符‌：
使用includes()比较字符串和字符时是区分大小写的。
includes()方法只能用于数组和字符串，不能用于其他数据类型。
*/

const path_contains_admin_string = 'admin';


//后端 响应拦截器
axiosServiceBackend.interceptors.response.use(
    response => {

        // 请求成功，从队列中移除
        const { url, method } = response.config;
        delete cacheRequest[`${url}&${method}`];

        //response数据 
        // 示例{'config'{} 'headers':{} 'request':{}  'status':200,'statusText''Ok','data':{"code": 0,"data": [{}]"msg": "xxx"}}
        if (response.data.code === 200) {
            // $message(response.data.message,'success');
            //返回response数据中的data对象


            return Promise.resolve(response.data);
            // return Promise.reject(error)
            //进行中
        }

            return Promise.reject(response); //失败
        
    },
    async error => {

        if (isCancel(error)) {
            // 通过AbortController取消的请求不做任何处理
            return Promise.reject({
                message: '重复请求，已取消'
            })
        }


        console.log('error:', error);


        /* 使用失效token原始请求数据、配置*/

        let { status, config } = error.response;

        if (refreshing) {
            // 正在刷新token，返回一个未执行resolve的promise
            // 把promise 的resolve 保存到队列的回调里面，等待刷新Token后调用
            // 原调用者会处于等待状态直到 队列重新发起请求，再把响应返回，以达到用户无感知的目的（无痛刷新）
            return new Promise((resolve) => {
                // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行

                originalRequestQueue.push(() => {

                    resolve(config)

                });
            });
        }
        // 请求接口是刷新token不做刷新Token 处理，  进入登录、获取重置密码邮件、重置密码页的不做刷新Token 处理
        // includes() 方法用于判断数组中是否包含某个指定的元素，如果路由路径包含admin字符串，则方法返回 true，否则返回 false。

        // 应该判断config.data.code=401
        if (status === 401 && router.currentRoute.value.path.includes(path_contains_admin_string)) {
            // 改变flag状态，表示正在刷新Token中
            refreshing = true;
            console.log('正在刷新Token中:');
            // 刷新访问令牌 AccessToken
            const get_refresh_access_token_res = await getRefreshAccessToken({ jwt_refresh_token: jwt_refresh_token });

            console.log('get_refresh_access_token_res:', get_refresh_access_token_res);

            if (get_refresh_access_token_res.code === 200) {

                // 循环队列 
                originalRequestQueue.forEach((fn) => {
                    //   清空队列
                    fn()
                })
                // 清空队列
                originalRequestQueue = [];
                // 改变flag状态，  表示没有在刷新Token
                refreshing = false;
                return axiosServiceBackend.request(config);

            } else {
                $message('登录过期，请重新登录!', 'error');
                router.push('/login');

            }
        }


        
        let { message } = error
    
        //防止空消息提示
        message = message ?? error.data.message;

        $message(message, 'error');


        

// 返回Promise.reject结束请求，不再向下执行
return Promise.reject(error)
    }
);
/* 后端axios实例 结束*/




/* 刷新token axios实例 开始*/

//刷新token 请求拦截器，作用是给请求加上刷新token专用的jwt_refresh_token
axiosServiceRefreshToken.interceptors.request.use(config => {
    // 请求地址和请求方式组成唯一标识，将这个标识作为取消函数的key，保存到请求队列中
    const reqKey = `${config.url}&${config.method}`;
    // 如果config传了需要清除重复请求的isAbort，则如果存在重复请求，删除之前的请求
    abortCacheRequest(reqKey);
    // 将请求加入请求队列，通过AbortController来进行手动取消
    const controller = new AbortController();
    config.signal = controller.signal;
    cacheRequest[reqKey] = controller;

    // 请求头Authorization带着jwt的jwt_refresh_token刷新令牌信息
    if (jwt_refresh_token) {

        config.headers.Authorization = "Bearer " + jwt_refresh_token;
    }
    return config
}, error => {
    Promise.reject(error)
})


//刷新token 响应拦截器
axiosServiceRefreshToken.interceptors.response.use(
    response => {
        // 请求成功，从队列中移除
        const { url, method } = response.config;
        delete cacheRequest[`${url}&${method}`];
        //response数据 
        // 示例{'config'{} 'headers':{} 'request':{}  'status':200,'statusText''Ok','data':{"code": 0,"data": [{}]"msg": "xxx"}}
        if (response.data.code === 200) {
            // $message(response.data.message,'success');
            //返回response数据中的data对象
            return Promise.resolve(response.data);
            //进行中
        } else {// 服务器状态码不是200的情况
            if (response.data.message) {//如果存在错误消息，那么在顶部显示消息提示。
                $message(response.data.message, 'error');
            }

            return Promise.reject(response); //失败
        }
    },
    async error => {

        if (isCancel(error)) {
            // 通过AbortController取消的请求不做任何处理
            return Promise.reject({
                message: '重复请求，已取消'
            })
        }

        console.log('axiosServiceRefreshToken-Error:', error);

        let { message } = error
    
        //防止空消息提示
        message = message ?? error.data.message;

        $message(message, 'error');

        return Promise.reject(error)
    }
);



/* 刷新token axios实例 结束*/


export { axiosServiceFrontend, axiosServiceBackend, axiosServiceRefreshToken };