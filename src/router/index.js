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
                path:'/test',
                name:"test",
                component:()=>import('@/views/frontend/test.vue'),//引入该路由使用的组件
            }
            
        
        
        ]
    },

    {
        path:'/article',
        name:"article",
        component:()=>import('@/views/frontend/article.vue'),
        beforeEnter: (to, from, next) => {//使用Vue Router的前置守卫（beforeEach）来检查路由并重定向到404页面。
            if (!to.query.id || to.path === '/article/') {//当用户尝试访问/article且没有查询参数id或者路由地址确实是/article/时，会被重定向到/404路由。
              next('/404');
            } else {
              next();
            }
        }
    }, 
    
    {
        path:'/search',
        name:"search",
        component:()=>import('@/views/frontend/search.vue'),
        beforeEnter: (to, from, next) => {//使用Vue Router的前置守卫（beforeEach）来检查路由并重定向到404页面。
            if (!to.query.keyword || to.path === '/search/') {//当用户尝试访问/search且没有查询参数keyword或者路由地址确实是/search/时，会被重定向到/404路由。
              next('/404');
            } else {
              next();
            }
        }
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
      }

      
      

]

const router =createRouter({
    history:createWebHistory(),//设置为history模式
    routes
})



router.beforeEach((to, from, next) => {
    // 你的导航守卫逻辑  如果目的路由等于来源路由且目的路由是'/index'，那么滚动条置顶。
    //路由切换实际是组件间的切换，引用相同组件的时候，页面就无法更新。
    //页面就无法更新导致滚动条位置没变。上一个标签页滚动到底部路由切换后下一个页面滚动条位置没变在底部。
    if (to.path===from.path && to.path==='/index') {
        let layoutPageScrollElem = document.querySelector('.feeds-page');
        if(layoutPageScrollElem){
            // console.log('layoutPageScrollElem:',layoutPageScrollElem.offsetTop)
            layoutPageScrollElem.scrollTo({ top:0, behavior: 'smooth' });
         }
    //   next('/404'); // 重定向到404页面
    } else {
      next(); // 继续正常的导航
    }
  });

export default router  //导出路由