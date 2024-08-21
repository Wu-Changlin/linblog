<template>
    <div class="news">
        
       
       

        <!-- 新闻主题 -->
        <div class="news_main">
            <!-- 轮播图 -->
            <div class="carousel" ref="carouselRef" @mouseover="pauseTimer" @mouseout="resumeTimer">
                
                <div class="carousel-inner" ref="imgListReF"  :style="{'transform': `translateX(-${data.active_index * 100}%)` }">
                    <div class="item"  v-for="index in data.list" >
                        <img    :src="index.image" >
                    </div>
                    
                </div>


                



                <div class="vui_carousel" ref='dotsList' :style="{'--b-color':data.list[data.active_index].vui_carousel_color}">
        

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

                    <!-- <li  :class="{ 'active': index === data.active_index }"  v-for="(item,index) in data.list" @click="jumpToSlide(index)">
                    </li>
     -->
                </div>





            </div>
            

            
           
            
            <!-- 新闻内容 -->
            <div class="news_content">
                <ul class="news_table_list">
                    <li id="t1">最新</li>
                    <li id="t2">新闻</li>
                    <li id="t3">公告</li>
                    <li id="t4">活动</li>
                </ul>
                
                <ul class="news_list" id="news_1">
                    <li>
                        <a href="###" class="news_item" title="凯亚生日快乐｜如果山上风大的话，可以把披风借给你。">
                            <p class="news_title">凯亚生日快乐｜如果山上风大的话，可以把披风借给你。</p>
                            <p class="news_date">2022/11/30</p>
                        </a>
                    </li>
                    <li>
                        <a href="###" class="news_item" title="《原神》新玩法预告PV：「来一局七圣召唤吧！」">
                            <p class="news_title">《原神》新玩法预告PV：「来一局七圣召唤吧！」</p>
                            <p class="news_date">2022/11/30</p>
                        </a>
                    </li>
                    <li>
                        <a href="###" class="news_item" title="《原神》「无相交响诗」活动小贴士 回旋曲·森郁之笼">
                            <p class="news_title">《原神》「无相交响诗」活动小贴士 回旋曲·森郁之笼</p>
                            <p class="news_date">2022/11/30</p>
                        </a>
                    </li>
                    <li>
                        <a href="###" class="news_item" title="《原神》「花坂豪快」荒泷一斗同人绘画作品征集开启">
                            <p class="news_title">《原神》「花坂豪快」荒泷一斗同人绘画作品征集开启</p>
                            <p class="news_date">2022/11/28</p>
                        </a>
                    </li>
                    <li>
                        <a href="###" class="news_item" title="《原神》「无相交响诗」活动小贴士 谐谑曲·束浪之池">
                            <p class="news_title">《原神》「无相交响诗」活动小贴士 谐谑曲·束浪之池</p>
                            <p class="news_date">2022/11/28</p>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

</template>


<style>

  
.news {
    margin: 0;
    padding: 0;
	display: flex;
	height: 100%;
	width: 100%;
    
}


.item{
  background-color: red;
  width: 100%;
  margin: 0 auto;
 }

 .inner{
  width: 100%;
  height: 0;
  padding-top: 56.25%;
  position: relative;
 }

.son{
  width: 100%;
  position:absolute;
  inset: 0;
  background-color: #333;

}


.son img{
    width: 100%;
height: 100%;
   max-width: 640px;
   max-height: 360px;

}


/* 新闻主体 */
.news_main {
	display: flex;
	justify-content: center;
	top: 10px;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
	height: 400px;
   
}


/* 轮播图 开始*/
.carousel {
    /* position: relative; */
    width: 50%;
    height: 400px;
    overflow: hidden;
    border-radius: 6px;

    max-width: 640px;
    max-height: 400px;
}
.carousel-inner {
    height: 360px;
    display: flex;
    transition: transform 0.6s ease-in-out;
}


