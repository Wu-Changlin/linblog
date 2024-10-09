<template>
	<div class="container">
		<BackendNavBar  :parentPageLogData="admin_page_log" ></BackendNavBar>
		<div class="main">
			<BackendSideBar v-if="flag" :parentPageMenuData="admin_page_menu_list_data"></BackendSideBar>

<div class="main-content with-side-bar" :style="{marginLeft: is_collapse_side_menu ? '82px !important' : '', paddingLeft: is_collapse_side_menu ? '10px !important' : ''}">
		<BackendContentTag></BackendContentTag>

				<router-view />
				
			</div>

		</div>
		
		
	</div>


</template>


<script setup>
import { reactive, ref,onMounted,provide,getCurrentInstance} from 'vue';
import { useRouter } from "vue-router";
import BackendNavBar from "@/components/backend/backend_nav_bar.vue";
import BackendSideBar from "@/components/backend/backend_side_bar.vue";
import BackendContentTag from "@/components/backend/backend_content_tag.vue";
import Footer from "@/components/footer.vue";
const { proxy } = getCurrentInstance();//组件实例 代理

// 修改当前选中菜单id 结束
const flag =ref(false)
const admin_page_log=ref();
const admin_page_menu_list_data=ref();
//获取log和菜单导航栏   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
function getAdminOrMenuListData(){

	proxy.$get("/data/backend/admin.json")
	.then(response => {
        admin_page_log.value = response.log_data; // log
		admin_page_menu_list_data.value = response.menu_data; // 菜单数据
		
		
		flag.value=true;
    })
	.catch(error => {
		
proxy.$Message('请求未找到', 'error');
});
}


// 修改当前侧边栏菜单折叠或展开 开始

const is_collapse_side_menu=ref(false);
// 提供数据
provide('isCollapseSideMenu',is_collapse_side_menu);

 // 修改当前侧边栏菜单折叠或展开的方法
 function updateIsCollapseSideMenuFunction(new_state) {
	is_collapse_side_menu.value = new_state;
 }

 // 暴露方法(修改当前侧边栏菜单折叠或展开的方法)供子组件调用
 provide('updateIsCollapseSideMenuFunction', updateIsCollapseSideMenuFunction);

// 修改当前侧边栏菜单折叠或展开 结束


onMounted(() => {

	//获取log和菜单导航栏（外加搜索匹配关键字数据）   // 获取网站配置（如网站标题、网站关键词、网站描述、底部备案、网站log）
	getAdminOrMenuListData();
   
  });



</script>

<style scoped>

*{ /*启用滚动功能 */
    padding: 0;
    margin: 0;
    -ms-overflow-style: none; /* 适用于 Internet Explorer 和旧版 Edge */
    scrollbar-width: none; /* 适用于 Firefox */
    -webkit-scrollbar:none;/* WebKit 内核浏览器（如 Chrome 和 Safari）中的滚动条*/ 
}

.container {
	padding: 0;
	max-width: 1728px;
	background-color: var(--bg);  /* fff*/
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