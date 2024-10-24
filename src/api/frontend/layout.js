import axiosService from "@/utils/request.js";  // 导入axiosService中创建的axios实例


//layout 模块


/** * post方法，对应post请求 * @param {String} url [请求的url地址] * @param {Object} params [请求时携带的参数] */
const layout = {    
//获取搜索关键字匹配所用数据源  提供一个获取数据的方法
getSearchKeywordMatchArticleListDataFunction(params){
        return axiosService.post("/data/frontend/all_article.json", params,{headers:{'Content-Type': 'application/json'}}) 
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

    getLayoutLogOrMenuListData(params){

        return axiosService.post("/data/frontend/layout.json", params,{headers:{'Content-Type': 'application/json'}}) 
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


export default  layout;
