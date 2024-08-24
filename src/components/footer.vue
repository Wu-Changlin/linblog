<template>
    <!-- 页脚 开始-->
    <div class="website-approve" :style="{display: data.show_website_approve ? 'block' : 'none'}">
        <a  class="website-approve-item" href="">  桂ICP 备 20xxxxxx 号 </a>
    </div>
     <!-- 页脚 结束-->
</template>



<script setup>
    import {  reactive } from 'vue';
    
    const data=reactive({
        show_website_approve:false, //悬浮内容标签栏 
        
    })


    /*吸底效果 开始*/
    //滑动监听
    const scrollBottom=()=>{

        const distanceToBottom = document.documentElement.offsetHeight - (window.innerHeight + window.scrollY);
        if(distanceToBottom < 100){//如果距离底部小于100px，那么显示页脚
            data.show_website_approve=true;
        }else{
            data.show_website_approve=false;
        }
    
    }

    window.addEventListener('scroll',scrollBottom); 

</script>

<style scoped>
.website-approve {
	position: fixed;
    justify-content: center;
    align-items: center;
    bottom: 0;
    width: 100%;
    display: none;
    margin-top: 30px;
    /* 隐藏 */
    @media screen and (max-width: 959px) {
			display: none;
			/* visibility: hidden; */
			
    }
}

.website-approve-item {

    width: 100%;
    height: 30px;
    margin-left: 50%;
}
</style>