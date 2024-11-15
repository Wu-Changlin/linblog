import { defineStore } from 'pinia'
// import { refreshToken } from '../api/user'


export const useUserStore = defineStore('user', {
    persist: {
        enabled: true, //开启数据持久化
        strategies: [
            {
                key: "userState", //给一个要保存的名称
                storage: localStorage, //sessionStorage / localStorage 存储方式
            },
        ],
    },
    state: () => ({
        isLoggedIn: false,//已登陆
        nickName: '',       //昵称
        jwtAccessToken: null,//令牌
        jwtRefreshToken: null,//刷新令牌
    }),
    actions: {
        login(nickName, accessToken,refreshToken) {
            this.nickName = nickName
            this.isLoggedIn = true
            this.setToken(accessToken, refreshToken)
        },
        logout() {
            this.nickName = ''
            this.jwtAccessToken = null
            this.jwtRefreshToken = null
            this.isLoggedIn = false
        },
        setToken(accessToken, refreshToken) {
            this.jwtAccessToken = accessToken
            this.jwtRefreshToken = refreshToken
        },
        // refreshToken() {
        //     return new Promise((resolve, reject) => {
        //         refreshToken({"refresh":this.jwtRefreshToken}).then((response) => {
        //             this.setToken(response.access, this.jwtRefreshToken)
        //             resolve(response.access)
        //             console.log('return refreshToken-----------'+response.access)
        //         }).catch((error) => {
        //             reject(error)
        //         })
        //     })
        // }

    },
    getters: {
        getIsLoggedIn: (state) => state.isLoggedIn,
        getNickName: (state) => state.nickName,
        getUserAccessToken: (state) => state.jwtAccessToken,
        getRefreshToken: (state) => state.jwtRefreshToken,
    }
})
