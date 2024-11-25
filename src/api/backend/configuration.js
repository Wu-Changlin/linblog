import {axiosServiceBackend} from "@/utils/request.js";  // 导入axiosServiceBackend中创建的axios实例

//configuration 模块


/** * post方法，对应post请求 * @param {String} url [请求的url地址] * @param {Object} params [请求时携带的参数] */
const configuration = {
    // 获取list页面框架数据
    getPageLayoutData(params) {
        return axiosServiceBackend.post("data/backend/configuration_page_layout_data.json", params, { headers: { 'Content-Type': 'application/json' } })
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
    getConfigurationListPageData(params) {
        return axiosServiceBackend.post("data/backend/configuration_list.json", params, { headers: { 'Content-Type': 'application/json' } })
            //是将对象 序列化成URL的形式，以&进行拼接   
            .then(response => {
                // 返回data对象数据中的data数据'data':{"code": 0,"data": [{}]"msg": "xxx"}
                return response.data;
            })
            .catch(error => {
                // console.log('api-error:',error)
throw error; // 重新抛出错误，让外部处理
            })
    },

    // 获取查询数据
    queryInputData(params) {
        return axiosServiceBackend.post("data/backend/configuration_list.json", params, { headers: { 'Content-Type': 'application/json' } })
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
        return axiosServiceBackend.post("data/backend/configuration_list.json", params, { headers: { 'Content-Type': 'application/json' } })
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
clickSubmitAddAndEditData(params) {
        return axiosServiceBackend.post("data/backend/edit_configuration_data.json", params, { headers: { 'Content-Type': 'application/json' } })
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
        return axiosServiceBackend.post("data/backend/edit_configuration_data.json", params, { headers: { 'Content-Type': 'application/json' } })
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


       //获取配置项的数据
    getConfigItemData(params) {
        return axiosServiceBackend.post("data/backend/config_item_data.json", params, { headers: { 'Content-Type': 'application/json' } })
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

 //批量修改配置项的数据
    batchEditConfigItem(params){
        return axiosServiceBackend.post("data/backend/config_item_data.json", params, { headers: { 'Content-Type': 'application/json' } })
        //是将对象 序列化成URL的形式，以&进行拼接   
        .then(response => {
            //返回data对象数据中的data数据'data':{"code": 0,"data": [{}]"msg": "xxx"}
            return response.data;
        })
        .catch(error => {
            // console.log('api-error:',error)
throw error; // 重新抛出错误，让外部处理
        })

    }

    






    // 其他接口…………
}


export default configuration;
