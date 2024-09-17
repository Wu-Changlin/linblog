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

            {
                path:'/test',
                name:"test",
                component:()=>import('@/views/frontend/test.vue'),//引入该路由使用的组件
            },
            
        
        
        ]
    },

    {
        path:'/article',
        name:"article",
        component:()=>import('@/views/frontend/article.vue'),
    },  
    
    {
        path:'/404', //添加一个指向404页面组件的路由
        // name:"404",
        component:()=>import('@/views/frontend/404.vue'),
        meta: { hidden: true } // 使用meta字段隐藏侧边栏或导航菜单中的链接（如果适用）
    }, 


    {
        //在路由列表的底部添加一个通配符路由，它会捕获所有未匹配到具体路由的URL，并将用户重定向到/404页面。
        path: '/:pathMatch(.*)', // 使用:pathMatch(.*)作为通配符
        redirect: '/404', // 重定向到404页面
        meta: { hidden: true } // 同样，隐藏这个路由
      },
      

]

const router =createRouter({
    history:createWebHistory(),//设置为history模式
    routes
})




export default router  //导出路由