<template>

    <div class="container">
        <BackendNavBar :parentPageLogData="admin_page_log"></BackendNavBar>
        <div class="main">
            <BackendSideBar v-if="flag" :parentPageMenuData="admin_page_menu_list_data"></BackendSideBar>

            <div ref="mainContentRef" class="main-content with-side-bar"
                :style="{marginLeft: is_collapse_side_menu ? '82px !important' : '', paddingLeft: is_collapse_side_menu ? '10px !important' : ''}">
                <!-- <BackendContentTabs></BackendContentTabs> -->
                
                <router-view />

            </div>

        </div>
    </div>

</template>






<script setup>
    import { reactive, ref, onMounted, onUnmounted, provide, inject } from 'vue';
    import { useRoute,useRouter } from "vue-router";
    import BackendNavBar from "@/components/backend/backend_nav_bar.vue";
    import BackendSideBar from "@/components/backend/backend_side_bar.vue";
    import Footer from "@/components/footer.vue";
    import adminModuleApi from "@/api/backend/admin.js";//api接口
    import { debounce, throttle } from '@/hooks/debounceOrThrottle.js';//防抖、节流
    import useMetaInfo from '@/hooks/useMetaInfo.js';//设置页面meta元数据，标题、关键词、描述 
    import { useUserStore } from '@/stores/useUserStore.js';//临时存储登录用户相关信息(昵称、令牌、刷新令牌)  会话级

    let jwtRefreshToken=useUserStore().getNickName;
    console.log('jwtRefreshToken:',jwtRefreshToken);
    const router = useRouter();
    const route = useRoute();

    const $message = inject('$message');



    const flag = ref(false)
    const admin_page_log = ref();
    const admin_page_menu_list_data = ref();
    const tabs_list_data = ref({});

    const mainContentRef=ref(null)

    // 设置后台首页为默认页
    tabs_list_data.value = {
        "首页": "/admin/home"
    }
    //获取log和菜单导航栏   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
    function getAdminOrMenuListData() {
        const data = adminModuleApi.getAdminOrMenuListData({});
        adminModuleApi.getAdminOrMenuListData({})
            .then(response => {
                admin_page_log.value = response.log_data; // log
                admin_page_menu_list_data.value = response.menu_data; // 菜单数据
                flag.value = true;
            })
    }


    /* 修改当前侧边栏菜单折叠或展开 开始*/

    const is_collapse_side_menu = ref(false);
    // 提供数据
    provide('isCollapseSideMenu', is_collapse_side_menu);

    // 修改当前侧边栏菜单折叠或展开的方法
    function updateIsCollapseSideMenuFunction(new_state) {
        is_collapse_side_menu.value = new_state;

        // 折叠状态需减除is_collapse_side_menu的宽度
        let main_content_width='100%';
        if(new_state){
            main_content_width = `calc(100% - 82px)`;
        }
        mainContentRef.value.style.width = main_content_width;
    }

    // 暴露方法(修改当前侧边栏菜单折叠或展开的方法)供子组件调用
    provide('updateIsCollapseSideMenuFunction', updateIsCollapseSideMenuFunction);

    //监听窗口响应式设置折叠菜单
    function settingCollapseSideMenu() {
        let page_width = window.innerWidth;
        if (page_width <= 965) {//页面宽度小于965px开启折叠模式
            updateIsCollapseSideMenuFunction(true);
        
        }

    }

    /*修改当前侧边栏菜单折叠或展开 结束*/

    /*修改当前选中标签id 开始*/

    const current_active_tag_id = ref(0);
    // 提供数据
    provide('currentActiveTagId', current_active_tag_id);

    // 修改当前选中标签id的方法
    function updateCurrentActiveTagIdFunction(new_active_tag_id) {
        current_active_tag_id.value = new_active_tag_id;
    }

    // 暴露方法(修改当前选中标签id的方法)供子组件调用
    provide('updateCurrentActiveTagIdFunction', updateCurrentActiveTagIdFunction);

    /* 修改当前选中标签id 结束*/


    /*修改当前页面meta元数据，标题、关键词、描述  开始*/

    // meta元数据，标题、关键词、描述 
    const current_meta_title = ref('');
    const current_meta_keywords = ref('');
    const current_meta_description = ref('');

    // 调用封装函数使用@unhead/vue的useHead修改页面meta元数据
    useMetaInfo(current_meta_title, current_meta_keywords, current_meta_description);

    // 提供数据
    provide('current_meta_title', current_meta_title);
    provide('current_meta_keywords', current_meta_keywords);
    provide('current_meta_description', current_meta_description);



    // 修改当前页面meta元数据，标题、关键词、描述的方法。接收子路由页面的新值 
    function updateCurrentMetaInfoFunction(new_current_meta_info) {
        current_meta_title.value = new_current_meta_info.meta_title;
        current_meta_keywords.value = new_current_meta_info.meta_keywords;
        current_meta_description.value = new_current_meta_info.meta_description;
        // console.log(`updateCurrentMetaInfoFunction:meta_title=${meta_title},meta_keywords=${meta_keywords},meta_description=${meta_description}`)
    }

    // 暴露方法(修改当前页面meta元数据，标题、关键词、描述的方法 )供子组件调用
    provide('updateCurrentMetaInfoFunction', updateCurrentMetaInfoFunction);

    /* 修改当前页面meta元数据，标题、关键词、描述  结束*/



    /* 操作Tabs标签页tag  开始*/
    // Tabs 标签页添加tag 
    function addTagToTabs(new_tag) {
        tabs_list_data.value = addPropertyIfNotExists(tabs_list_data.value, new_tag.propName, new_tag.value);

        // console.log('tabs_list_data:',tabs_list_data.value);
    }



    // Tabs 标签页关闭tag 
    function closeTag(close_menu_title) {
        // 获取删除指定属性后对象是否只剩一个属性。布尔值
        let only_one_property_result= hasOnlyOneProperty(tabs_list_data.value, close_menu_title);
        if(only_one_property_result){
            const tabs_list_data_to_array = Object.values(tabs_list_data.value);
            
            // 使用解构赋值获取数组的第一个元素
            const [firstElement] = tabs_list_data_to_array;
            console.log('firstElement:',firstElement);
            router.push({ path:firstElement })
        }else{
            //激活选项卡,跳转到临近页面。
            activeTag(close_menu_title)
        }
        // 对象属性删除：Reflect.deleteProperty(对象，属性名)，返回一个布尔值
        let delete_result = Reflect.deleteProperty(tabs_list_data.value, close_menu_title);
        if (delete_result) {
            let msg = '成功关闭' + close_menu_title;
            $message(msg, 'success')
        }
        console.log('closeTag:tabs_list_data:',tabs_list_data.value);

    }

        // 暴露方法(Tabs 标签页添加tag的方法 )供子组件调用
        provide('addTagToTabs', addTagToTabs);

