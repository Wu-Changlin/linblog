import axiosService from "@/utils/request.js";  // 导入axiosService中创建的axios实例


//admin 模块


/** * post方法，对应post请求 * @param {String} url [请求的url地址] * @param {Object} params [请求时携带的参数] */
const index = {    
//获取首页数据（内容标签栏数据、博文列表数据（瀑布流组件））  
getIndexPageData(params){
        return axiosService.post("data/frontend/index.json", params,{headers:{'Content-Type': 'application/json'}}) 
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
  //获取子页面选中的标签id数据 
  // NOTE:　首页的标签数据仅展示一页（没有上拉加载更多），目的：显示页面底部备案信息。 
    getChildClickTag(params){
        return axiosService.post("data/frontend/index.json", params,{headers:{'Content-Type': 'application/json'}}) 
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


export default  index;
