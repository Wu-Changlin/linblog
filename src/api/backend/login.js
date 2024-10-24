import axiosService from "@/utils/request.js";  // 导入axiosService中创建的axios实例


//admin 模块


/** * post方法，对应post请求 * @param {String} url [请求的url地址] * @param {Object} params [请求时携带的参数] */
const admin = {    
//获取log和菜单导航栏   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
getAdminOrMenuListData(params){
        return axiosService.post("/data/backend/admin.json", params,{headers:{'Content-Type': 'application/json'}}) 
        //是将对象 序列化成URL的形式，以&进行拼接   
        .then(response => {
            //返回data对象数据中的data数据'data':{"code": 0,"data": [{}]"msg": "xxx"}
            return response.data;
        })
        .catch(error => {
            // console.log('api-error:',error)
            return error;
        })
    }
    // 其他接口…………
}


export default  admin;
