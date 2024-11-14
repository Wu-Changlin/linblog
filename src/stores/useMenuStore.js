import { defineStore } from 'pinia';

export const useMenuStore = defineStore({
    id: 'menu',
    state: () => ({
        currentMenuId: null,
    }),
    actions: {
        setCurrentMenuId(menuId) {
            this.currentMenuId = menuId;
            // 使用sessionStorage存储菜单id
            // console.log('currentMenuId:',this.currentMenuId)
            sessionStorage.setItem('currentMenuId', menuId);
        },
        removeStoreMenuId() {
            const savedMenuId = sessionStorage.getItem('currentMenuId');
            if(savedMenuId){
                this.menuId = null;
                sessionStorage.removeItem('currentMenuId');
            }
            
        },
    },
})