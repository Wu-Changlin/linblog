<template>

        <div class="carousel" ref="carouselRef" @mouseover="pauseTimer" @mouseout="resumeTimer">
            <div class="carousel-inner" ref="imgListReF"  :style="{'transform': `translateX(-${data.active_index * 100}%)` }">

                <div class="item"  v-for="index in data.list" >
                    <img   :src="index.image" >
                </div>
                
            </div>
            
            <div class="dots" ref='dotsList' >
    
                <li  :class="{ 'active': index === data.active_index }"  v-for="(item,index) in data.list" @click="jumpToSlide(index)">
                </li>

            </div>
        </div>

   

</template>





<script setup>

import { 
    ref, 
    reactive,
    onBeforeMount, 
    onMounted, 
    onBeforeUpdate, 
    onUpdated, 
    onBeforeUnmount, 
    onUnmounted,
    nextTick
  } from 'vue'

  // 生命周期钩子
  onBeforeMount(()=>{
    console.log('挂载之前')
  })
  onMounted(()=>{
    console.log('挂载完毕');
    
  })
  onBeforeUpdate(()=>{
    console.log('更新之前')
  })
  onUpdated(()=>{
    console.log('更新完毕')
  })
  onBeforeUnmount(()=>{
    console.log('卸载之前')
  })
  onUnmounted(()=>{
    console.log('卸载完毕')
  })


const carouselRef=ref();
  window.addEventListener('resize', onWindowResize)
  function onWindowResize() {
   
          // 通过捕获系统的onresize事件触发我们需要执行的事件
          var w = window.innerWidth;
          var h = window.innerHeight;
          console.log('innerWidth:'+w)
          console.log('innerHeight:'+h)
          var h = 270
          if (w > 1180) {
            h = 270
          } else {
            h = 0.22 * w
          }
          const imgH = h + 'px'
          
        }
      
    
    
    const data=reactive( {
        slideHeight:300,
        timer:null, //定时器
        active_index:0, //当前轮播下标
        is_prev:false, //是否点击上一张(控制吃豆人朝向)
        // 轮播图数据(json格式)
       
        list:[{
            title:'标题一',
            image:'https://tse1-mm.cn.bing.net/th/id/OIP-C.Zte3ljd4g6kqrWWyg-8fhAHaEo?w=264&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
            bottom_color:'bisque',
        },
        {
            title:'标题二',
            image:'https://tse1-mm.cn.bing.net/th/id/OIP-C.cGc4c8dVlqnfV3uwcS1IogHaE8?w=260&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
            bottom_color:'pink'
        },
        {
            title:'标题三',
            image:' https://cdn.shopify.com/s/files/1/2418/2505/files/BD1240-NAH3722-Default.webp?v=1723282674',
            bottom_color:'pink'
        },

       
        ]
    })

    console.log(11)


    const imgRef=ref();
//跑马灯提供的change事件，会返回当前索引和上一次索引，
//根据索引，每次手动触发时候，动态获取和设置高度
const slideChange=(current)=>{
   countImgHeight(current);
}
// 获取图片换算后高度，赋值给轮播
const countImgHeight=(index)=>{
  const img = new Image();
  img.onload = function() {
    const realHeight = img.height;
    const realWidth=img.width;
    const height = ((realHeight)*100)/(realWidth);
    data.slideHeight=height;
  };
  img.src=data.list[index];
}
//初始调用一次
countImgHeight(0);


    //放映幻灯片
    function showSlide() {
        
        data.active_index.value >= data.list.length - 1 ? 0 : data.active_index;
       
    }

    function prevSlide() {
        if (data.active_index > 0) {
            data.active_index--;
        } else {
            data.active_index = data.list.length - 1;
        }
        showSlide();
    }

    function nextSlide() {
        if (data.active_index < data.list.length - 1) {
            data.active_index++;
        } else {
            data.active_index = 0;
        }
        showSlide();
    }

    let timer = setInterval(nextSlide, 3000);

    function pauseTimer() {
        clearInterval(timer);
    }
    function resumeTimer() {
        timer = setInterval(nextSlide, 3000);
    }

    

    function jumpToSlide(index) {
        data.active_index = index;
        showSlide();
        
    }
</script>


<style>

        *{
            margin: 0;
            padding: 0;
            text-decoration: none;
            list-style: none;
            background-repeat: no-repeat;
        }
        .carousel {
            position: relative;
            width: 100%;
            overflow: hidden;
        }
        .carousel-inner {
            display: flex;
            width: 100%;
            transition: transform 0.6s ease-in-out;
        }
        .item {
            flex: 0 0 100%;
            height: 55vh;
        }
        .item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .dots {
            position: absolute;
            bottom: 20px;
            left: 50%;
            z-index: 15;
            width: 60%;
            padding-left: 0;
            margin-left: -30%;
            text-align: center;
            list-style: none;
        }
 
        .dots > li {
            display: inline-block;
            width: 10px;
            height: 10px;
            margin: 1px;
            cursor: pointer;
            background-color: rgba(0,0,0,0);
            border: 1px solid #fff;
            border-radius: 10px;
        }
 
        .dots .active {
            width: 12px;
            height: 12px;
            margin: 0;
            background-color: #fff;
        }





</style>