// 暴露方法(Tabs 标签页关闭tag的方法 )供子组件调用
provide('closeTag', closeTag);
// 提供tabs_list_data数据到子组件
provide('tabs_list_data', tabs_list_data);


/* 操作Tabs标签页tag  结束*/


//执行关闭tag，操作当前激活的选项卡（当前所在的路由） 跳转到临近页面，
    function activeTag(close_menu_title) {
        let close_tag_path = tabs_list_data.value[close_menu_title];//删除路由
        let active_path='';//跳转活跃地址
        let current_path = route.path; //当前路由

        //如果当前的路由是要删除的页面
        if (current_path === close_tag_path) {
            const tabs_list_data_to_array = Object.values(tabs_list_data.value);
            tabs_list_data_to_array.forEach((tab, index) => {
                if (tab === current_path) {
                    
                    const nextTab = tabs_list_data_to_array[index + 1] || tabs_list_data_to_array[index - 1]  //如果在中间的tab，删除会选择在后面的一个；如果在最后，会选择在前面的一个tab
                    if (nextTab) {
                        active_path = nextTab  //更换当前路由的地址
                    }
                    // console.log('tab:', tab, ',current_path', current_path,',nextTab:',active_path);
                }
            })
        }else{ //如果当前的路由非删除的页面
            active_path=current_path;
            // console.log('active_path=current_path:',active_path)
        }
    
    
    
        //跳转路由
        router.push({ path: active_path })
    }


    /**
     * 使用Map对象来检查对象中是否存在特定的属性名，并据此决定是否添加新属性。以下是一个简单的函数，
     *  它接受一个对象和要添加的属性名以及值，如果属性名不存在，则添加它
     *
     * @description: addPropertyIfNotExists函数首先检查propName是否存在于obj对象的键中。
     * 如果不存在，它就添加这个属性并赋予它value值。如果属性名已经存在，它什么都不做。
     * @param {*} obj        对象
     * @param {*} propName   属性名
     * @param {*} value      值
     * @return {*}
     */
    function addPropertyIfNotExists(obj, propName, value) {

        if (!Object.keys(obj).includes(propName)) {
            const prop_name_to_str = String(propName);

            const new_tags_obj = {};
            new_tags_obj[prop_name_to_str] = value;

            let new_obj = Object.assign(obj, new_tags_obj);
            return new_obj;
        } else {
            return obj;
        }

    }


    
