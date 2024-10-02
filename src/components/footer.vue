<template>
    <!-- 页脚 开始-->

    <div style="height: 60px;background-color: #313741;color: #fff;text-align: center;padding: 20px 0;">备案</div>

    <!-- <div  class="website-approve">
        <a  class="website-approve-item" href="">  桂ICP 备 20xxxxxx 号 </a>
    </div> -->
     <!-- 页脚 结束-->
</template>



<script setup>
    import {  reactive, onMounted ,onUnmounted} from 'vue';
    


</script>

<style scoped>
a {
    
    text-decoration: none;
    background-color: transparent
}
 


.website-approve {
    /* display: flex; */
	/* position: relative; */
    justify-content: center;
    align-items: center;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    /* display: block; */
    /* display: none; */
    margin-top: 12px;
    z-index: 1;
 margin-bottom: 0;
    height: 30px;
    /* 隐藏 */
    @media screen and (max-width: 959px) {
			display: none;
			/* visibility: hidden; */
			
    }
}

.website-approve-item {
    /* display:flex; */
    /* position: fixed; */
    z-index: 1;
    bottom: 0;
    justify-content: center;
    align-items: center;
    margin:0 auto;
    height: 30px;
}
</style>