.carousel-inner img{
    height: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

/* 轮播图底部交互 开始*/
.vui_carousel {
    display:flex ;
     /* 计算底部区域高度 */
    height: calc(400px - 360px);
    /* --b-color是自定义属性，在js中会进行动态赋值 */
    --b-color: #000;
    background-color: var(--b-color);
    color: #fff;
    /* 相对定位 */
    position: relative;
} 



/* 图片底部的渐变部分 */
.vui_carousel::before{
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
.vui_carousel .l-box{
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 12px;
    width: 100%;
}
.vui_carousel .title{
    width: 100%;
    font-size: 18px;
    line-height: 25px;
    /* 标题不换行，溢出显示省略号 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.vui_carousel .dots{
    display: flex;
    margin-top: 13px;
    margin-right: 0;
}
/* 指示器（小圆点） */
.vui_carousel li{
    width: 8px;
    height: 8px;
    background-color: rgba(255,255,255,0.4);
    margin: 4px;
    border-radius: 50%;
    cursor: pointer;;
}
/* 指示器选中态（吃豆人） */
.vui_carousel li.pacman{
    position: relative;
    width: 14px;
    height: 14px;
    background-color: transparent;
    margin-top: 1px;
}
/* 吃豆人由两个div组成 */
.vui_carousel li.pacman div{
    width: 0;
    height: 0;
    border: 7px solid #fff;
    border-radius: 50%;
    border-right-width: 7px;
    border-right-color: transparent;
    /* 绝对定位 两个重合 */
    position: absolute;
}
/* 吃豆人朝向左 */
.vui_carousel li.pacman.l{
    transform: rotate(180deg);
}
/* 接下来分别为吃豆人的两个部分设置动画 */
.vui_carousel li.pacman div:nth-child(1){
    /* 执行动画：动画名 时长 线性的 停留在最后一帧 */
    animation: pacman1 0.75s linear forwards;
}
.vui_carousel li.pacman div:nth-child(2){
    animation: pacman2 0.75s linear forwards;
}
/* 底部区域的右侧部分 */
.vui_carousel .r-box{
    display: flex;
    margin-right: auto;
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




/* 新闻内容 */
.news_content {
	width: 640px;
	height: 400px;
	background: rgba(17, 17, 17, 0.3);
    overflow: visible;
    border-radius: 6px;
    /* visibility: visible; */

	
    @media screen and (max-width: 695px) {
        display: none;
        /* visibility: hidden; */
        
    }
    @media screen and (min-width: 696px) and (max-width: 959px) {
        display: none;
        /* visibility: hidden; */
        
    }

}

.news_table_list {
	display: flex;
	position: relative;
	width: 592px;
	justify-content: flex-start;
	margin-left: 30px;
	margin-top: 10px;
	border-bottom: 3px solid rgba(255,255,255,0.1);
}

.news_table_list li {
	color: white;
	margin: 25px 20px 10px;
	font-size: 18px;
	cursor: pointer;
	position: relative;
}


.news_table_list li:active {
	color: #ffd49f;
}

.news_list {
	height: 260px;
	width: 592px;
	margin: 0 24px;
}

.news_item {
	display: flex;
	align-items: center;
	font-size: 16px;
	height: 50px;
	width: 100%;
	padding: 0;
	opacity: 1;
	color: white;
	border-bottom: 2px solid rgba(255,255,255,0.08);
}

.news_item:hover {
	background: rgba(80, 80, 80, 0.3);
}

.news_title {
	height: 20px;
	width: 480px;
	padding-left: 10px;
}

.news_date {
	height: 50px;
	font-size: 14px;
	line-height: 50px;
	opacity: 0.5;
}
/* 新闻内容 */

</style>

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
            showSlide();
        }
    
        //下一张
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
    
        
        // 切换banner 参数:index=轮播下标(点击指示器时,该值为对应的轮播下标),is_prev=是否上一张(true为上一张,false为下一张)
        function jumpToSlide(index) {
            // 点击时轮播下标小于当前轮播下标时,则为上一张,吃豆人向左
            if(index<data.active_index){
                data.is_prev=true;
            }else{// 默认是下一张,吃豆人向右
                data.is_prev=false;
            }
            // 设置当前轮播下标
            data.active_index =index ;
            showSlide();
            
        }
</script>