/**
 * hasOnlyOneProperty函数接受一个对象和要忽略的属性名称，然后返回一个布尔值，表示在删除指定属性后对象是否只剩一个属性
 * @description: 检查对象是否只剩下一个属性，可以通过Object.keys()方法获取对象的所有键，然后检查数组的长度。
 * @param {*} obj                   对象
 * @param {*} propertyToIgnore      属性名
 * @return {*}
 */
function hasOnlyOneProperty(obj, propertyToIgnore) {
    // 使用 Object.keys 获取对象的所有属性，并过滤掉要忽略的属性
    const keys = Object.keys(obj).filter(key => key !== propertyToIgnore);

    // 检查是否只剩一个属性
    if(keys.length === 1){
        console.log('keys.length:',keys.length)
        return true;
    }
    return false;
}




    // provide('updateCurrentMetaInfoFunction', updateCurrentMetaInfoFunction);


    /* Tabs 标签页添加tag  结束*/

    /* 修改当前页面meta元数据，标题、关键词、描述  结束*/

    onMounted(() => {
        //获取log和菜单导航栏（外加搜索匹配关键字数据）   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
        getAdminOrMenuListData();
        //监听窗口响应式设置折叠菜单
        window.addEventListener('resize', throttle(() => { settingCollapseSideMenu() }, 100));//监听窗口缩放 加节流

    });

    onUnmounted(() => {
        //离开页面时移除监监听窗口响应式设置折叠菜单
        window.removeEventListener('resize', settingCollapseSideMenu);

    })




</script>

<style scoped>
    * {
        /*启用滚动功能 */
        padding: 0;
        margin: 0;
        -ms-overflow-style: none;
        /* 适用于 Internet Explorer 和旧版 Edge */
        scrollbar-width: none;
        /* 适用于 Firefox */
        -webkit-scrollbar: none;
        /* WebKit 内核浏览器（如 Chrome 和 Safari）中的滚动条*/
    }

    .container {
        padding: 0;
        max-width: 1728px;
        background-color: var(--bg);
        margin: 0 auto;

        .main {
            display: flex;

            .main-content {
                width: 100%;
            }

            .main-content {
                @media screen and (min-width: 960px) and (max-width: 1191px) {
                    padding-left: calc(-6px + 25vw);

                }

                @media screen and (min-width: 1192px) and (max-width: 1423px) {
                    padding-left: calc(-4.8px + 20vw);
                }

                @media screen and (min-width: 1424px) and (max-width: 1727px) {
                    padding-left: calc(-5.33333px + 16.66667vw);
                }

                @media screen and (min-width: 1728px) {
                    padding-left: 282.66667px;
                }
            }


        }
    }

    .tag-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
        -webkit-user-select: none;
        position: fixed;
        z-index: 9;
        width: 100%;

        background-color: var(--bg);
        margin-top: 72px;
        padding: 0 10px;
        overflow: hidden;
        overflow-x: auto;
        margin-left: 10px;
        /* box-shadow: 10px 0px 0px 0px rgba(7, 17, 27, 0.05); */

        .content-container {
            /* backdrop-filter: blur(20px); */
            /* width: calc(100vw - 24px); */
            width: 100%;

            display: flex;
            position: relative;
            user-select: none;
            -webkit-user-select: none;
            align-items: center;
            font-size: 16px;
            background-color: var(--bg);
            color: var(--text);
            height: 40px;
            white-space: nowrap;
            height: 72px;


        }

        .tag-content {
            display: flex;
            color: var(--text);
            /*这是关键属性，flex模式允许换行 */
            /* flex-wrap: wrap; */

            .active {
                background-color: rgba(0, 0, 0, 0.03);
                border-radius: 999px;
                color: var(--text);
            }

            .tag-item {
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0 15px;
                cursor: pointer;
                -webkit-user-select: none;
                user-select: none;

                /*鼠标移入效果*/
                &:hover {
                    background-color: rgba(0, 0, 0, 0.03);
                    border-radius: 999px;
                    color: var(--text);
                }
            }

        }
    }
</style>