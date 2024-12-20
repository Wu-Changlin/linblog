import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from '@/stores/useUserStore';//持久存储登录用户相关信息(昵称、令牌、刷新令牌)  会话级
import $message from "@/components/message/message.js";

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

        
            // {
            //     path:'auth_list',
            //     name:"auth_list",
            //     component:()=>import('@/views/backend/auth_mgr/auth_list.vue'),
            // },
            
            // {
            //     path:'role_list',
            //     name:"role_list",
            //     component:()=>import('@/views/backend/role_mgr/role_list.vue'),
            // },

            {
                path:'configuration_list',
                name:"configuration_list",
                component:()=>import('@/views/backend/configuration_mgr/configuration_list.vue'),
            },

            {
                path:'config_item',
                name:"config_item",
                component:()=>import('@/views/backend/configuration_mgr/config_item.vue'),
            },

            {
                path:'operation_log',
                name:"operation_log",
                component:()=>import('@/views/backend/operation_log_mgr/operation_log.vue'),
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
        path:'/admin/menu_add_edit',
        name:"menu_add_edit",
        component:()=>import('@/views/backend/menu_mgr/menu_add_edit.vue'),
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
    // {
    //     path:'/admin/auth_add_edit',
    //     name:"auth_add_edit",
    //     component:()=>import('@/views/backend/auth_mgr/auth_add_edit.vue'),
    // },
    // {
    //     path:'/admin/role_add_edit',
    //     name:"role_add_edit",
    //     component:()=>import('@/views/backend/role_mgr/role_add_edit.vue'),
    // },
    {
        path:'/admin/configuration_add_edit',
        name:"configuration_add_edit",
        component:()=>import('@/views/backend/configuration_mgr/configuration_add_edit.vue'),
    },


    // 博文详情页

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


// 搜索页
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

    // 登录页

    {
        path: '/login',//路径
        name: "login",//路由名称
        component: () => import('@/views/login.vue'),//引入该路由使用的组件
    },

    
    // 获取重置密码邮件
    {
        path: '/send_reset_password_email',//路径
        name: "send_reset_password_email",//路由名称
        component: () => import('@/views/send_reset_password_email.vue'),//引入该路由使用的组件
    },
   
     // 重置密码
     {
        path: '/reset_password',//路径
        name: "reset_password",//路由名称
        component: () => import('@/views/reset_password.vue'),//引入该路由使用的组件
        beforeEnter: (to, from, next) => {//使用Vue Router的前置守卫（beforeEach）来检查路由并重定向到404页面。
            if (!to.query.temporary_token || to.path === '/reset_password/') {//当用户尝试访问/reset_password且没有查询参数id或者路由地址确实是/article/时，会被重定向到/404路由。
                next('/404');
            } else {
                next();
            }
        }
    },


    

    
    // 校验邮箱验证码 
    {
        path: '/verification',//路径
        name: "verification",//路由名称
        component: () => import('@/views/verification.vue'),//引入该路由使用的组件
        beforeEnter: (to, from, next) => {//使用Vue Router的前置守卫（beforeEach）来检查路由并重定向到404页面。
            if (!to.query.temporary_token || to.path === '/verification/') {//当用户尝试访问/reset_password且没有查询参数id或者路由地址确实是/article/时，会被重定向到/404路由。
                next('/404');
            } else {
                next();
            }
        }
    },

    // 404页面
    {
        path: '/404', //添加一个指向404页面组件的路由
        // name:"404",
        component: () => import('@/views/404.vue'),
        meta: { hidden: true } // 使用meta字段隐藏侧边栏或导航菜单中的链接（如果适用）
    },


    {
        path: '/test',
        name: "test",
        component: () => import('@/views/test.vue'),//引入该路由使用的组件
    },

//在路由列表的底部添加一个通配符路由，它会捕获所有未匹配到具体路由的URL，并将用户重定向到/404页面。
    {
        path: '/:pathMatch(.*)', // 使用:pathMatch(.*)作为通配符
        redirect: '/404', // 重定向到404页面
        meta: { hidden: true } // 同样，隐藏这个路由
    }

]
const router = createRouter({
    history: createWebHistory(),//设置为history模式
    routes
})

// 路由地址包含admin字符串需要有访问令牌才可访问
const path_contains_admin_string='admin';
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

    // 因为路由器是在其被安装之后开始导航的，而此时 Pinia 也已经被安装; 访问令牌
    const jwt_access_token = useUserStore().getUserAccessToken;

    // 路由地址包含admin字符串且没有jwt_access_token
    if(to.path.includes(path_contains_admin_string) && !jwt_access_token){
        // 如果用户没有token，并且访问的页面需要token，则阻止进入页面
        $message('请先登录！','warning');
        next('/login'); // 重定向到登录页面
        return; // 停止执行
    }

// 继续导航
    next();

});

export default router  //导出路由