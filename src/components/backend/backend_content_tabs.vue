<template>

  <div style="padding-top: 72px;"></div>
  <div class="tags">

    <div style="margin-left: 10px;">

      <!-- <el-tag v-for="(menu_path,menu_title) in parent_page_tabs_list_data" :key="menu_path" :closable="menu_path!=='/admin/home'"
        :effect="route.path===menu_path?'dark':'plain'"  @click="clickMenu(menu_path)" @close="handleClose(menu_title)">
        {{menu_title}}
      </el-tag> -->

      <el-tag v-for="(item,index) in currentActiveMenuData" :key="index" :closable="item.menu_path!=='/admin/home'"
      :effect="route.path===item.menu_path?'dark':'plain'"  @click="clickMenu(item.menu_path)" @close="handleClose(item.menu_id,item.prop_name)">
      {{item.prop_name}}
    </el-tag>

    </div>
    

  </div>

</template>


<script setup>
  import { reactive, ref, nextTick, onMounted, getCurrentInstance, onUnmounted, watch, inject, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { debounce, throttle } from '@/hooks/debounceOrThrottle.js';
	import { useMenuStore } from '@/stores/useMenuStore.js';//临时存储活跃菜单id  会话级
  import { storeToRefs } from 'pinia';// 从 pinia 中导入 storeToRefs

  // 菜单存储
  const menuStore=useMenuStore();
  // 使用了storeToRefs方法后会保持响应式更新 菜单存储
  const { currentActiveMenuData } =  storeToRefs(menuStore);

 
//   currentActiveMenuData= [
//     {
//         "prop_name": "首页",
//         "menu_path": "/admin/home",
//         "menu_id": 0
//     },
//     {
//         "prop_name": "用户页",
//         "menu_path": "/admin/user_list",
//         "menu_id": 8
//     }
// ]
  //使用computed来创建依赖响应式状态的计算值 菜单存储 
  //（对于Pinia中的getter方法我们则无法继续通过storeToRefs来使用，就使用解构来赋值使用。）
// const currentActiveMenuData = computed(() => useMenuStore().getCurrentActiveMenuData);

  const route = useRoute();
  const router = useRouter();

  const $message = inject('$message');



  // console.log('parent_page_tabs_list_data:',parent_page_tabs_list_data)

  	//点击标签
	function clickMenu(menu_path) {
//路由跳转
router.push({ path: menu_path })
}


//计算属性active_menu_name来获取路由的名称高亮对应菜单项
// const active_menu_name = computed(() => route.name);


//点击关闭标签
function handleClose(menu_id,menu_title){
console.log('menu_id,menu_title:',menu_id,menu_title)
activeTag(menu_id,menu_title);
  // console.log('关闭menu_title：',menu_title);
// hasOwnProperty()方法返回一个布尔值，如果对象包含指定名称的属性，返回true；否则返回false。
//  const exist_status=parent_page_tabs_list_data.value.hasOwnProperty(menu_title);

//  //如果存在指定名称的属性，那么调用方法移除该标签
//  if(exist_status){
//   useMenuStore().removeCurrentMenuIdData(menu_id);
//   parentPageCloseTagFunction(menu_title);


//  }

}


//执行关闭tag，操作当前激活的选项卡（当前所在的路由） 跳转到临近页面，
function activeTag(close_menu_id,close_menu_title) {
        let close_tag_path =  currentActiveMenuData.value.filter(item => item.menu_id === close_menu_id).map(item => item.menu_path)[0];;//删除路由
        let active_path='';//跳转活跃地址
        let current_path = route.path; //当前路由
       
        //如果当前的路由是要删除的页面
        if (current_path === close_tag_path) {
          const menu_data_length=currentActiveMenuData.value.length;
          
          currentActiveMenuData.value.forEach((tab, index) => {
            console.log('current_path:',current_path,',tab.menu_path :',tab.menu_path ,',status:',tab.menu_path === current_path);
            
                if (tab.menu_path === current_path) {
                  let nextTab =''
                  
                  if(index + 1 === menu_data_length){// 如果关闭最后一个标签页，前进
                    nextTab =  currentActiveMenuData.value[index - 1].menu_path; 
                  }else{//非关闭最后一个标签页 //如果在中间的tab，会选择在后面的一个；
                    nextTab = currentActiveMenuData.value[index + 1].menu_path;  
                  }

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
        // 删除菜单存储指定菜单id相关数据
        useMenuStore().removeCurrentMenuIdData(close_menu_id);
      
        // 弹出消息提示
        let msg = '成功关闭' + close_menu_title;
        $message(msg, 'success')
        //跳转路由
        router.push({ path: active_path })
    }




  onMounted(() => {


  })


  onUnmounted(() => {
    //离开页面时移除监听窗口响应式每行最多标签数量
    // window.removeEventListener('resize', maxItemsPerLines);
    //吸顶效果
    // window.removeEventListener('scroll', handleScroll);
    // stopHiddenTagContentRetWatch.value=null; // 如果watch返回了一个停止监听的函数，调用它
  })

</script>

<style scoped>
  .tags {
    width: 100%;
    height: 70px;
    z-index: 10;
    display: flex;
    position: fixed;
    align-items: center;
    /* margin: 0px 12px; */
    background-color: var(--bg);
    /* height: 72px; */
  }

  .el-tag {
    margin-right: 10px;
    cursor: pointer;
  }
</style>