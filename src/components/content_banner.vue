<template>
    

   
    <div  class="swipe-body">
        <div class="carousel" @mouseover="pauseTimer" @mouseout="resumeTimer">
            <div class="carousel-inner" :style="{'transform': `translateX(-${data.active_index * 100}%)` }">
                <div class="item"  v-for="index in data.list" >
                    <img    :src="index.image" >
                </div> 
            </div>
        </div>
        <div class="vui-carousel" ref='dotsList' :style="{'--b-color':data.list[data.active_index].vui_carousel_color}">
    
            <div class="l-box">
                <div class="title">{{data.list[data.active_index].title}}</div>
                
            </div>

            <div class="r-box">
                
                <ul class="dots">
                    <li :class="[index==data.active_index?'pacman':'dot',data.is_prev?'l':'']" v-for="(item,index) in data.list"  @click="jumpToSlide(index)">
                        <!-- 吃豆人 -->
                        <div v-if="index==data.active_index"></div>
                        <div v-if="index==data.active_index"></div>
                    </li>
                </ul>
            </div>

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
    
    //   // 生命周期钩子
    //   onBeforeMount(()=>{
    //     console.log('挂载之前')
    //   })
    //   onMounted(()=>{
    //     console.log('挂载完毕');
    //     // 初始化,自动轮播
    //     // showSlide();
    //   })
    //   onBeforeUpdate(()=>{
    //     console.log('更新之前')
    //   })
    //   onUpdated(()=>{
    //     console.log('更新完毕')
    //   })
    //   onBeforeUnmount(()=>{
    //     console.log('卸载之前')
    //   })
    //   onUnmounted(()=>{
    //     console.log('卸载完毕')
    //   })
    
    
    // const carouselRef=ref();
    //   window.addEventListener('resize', onWindowResize)
    //   function onWindowResize() {
       
    //           // 通过捕获系统的onresize事件触发我们需要执行的事件
    //           var w = window.innerWidth;
    //           var h = window.innerHeight;
    //           console.log('innerWidth:'+w)
    //           console.log('innerHeight:'+h)
    //           var h = 270
    //           if (w > 1180) {
    //             h = 270
    //           } else {
    //             h = 0.22 * w
    //           }
    //           const imgH = h + 'px'
              
    //         }
          
        
        
        const data=reactive( {
            active_index:0, //当前轮播下标
            is_prev:false, //是否点击上一张(控制吃豆人朝向)
            // 轮播图数据(json格式)
            list:[{
                title:'标题一',
                image:'https://img1.baidu.com/it/u=1290439506,2867352752&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=450',
                vui_carousel_color:'bisque',
            },
            {
                title:'标题二',
                image:'https://img1.baidu.com/it/u=1968056694,654014724&fm=253&fmt=auto?w=800&h=450',
                vui_carousel_color:'red'
            },
            {
                title:'标题三',
                image:'https://img0.baidu.com/it/u=2518818718,2818020477&fm=253&fmt=auto?w=800&h=450',
                vui_carousel_color:'pink'
            },
            {
                title:'标题四',
                image:'https://img1.baidu.com/it/u=715214091,4275190383&fm=253&fmt=auto?w=759&h=427',
                vui_carousel_color:'pink'
            },

            
            ]
        })
    
    
        //放映幻灯片
        function showSlide() {
            
            data.active_index.value >= data.list.length - 1 ? 0 : data.active_index;
            
        }
    
        //上一张
        function prevSlide() {
            if (data.active_index > 0) {
                data.active_index--;
            } else {
                data.active_index = data.list.length - 1;
            }
            data.is_prev=true;
            showSlide();
        }
    
        //下一张
        function nextSlide() {
            if (data.active_index < data.list.length - 1) {
                data.active_index++;
            } else {
                data.active_index = 0;
            }
            data.is_prev=false;
            showSlide();
        }
    
        let timer = setInterval(nextSlide, 3000);
    
        //暂停
        function pauseTimer() {
            clearInterval(timer);
        }

        
        //重新开始
        function resumeTimer() {
            timer = setInterval(nextSlide, 3000);
        }
    
        
        // 切换banner 参数:index=轮播下标(点击指示器时,该值为对应的轮播下标),is_prev=是否上一张(true为上一张,false为下一张)
        function jumpToSlide(index) {
             // 停止轮播
            clearInterval(timer);
            // 点击时轮播下标小于当前轮播下标时,则为上一张,吃豆人向左
            if(index<data.active_index){
                data.is_prev=true;
            }else{// 默认是下一张,吃豆人向右
                data.is_prev=false;
            }
            // 设置当前轮播下标
            data.active_index = index;
            resumeTimer();
            // console.log('data.active_index:'+data.active_index)
        }


