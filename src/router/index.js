import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: '/',//路径
        name: "layout",//路由名称
        component: () => import('@/views/layout.vue'),//引入该路由使用的组件
        redirect: "/index",
        children: [
            {
                path: '/index',
                name: "index",
                component: () => import('@/views/frontend/index.vue'),//引入该路由使用的组件

            },

            {
                path: '/frontend',
                name: "frontend",
                component: () => import('@/views/frontend/frontend.vue')
            },

            {
                path: '/backend',
                name: "backend",
                component: () => import('@/views/frontend/backend.vue')
            },

            {
                path: '/resource',
                name: "resource",
                component: () => import('@/views/frontend/resource.vue')
            },

            {
                path: '/archives',
                name: "archives",
                component: () => import('@/views/frontend/archives.vue')
            },

            {
                path: '/diary',
                name: "diary",
                component: () => import('@/views/frontend/diary.vue')
            },



            {
                path: '/test',
                name: "test",
                component: () => import('@/views/frontend/test.vue'),//引入该路由使用的组件
            }



        ]
    },


    {
        path:'/admin',
        name:"admin",
        component:()=>import('@/views/backend/admin.vue'),
        redirect:"/admin/home",
        children:[
            {
                path:'home',
                name:"home",
                component:()=>import('@/views/backend/home/home.vue'),
            },

            {
                path:'user_list',
                name:"user_list",
                component:()=>import('@/views/backend/user_mgr/user_list.vue'),
            },
           
            {
                path:'article_list',
                name:"article_list",
                component:()=>import('@/views/backend/article_mgr/article_list.vue'),
            }, 
            {
                path:'tag_list',
                name:"tag_list",
                component:()=>import('@/views/backend/tag_mgr/tag_list.vue'),
            },
            
            {
                path:'image_list',
                name:"image_list",
                component:()=>import('@/views/backend/image_mgr/image_list.vue'),
            },
           
            {
                path:'menu_list',
                name:"menu_list",
                component:()=>import('@/views/backend/menu_mgr/menu_list.vue'),
            },

            {
                path:'/menu_add_edit',
                name:"menu_add_edit",
                component:()=>import('@/views/backend/menu_mgr/menu_add_edit.vue'),
            },
            {
                path:'auth_list',
                name:"auth_list",
                component:()=>import('@/views/backend/auth_mgr/auth_list.vue'),
            },
            
            {
                path:'role_list',
                name:"role_list",
                component:()=>import('@/views/backend/role_mgr/role_list.vue'),
            },

           

            {
                path:'configuration_list',
                name:"configuration_list",
                component:()=>import('@/views/backend/configuration_mgr/configuration_list.vue'),
            },

          
        
            
           

           
        ]
    },


    {
        path:'/admin/user_add_edit',
        name:"user_add_edit",
        component:()=>import('@/views/backend/user_mgr/user_add_edit.vue'),
    },
    {
        path:'/admin/article_add_edit',
        name:"article_add_edit",
        component:()=>import('@/views/backend/article_mgr/article_add_edit.vue'),
    },
    {
        path:'/admin/tag_add_edit',
        name:"tag_add_edit",
        component:()=>import('@/views/backend/tag_mgr/tag_add_edit.vue'),
    },

    {
        path:'/admin/image_add_edit',
        name:"image_add_edit",
        component:()=>import('@/views/backend/image_mgr/image_add_edit.vue'),
    },
    {
        path:'/admin/auth_add_edit',
        name:"auth_add_edit",
        component:()=>import('@/views/backend/auth_mgr/auth_add_edit.vue'),
    },
    {
        path:'/admin/role_add_edit',
        name:"role_add_edit",
        component:()=>import('@/views/backend/role_mgr/role_add_edit.vue'),
    },
    {
        path:'/admin/configuration_add_edit',
        name:"configuration_add_edit",
        component:()=>import('@/views/backend/configuration_mgr/configuration_add_edit.vue'),
    },



    {
        path: '/article',
        name: "article",
        component: () => import('@/views/frontend/article.vue'),
        beforeEnter: (to, from, next) => {//使用Vue Router的前置守卫（beforeEach）来检查路由并重定向到404页面。
            if (!to.query.id || to.path === '/article/') {//当用户尝试访问/article且没有查询参数id或者路由地址确实是/article/时，会被重定向到/404路由。
                next('/404');
            } else {
                next();
            }
        }
    },

    {
        path: '/search',
        name: "search",
        component: () => import('@/views/frontend/search.vue'),
        beforeEnter: (to, from, next) => {//使用Vue Router的前置守卫（beforeEach）来检查路由并重定向到404页面。
            if (!to.query.keyword || to.path === '/search/') {//当用户尝试访问/search且没有查询参数keyword或者路由地址确实是/search/时，会被重定向到/404路由。
                next('/404');
            } else {
                next();
            }
        }
    },


    {
        path: '/login',//路径
        name: "login",//路由名称
        component: () => import('@/views/login.vue'),//引入该路由使用的组件
    },

    {
        path: '/404', //添加一个指向404页面组件的路由
        // name:"404",
        component: () => import('@/views/frontend/404.vue'),
        meta: { hidden: true } // 使用meta字段隐藏侧边栏或导航菜单中的链接（如果适用）
    },




    {
        //在路由列表的底部添加一个通配符路由，它会捕获所有未匹配到具体路由的URL，并将用户重定向到/404页面。
        path: '/:pathMatch(.*)', // 使用:pathMatch(.*)作为通配符
        redirect: '/404', // 重定向到404页面
        meta: { hidden: true } // 同样，隐藏这个路由
    }




]

const router = createRouter({
    history: createWebHistory(),//设置为history模式
    routes
})







//滚动class_name
const class_name = { index: '.feeds-page', frontend: '.feeds-page', backend: '.feeds-page', resource: '.feeds-page', archives: '.feeds-page', diary: '.feeds-page' }

router.beforeEach((to, from, next) => {
    //导航守卫逻辑  如果目的路由等于来源路由，那么滚动条置顶。
    //    路由切换实际是组件间的切换，引用相同组件的时候，页面就无法更新。
    //    页面就无法更新导致滚动条位置没变。上一个标签页滚动到底部路由切换后下一个页面滚动条位置没变在底部。
    if (to.path === from.path) {
        let scrollElem = document.querySelector(class_name[to.name]);
        if (scrollElem) {
            scrollElem.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    next();

});

export default router  //导出路由