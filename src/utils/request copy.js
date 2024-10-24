/**axios封装* 请求拦截、相应拦截、错误统一处理*/
import axios from 'axios';
import router from '@/router/index.js';


// let protocol = window.location.protocol; //协议
// let host = window.location.host; //主机
// let port = window.location.port; //主机端口
// let reg = /^localhost+/;
// if(reg.test(host)) {
//   //若本地项目调试使用
//    axios.defaults.baseURL = 'http://localhost:8888';
// } else {
//    //动态请求地址             协议               主机
//    axios.defaults.baseURL = protocol + "//" + host  + ":" + port;
// }




// development 本地开发环境
// test    测试环境
// production   生产环境
// if (process.env.NODE_ENV === "development") {
//     axios.defaults.baseURL = "/api";
//   }
  
// console.log(import.meta.env.VITE_BASE_API)


export const apiName = "/api";
// axios.defaults.baseURL = '/api';
//来自相应环境.env文件VITE_BASE_API
axios.defaults.baseURL = import.meta.env.VITE_BASE_API;

//请求拦截
axios.interceptors.request.use(
    
    async config => {
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
    const timestamp = Date.now(); // 或者使用其他方式生成当前时间的时间戳
    config.data = { ...config.data, time:timestamp };
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)
// 响应拦截器
axios.interceptors.response.use(
    response => {
        if (response.status === 200) {return Promise.resolve(response); 
            //进行中
        } else {
            return Promise.reject(response); //失败
        }},// 服务器状态码不是200的情况    
        error => {
            if (error.response.status) {
                switch (error.response.status) {
                    // 401: 未登录                
                    // 未登录则跳转登录页面，并携带当前页面的路径                
                    // 在登录成功后返回当前页面，这一步需要在登录页操作。                
                    case 401:// 自定义过期之后的操作break// 403 token过期                
                    // 登录过期对用户进行提示                
                    // 清除本地token和清空vuex中token对象                
                    // 跳转登录页面                
                    console.log("跳转登录页面")
                    break
                    case 403:
                    sessionStorage.clear()
                    break// 404请求不存在                
                    case 404:break;// 其他错误，直接抛出错误提示                
                    default:
                }
                return Promise.reject(error.response);
            }
        }
);

/** * get方法，对应get请求 * @param {String} url [请求的url地址] * @param {Object} params [请求时携带的参数] */
export const getData = (url, params) => {
    return axios.get(url, {params: params})
    .then(response => {
        return response.data;
    }).catch(error => {
        return error.data;
    })
}
/** * post方法，对应post请求 * @param {String} url [请求的url地址] * @param {Object} params [请求时携带的参数] */
export const postData = (url, params) => {
    return axios.post(url, params,{headers:{'Content-Type': 'application/json'}}) 
    //是将对象 序列化成URL的形式，以&进行拼接   
    .then(response => {
        return response.data;
    })
    .catch(error => {
        return error.data
    })
}
//表单提交
export const postFormData = (url, params) => {
    return axios.post(url, params,{headers:{'Content-Type': 'multipart/form-data'}}) 
    //是将对象 序列化成URL的形式，以&进行拼接   
    .then(response => {
        return response.data;
    })
    .catch(error => {
        return error.data
    })
}
export const deleteData = (url, params) => {
    return axios.delete(url, {params: params})
    .then(response => {
        return response.data;
    }).catch(error => {
        return error.data;
    })
}
export const putData = (url, params) => {
    return axios.put(url, params)
    .then(response => {
        return response.data;
    }).catch(error => {
        return error.data;
    })
}