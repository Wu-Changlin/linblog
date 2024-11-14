import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu',{
    persist: {
        enabled: true, //开启数据持久化
        strategies: [
            {
                key: "currentMenuIds", //给一个要保存的名称
                storage: sessionStorage, //sessionStorage / localStorage 存储方式
            },
        ],
    },
    state: () => ({
        currentMenuIds: [],
    }),
    actions: {
        setCurrentMenuId(menuData) {
           /* 首先检查 this.currentMenuIds 数组中是否已经存在一个对象其 menu_id 属性和 menuData 的 menu_id 属性相同。
            如果不存在，才会执行 push 方法将 menuData 添加到数组中。
            这里使用了 Array.prototype.some() 方法来检查数组中是否有符合条件的元素。*/
            if (!this.currentMenuIds.some(obj => obj.menu_id === menuData.menu_id)) {
               // 尾部添加元素
                this.currentMenuIds.push(menuData);
            }
            
        
        },
        removeStoreMenuId() {
            const savedMenuId = this.currentMenuIds;
            if(savedMenuId){
                this.currentMenuIds = [];
            }
            
        },
    },
})