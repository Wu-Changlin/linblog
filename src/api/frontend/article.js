import {axiosServiceFrontend} from "@/utils/request.js";  // 导入axiosServiceFrontend中创建的axios实例


//article 模块


/** * post方法，对应post请求 * @param {String} url [请求的url地址] * @param {Object} params [请求时携带的参数] */
const article = {    
  //获取博文详情数据
getArticlePageData(params) {
        return axiosServiceFrontend.post("data/frontend/article_detail.json", params,{headers:{'Content-Type': 'application/json'}}) 
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


export default  article;
