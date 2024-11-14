import axiosService from "@/utils/request.js";  // 导入axiosService中创建的axios实例


//reset_password 模块


/** * post方法，对应post请求 * @param {String} url [请求的url地址] * @param {Object} params [请求时携带的参数] */
const reset_password = {
    
	//获取页面配置（如页面标题、页面关键词、页面描述、、网站log）
    getResetPasswordPageConfigData(params){
        
        return axiosService.post("data/reset_password/reset_password_page_config.json", params,{headers:{'Content-Type': 'application/json'}}) 
        //是将对象 序列化成URL的形式，以&进行拼接   
        .then(response => {
            //返回data对象数据中的data数据'data':{"code": 0,"data": [{}]"msg": "xxx"}
            return response.data;
        })
        .catch(error => {
            // console.log('api-error:',error)
            return error;
        })
    },    


    //去重置密码
goRetrievePassword(params){
    return axiosService.post("data/reset_password/reset_password.json", params,{headers:{'Content-Type': 'application/json'}}) 
    //是将对象 序列化成URL的形式，以&进行拼接   
    .then(response => {
        //返回data对象数据中的data数据'data':{"code": 0,"data": [{}]"msg": "xxx"}
        return response.data;
    })
    .catch(error => {
        // console.log('api-error:',error)
        return error;
    })
},


    
    // 其他接口…………
}


export default  reset_password;
