import {axiosServiceFrontend} from "@/utils/request.js";  // 导入axiosServiceFrontend中创建的axios实例


//search 模块


/** * post方法，对应post请求 * @param {String} url [请求的url地址] * @param {Object} params [请求时携带的参数] */
const search = {    
    //获取搜索关键字匹配结果   总页数>=当前页数 ，模拟时总页数没有axios赋值，随机数赋值
getSearchKeywordMatchData(params){
        return axiosServiceFrontend.post("data/frontend/search_keyword.json", params,{headers:{'Content-Type': 'application/json'}}) 
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


     //根据触底数据判断获取搜索关键字匹配结果下一页
    getSearchKeywordMatchNextPageData(params){
        return axiosServiceFrontend.post("data/frontend/search_keyword.json", params,{headers:{'Content-Type': 'application/json'}}) 
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


export default  search;
