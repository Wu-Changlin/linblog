import {axiosServiceBackend} from "@/utils/request.js";  // 导入axiosServiceBackend中创建的axios实例


//user 模块


/** * post方法，对应post请求 * @param {String} url [请求的url地址] * @param {Object} params [请求时携带的参数] */
const user = {
    // 获取list页面框架数据
    getPageLayoutData(params) {
        return axiosServiceBackend.post("data/backend/user_page_layout_data.json", params, { headers: { 'Content-Type': 'application/json' } })
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
    //获取表格数据
    getUserListPageData(params) {
        return axiosServiceBackend.post("data/backend/user_list.json", params, { headers: { 'Content-Type': 'application/json' } })
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

    // 获取查询数据
    queryInputData(params) {
        return axiosServiceBackend.post("data/backend/user_query_data.json", params, { headers: { 'Content-Type': 'application/json' } })
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
    // 分页数据
    getChildPaginationChangeData(params) {
        return axiosServiceBackend.post("data/backend/user_list.json", params, { headers: { 'Content-Type': 'application/json' } })
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


// 提交添加或编辑数据
clickSubmitAddOrEditData(params) {
        return axiosServiceBackend.post("data/backend/edit_user_data.json", params, { headers: { 'Content-Type': 'application/json' } })
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


      //获取编辑id的数据
    getEditCurrentIdData(params) {
        return axiosServiceBackend.post("data/backend/edit_user_data.json", params, { headers: { 'Content-Type': 'application/json' } })
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

export default user;
