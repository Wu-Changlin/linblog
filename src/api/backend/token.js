import {axiosServiceRefreshToken} from "@/utils/request.js";  // 导入axiosServiceBackend中创建的axios实例
import { useUserStore } from '@/stores/useUserStore.js';//持久存储登录用户相关信息(昵称、令牌、刷新令牌)  会话级

//token 模块

// 如果在刷新，那就返回一个 promise，并且把它的 resolve 方法还有 config 加入到一个队列里。
// 1.1是否刷新中标志 ，记录是否正在刷新token，
let isRefreshing = false
// 1.2保存请求的promise对象
let promiseRT;

  //获取刷新AccessToken 访问令牌数据,提交token是刷新令牌useUserStore().getRefreshToken
async function getRefreshAccessToken(params) {
    if (isRefreshing) {
		return promiseRT
    }
    // 设置为正在刷新中标志
    isRefreshing = true;
// 刷新令牌
    let jwt_refresh_token=useUserStore().getRefreshToken;
    promiseRT = await 
    // axiosServiceBackend.post("backend/token/getRefreshAccessToken", params, { headers: { 'Content-Type': 'application/json' } })
    axiosServiceRefreshToken.post("data/backend/get_refresh_access_token_data.json", params, { headers: { 'Content-Type': 'application/json' } })
    .then(response => {
        //返回data对象数据中的data数据'data':{"code": 0,"data": [{}]"msg": "xxx"}
        // 刷新token成功，本地保存访问令牌
        let new_jwt_access_token= response.data.data.jwt_access_token;
        useUserStore().setToken(new_jwt_access_token, jwt_refresh_token)
        console.log('return response-----------'+ JSON.stringify(response))
        console.log('return refresh_access_token-----------'+new_jwt_access_token)
        return response.data;
    }).catch(error => {
        console.log('请求刷新AccessToken接口失败',error)

    })
    .finally(() => {
        // 请求完成后重置flag
        isRefreshing = false
    })
    
    return promiseRT;
}





export default getRefreshAccessToken;