</script>

<style>

    .swipe-body{
        margin: 0;
        padding: 0;
        width: 100%;
        /* margin: 0 auto; */
        /* align-items: center;
        justify-content: space-between; */
     }
    /* 轮播图 开始*/
     .carousel{
        width: 100%;
        height: 0;
        padding-top: 56.25%;
        position: relative;
        overflow: hidden; 
     }
    
    .carousel-inner{
        width: 100%;
        position:absolute;
        inset: 0;
        display: flex;
        transition: transform 1s ease-in-out;
       
    }
    
    
    .item {
        flex: 0 0 100%; 
        
    }
    
    .carousel-inner img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }
    
    
    /* 轮播图底部交互 开始*/
    .vui-carousel {
        display:flex ;
         /* 计算底部区域高度 */
        height:100%;
        /* --b-color是自定义属性，接口返回进行动态赋值 */
        --b-color: #000;
        background-color: var(--b-color); 
        color: var(--text);
        /* 相对定位 */
        position: relative;
    } 
    
    
    
    /* 图片底部的渐变部分 */
    .vui-carousel::before{
        content: "";
        width: 100%;
        height: 50px;
        /* 背景渐变（透明——底部区域同色，上到下） */
        background: linear-gradient(to bottom,transparent,var(--b-color));
        /* 绝对定位 位置上移它的高度 */
        position: absolute;
        top: -50px;
    }
    
    /* 底部区域的左侧部分 */
    .vui-carousel .l-box{
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 12px;
        width: 100%;
    }
    
    .vui-carousel .title{
        width: 100%;
        font-size: 18px;
        line-height: 25px;
        /* 标题不换行，溢出显示省略号 */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .vui-carousel .dots{
        display: flex;
        margin-top: 13px;
        margin-right: 0;
    }
    /* 指示器（小圆点） */
    .vui-carousel li{
        width: 8px;
        height: 8px;
        background-color: var(--text);
        margin: 4px;
        border-radius: 50%;
        cursor: pointer;;
    }
    /* 指示器选中态（吃豆人） */
    .vui-carousel li.pacman{
        position: relative;
        width: 14px;
        height: 14px;
        background-color: transparent;
        margin-top: 1px;
    }
    /* 吃豆人由两个div组成 */
    .vui-carousel li.pacman div{
        width: 0;
        height: 0;
        border: 7px solid  var(--bg);
        border-radius: 50%;
        border-right-width: 7px;
        border-right-color: transparent;
        /* 绝对定位 两个重合 */
        position: absolute;
    }
    /* 吃豆人朝向左 */
    .vui-carousel li.pacman.l{
        transform: rotate(180deg);
    }
    /* 接下来分别为吃豆人的两个部分设置动画 */
    .vui-carousel li.pacman div:nth-child(1){
        /* 执行动画：动画名 时长 线性的 停留在最后一帧 */
        animation: pacman1 0.75s linear forwards;
    }
    .vui-carousel li.pacman div:nth-child(2){
        animation: pacman2 0.75s linear forwards;
    }
    /* 底部区域的右侧部分 */
    .vui-carousel .r-box{
        display: flex;
        margin-right: 10px;
    }
    
    
    /* 定义吃豆人动画 */
    @keyframes pacman1 {
        0%{
            transform: rotate(360deg);
        }
        40%{
            transform: rotate(270deg);
        }
        60%{
            transform: rotate(360deg);
        }
        100%{
            transform: rotate(270deg);
        }
    }
    @keyframes pacman2 {
        0%{
            transform: rotate(0deg);
        }
        40%{
            transform: rotate(90deg);
        }
        60%{
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(90deg);
        }
    }
    
    /* 轮播图底部交互 结束*/
    
    /* 轮播图 结束*/
    
    
    
    
    </style>