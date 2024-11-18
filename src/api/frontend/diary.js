import {axiosServiceFrontend} from "@/utils/request.js";  // 导入axiosServiceFrontend中创建的axios实例


//admin 模块


/** * post方法，对应post请求 * @param {String} url [请求的url地址] * @param {Object} params [请求时携带的参数] */
const diary = {    
  //获取前端栏页数据（内容标签栏数据、轮播图数据、博文列表数据（瀑布流组件））  

  getDiaryPageData(params){
        return axiosServiceFrontend.post("data/frontend/diary.json", params,{headers:{'Content-Type': 'application/json'}}) 
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
     //获取把子页面选中的标签id和标签名称传到父页面或者点击归档页标签统计栏的标签（路由携参?tag_id=标签名称跳转和来自父页面的当前选中标签id）
getChildClickTag(params) {
    return axiosServiceFrontend.post("data/frontend/diary.json", params,{headers:{'Content-Type': 'application/json'}}) 
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
//根据触底获取选中标签下一页数据  
getActiveTagNextPageData(params) {
    return axiosServiceFrontend.post("data/frontend/active_tag_next_page_data.json", params,{headers:{'Content-Type': 'application/json'}}) 
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


export default  diary;
