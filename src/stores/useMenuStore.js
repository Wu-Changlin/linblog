import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu',{
    persist: {
        enabled: true, //开启数据持久化
        strategies: [
            {
                key: "currentActiveMenuData", //给一个要保存的名称
                storage: sessionStorage, //sessionStorage / localStorage 存储方式
            },
        ],
    },
    state: () => ({
        currentActiveMenuData: [{
			prop_name:"首页",
			menu_path: "/admin/home",
			menu_id:0
		}],
    }),
    actions: {
        setCurrentMenuData(menuData) {
           /* 首先检查 this.currentActiveMenuData 数组中是否已经存在一个对象其 menu_id 属性和 menuData 的 menu_id 属性相同。
            如果不存在，才会执行 push 方法将 menuData 添加到数组中。
            这里使用了 Array.prototype.some() 方法来检查数组中是否有符合条件的元素。*/
            // js let s=[{ "id": 10},{ "id": 13}]  push({"id":10}) id唯一判断
            if (!this.currentActiveMenuData.some(obj => obj.menu_id === menuData.menu_id)) {
               // 尾部添加元素
                this.currentActiveMenuData.push(menuData);
            }
        },  
        // 关闭页面移除指定菜单数据   idToDelete 要删除的id
        removeCurrentMenuIdData(idToDelete) {
    

            // 在JavaScript中，要根据对象的id属性值从数组中删除对象，可以使用filter方法。
            // filter方法会创建一个新数组，包含通过所提供函数实现的测试的所有元素。
            // 使用filter方法删除对象
            this.currentActiveMenuData = this.currentActiveMenuData.filter(item => item.menu_id !== idToDelete);
            // console.log('this.currentActiveMenuData:',this.currentActiveMenuData)    
        },
        removeStoreMenuData() {
            const savedMenuId = this.currentActiveMenuData;
            if(savedMenuId){
                this.currentActiveMenuData = [];
            }
            
        },
    },
    getters: {
        getCurrentActiveMenuData: (state) =>  state.currentActiveMenuData,
    }
})