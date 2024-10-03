<template>
    <!-- 页脚 开始-->

    <div class="website-approve">
    <a :href="websiteApproveUrl">{{websiteApproveTitle}}</a>
</div>
    <!-- <div  class="website-approve">
        <a  class="website-approve-item" href="">  桂ICP 备 20xxxxxx 号 </a>
    </div> -->
     <!-- 页脚 结束-->
</template>



<script setup>
    import {  reactive, onMounted ,onUnmounted} from 'vue';
    
    const props = defineProps({
        websiteApproveTitle: {
            type:String
        },
        websiteApproveUrl: {
            type:String
        },
    });


  
</script>

<style scoped>

a {
    
    text-decoration: none;
    background-color: transparent
}

.website-approve {
    align-items: center;
    justify-content: center;
    display: flex; width: 100%;height: 60px;
    background-color: var(--color-active-background) !important;
            border-radius: 999px;
            color: var(--color-primary-label) !important;
     text-align: center;


    /* 隐藏 */
    @media screen and (max-width: 959px) {
			display: none;
			/* visibility: hidden; */
			
    }
}


</style>