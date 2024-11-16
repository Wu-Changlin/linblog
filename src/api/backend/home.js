import {axiosServiceBackend} from "@/utils/request.js";  // 导入axiosServiceBackend中创建的axios实例

//home 模块


/** * post方法，对应post请求 * @param {String} url [请求的url地址] * @param {Object} params [请求时携带的参数] */
const home = {    
  //获取归档页网站统计栏、标签统计栏、贡献统计栏数据
getHomePageData(params) {
        return axiosServiceBackend.post("data/backend/home.json", params,{headers:{'Content-Type': 'application/json'}}) 
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

      //获取点击年份的贡献数据（获取年贡献信息）
    getClickYearContributionData(url,params) {
        if(!url){
            url='data/frontend/contribution_year_2024.json'
        }
        return axiosServiceBackend.post(url, params,{headers:{'Content-Type': 'application/json'}}) 
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

      //获取选中日期贡献信息（由contribution_calendar子组件发到父组件的点击贡献图某日数据）
    clickContributionDay(params) {
    
        return axiosServiceBackend.post('data/frontend/click_contribution_day.json', params,{headers:{'Content-Type': 'application/json'}}) 
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


export default  home;
