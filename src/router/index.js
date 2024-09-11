import { createRouter,createWebHistory } from "vue-router";

const routes=[
    {
        path:'/',//路径
        name:"layout",//路由名称
        component:()=>import('@/views/layout.vue'),//引入该路由使用的组件
        redirect: "/index",
        children: [   
            {
                path:'/index',
                name:"index",
                component:()=>import('@/views/frontend/index.vue'),//引入该路由使用的组件
            },

            {
                path:'/frontend',
                name:"frontend",
                component:()=>import('@/views/frontend/frontend.vue')
            },
        
            {
                path:'/backend',
                name:"backend",
                component:()=>import('@/views/frontend/backend.vue')
            },
        
            {
                path:'/resource',
                name:"resource",
                component:()=>import('@/views/frontend/resource.vue')
            },
        
            {
                path:'/archives',
                name:"archives",
                component:()=>import('@/views/frontend/archives.vue')
            },
            
            {
                path:'/diary',
                name:"diary",
                component:()=>import('@/views/frontend/diary.vue')
            },

            {
                path:'/search',
                name:"search",
                component:()=>import('@/views/frontend/search.vue')
            },
            
        
        
        ]
    },

    {
        path:'/article',
        name:"article",
        component:()=>import('@/views/frontend/article.vue')
    },    
]

const router =createRouter({
    history:createWebHistory(),//设置为history模式
    routes
})

export default router  //导出路由