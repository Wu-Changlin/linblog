import {axiosServiceBackend} from "@/utils/request.js";  // 导入axiosServiceBackend中创建的axios实例


//login 模块


/** * post方法，对应post请求 * @param {String} url [请求的url地址] * @param {Object} params [请求时携带的参数] */
const login = {
    
	//获取页面配置（如页面标题、页面关键词、页面描述、网站log）
    getLoginPageData(params){
//是将对象 序列化成URL的形式，以&进行拼接  
        // return axiosServiceBackend.post("login/login/getLoginPageData", params,{headers:{'Content-Type': 'application/json'}}) 
        return axiosServiceBackend.post("data/login/login_page_data.json", params,{headers:{'Content-Type': 'application/json'}}) 
        .then(response => {
            //返回data对象数据中的data数据'data':{"code": 0,"data": [{}]"msg": "xxx"}
            return response.data;
        })
        .catch(error => {
            // console.log('api-error:',error)
throw error; // 重新抛出错误，让外部处理
        })
    }, 

    
     //获取验证码
    getVerificationCode(params){
        // return axiosServiceBackend.post("login/login/getVerificationCode", params,{headers:{'Content-Type': 'application/json'}}) 
    
        return axiosServiceBackend.post("data/login/login_page_data.json", params,{headers:{'Content-Type': 'application/json'}}) 
            //是将对象 序列化成URL的形式，以&进行拼接   
            .then(response => {
                //返回data对象数据中的data数据'data':{"code": 0,"data": [{}]"msg": "xxx"}
                return response.data;
            })
            .catch(error => {
                // console.log('api-error:',error)
    throw error; // 重新抛出错误，让外部处理
            })
        },
    
 
 //去验证登录账号
    goVerifyLoginAccount(params){
        return axiosServiceBackend.post("data/login/verify_login_account.json", params,{headers:{'Content-Type': 'application/json'}}) 
        //是将对象 序列化成URL的形式，以&进行拼接   
        .then(response => {
            //返回data对象数据中的data数据'data':{"code": 0,"data": [{}]"msg": "xxx"}
            return response.data;
        })
        .catch(error => {
            // console.log('api-error:',error)
throw error; // 重新抛出错误，让外部处理
        })
    },
    
 //去登录
goLogin(params){
    // return axiosServiceBackend.post("login/login/goLogin", params,{headers:{'Content-Type': 'application/json'}}) 

    return axiosServiceBackend.post("data/login/user_login.json", params,{headers:{'Content-Type': 'application/json'}}) 
        //是将对象 序列化成URL的形式，以&进行拼接   
        .then(response => {
            //返回data对象数据中的data数据'data':{"code": 0,"data": [{}]"msg": "xxx"}
            return response.data;
        })
        .catch(error => {
            // console.log('api-error:',error)
throw error; // 重新抛出错误，让外部处理
        })
    },


    


    
    // 其他接口…………
}


export default  login;
