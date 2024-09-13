<template>
    <div class="run-time-count">
        <div class="run-time-count-container">
            <div class="run-time-count-item">
                <h2 class="run-time-count-item-number">{{ days }}</h2> 
               
                <h4 class="run-time-count-item-title">天</h4>
            </div>
    
            <div class="run-time-count-item">
                <h2 class="run-time-count-item-number">{{ hours }}</h2> 
                <h4 class="run-time-count-item-title">时</h4>
            </div>
    
            <div class="run-time-count-item">
                <h2 class="run-time-count-item-number">{{ minutes }}</h2> 
                <h4 class="run-time-count-item-title">分</h4>
            </div>
    
            <div class="run-time-count-item">
                <h2 class="run-time-count-item-number">{{ seconds }}</h2> 
                <h4 class="run-time-count-item-title">秒</h4>
            </div>
        </div>
    </div>


</template>


<script setup>
import { ref,onMounted,onUnmounted,onBeforeMount} from 'vue';

const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const interval = ref(null);
const startTime = new Date('2023-01-01T00:00:00');

const calculateTime = () => {
    const now = new Date();
    const diff = (now - startTime) / 1000;
    days.value = Math.floor(diff / 86400); 
    hours.value = Math.floor((diff % 86400) / 3600);  
    minutes.value=Math.floor((diff % 3600) / 60);  
    seconds.value= Math.floor(diff % 60);

};


onMounted(() => {
   // console.log('组件已挂载')
    interval.value = setInterval(calculateTime, 1000);
});

onUnmounted(() => {
    //console.log('组件将被卸载')
    if (interval.value) {
        clearInterval(interval.value);
    }
});


//页面刷新出现默认值 days hours minutes seconds =0
onBeforeMount(()=>{
    //console.log('挂载之前')
    calculateTime();
})

// watch(interval, () => {
//     console.log(11)
//     calculateTime();
// });
  
</script>

<style scoped>
/* 网站运行时间 */

.run-time-count .run-time-count-container
{
	text-align:center;
	display:block;
	clear:both;
	padding-top:5px;
}

.run-time-count .run-time-count-container:before,
.run-time-count .run-time-count-container:after
{
	content:'';
	display:block;
	clear:both;
	width:100%;
	height:1px;
}

.run-time-count .run-time-count-container .run-time-count-item
{
	display:block;
	width:25%;
	float:left;
}

.run-time-count .run-time-count-container .run-time-count-item-number
{
	margin:0;
	font-weight:700;
	display:block;
	color:#43a6f3;
	border-bottom:1px solid #b4b4b4;
	padding:15px 0;
}

.run-time-count .run-time-count-container .run-time-count-item-title
{
	margin:0;
	color:#555;
	display:block;
	text-transform:uppercase;
	background-color:#e7e7e7;
	border-top:1px solid #fff;
	padding:15px 0;
}

.run-time-count .run-time-count-container .run-time-count-item:first-child .run-time-count-item-title
{
	-webkit-border-bottom-left-radius: 16px;
	border-bottom-left-radius: 16px;
}

.run-time-count .run-time-count-container .run-time-count-item:last-child .run-time-count-item-title
{
	-webkit-border-bottom-right-radius: 16px;
	border-bottom-right-radius: 16px;
}

/* @media screen and (orientation:portrait)
{
	.run-time-count .run-time-count-container .run-time-count-item-number
	{
		font-size:8vw;
	}
	
	.run-time-count .run-time-count-container .run-time-count-item-title
	{
		font-size:2.2vh;
	}
}

@media screen and (orientation:landscape)
{
	.run-time-count .run-time-count-container .run-time-count-item-number
	{
		font-size:6.2vh;
	}
	
	.run-time-count .run-time-count-container .run-time-count-item-title
	{
		font-size:2.8vh;
	}
} */
</style>