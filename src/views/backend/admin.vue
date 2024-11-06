<template>
    
    <div class="container">
        <BackendNavBar :parentPageLogData="admin_page_log"></BackendNavBar>
        <div class="main">
            <BackendSideBar v-if="flag" :parentPageMenuData="admin_page_menu_list_data"></BackendSideBar>

            <div class="main-content with-side-bar"
                :style="{marginLeft: is_collapse_side_menu ? '82px !important' : '', paddingLeft: is_collapse_side_menu ? '10px !important' : ''}">
                <BackendContentTabs></BackendContentTabs>

                <router-view />

            </div>

        </div>
    </div>

</template>


<script setup>
    import { reactive, ref, onMounted, onUnmounted, provide, inject } from 'vue';
    import { useRouter } from "vue-router";
    import BackendNavBar from "@/components/backend/backend_nav_bar.vue";
    import BackendSideBar from "@/components/backend/backend_side_bar.vue";
    import BackendContentTabs from "@/components/backend/backend_content_tabs.vue";
    import Footer from "@/components/footer.vue";
    import adminModuleApi from "@/api/backend/admin.js";//api接口
    import { debounce, throttle } from '@/hooks/debounceOrThrottle.js';//防抖、节流
	import useMetaInfo from '@/hooks/useMetaInfo.js';//设置页面meta元数据，标题、关键词、描述 

    const $message = inject('$message');



    const flag = ref(false)
    const admin_page_log = ref();
    const admin_page_menu_list_data = ref();
    const tabs_list_data=ref({});
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
    }

    // 暴露方法(修改当前侧边栏菜单折叠或展开的方法)供子组件调用
    provide('updateIsCollapseSideMenuFunction', updateIsCollapseSideMenuFunction);

    //监听窗口响应式设置折叠菜单
    function settingCollapseSideMenu() {
        let page_width = window.innerWidth;
        if (page_width <= 965) {//页面宽度小于965px开启折叠模式
            updateIsCollapseSideMenuFunction(true)
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
	useMetaInfo(current_meta_title,current_meta_keywords,current_meta_description);

	// 提供数据
	provide('current_meta_title', current_meta_title);
	provide('current_meta_keywords', current_meta_keywords);
	provide('current_meta_description', current_meta_description);



	// 修改当前页面meta元数据，标题、关键词、描述的方法。接收子路由页面的新值 
	function updateCurrentMetaInfoFunction(new_current_meta_info) {
		current_meta_title.value=new_current_meta_info.meta_title;
		current_meta_keywords.value=new_current_meta_info.meta_keywords;
		current_meta_description.value=new_current_meta_info.meta_description;
    // console.log(`updateCurrentMetaInfoFunction:meta_title=${meta_title},meta_keywords=${meta_keywords},meta_description=${meta_description}`)
	}

	// 暴露方法(修改当前页面meta元数据，标题、关键词、描述的方法 )供子组件调用
	provide('updateCurrentMetaInfoFunction', updateCurrentMetaInfoFunction);

	/* 修改当前页面meta元数据，标题、关键词、描述  结束*/



    /* Tabs 标签页添加tag  开始*/
    function addTagToTabs(new_tag){

        // console.log('addTagToTabs:',new_tag.propName,new_tag.value)
        tabs_list_data.value= addPropertyIfNotExists(tabs_list_data.value,new_tag.propName,new_tag.value);

    // console.log('tabs_list_data:',tabs_list_data.value);


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
            const prop_name_to_str= String(propName);
        
            const new_tags_obj={};
            new_tags_obj[prop_name_to_str]=value;
        
            let new_obj= Object.assign(obj, new_tags_obj);
              return  new_obj;
            }else{
                return  obj;
            }

        }

// 暴露方法(Tabs 标签页添加tag的方法 )供子组件调用
provide('addTagToTabs', addTagToTabs);

provide('tabs_list_data', tabs_list_data);


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