<template>
    <Waterfall :list="list" :breakpoints="breakpoints"  style="background-color: var(--bg);">
        <template #item="{ item,index }">
          <div class="waterfall_card">

            <LazyImg  class="lazy_img" :url="item.src" style="border-radius: 8px" @click="goViewAticle(item.article_id)"/>
                 
            
              <div class="card-img-mask-stats">
                <div class="card-img-mask-stats-left">
                  <span  class="card-img-mask-stats-item">
                    <div  class="card-img-mask-stats-icon"><svg-icon   icon-class="visits"/></div>
                    <span class="card-img-mask-stats-text">  {{ item.article_visits}}</span>
                  </span>
                  <span  class="card-img-mask-stats-item">
                     <div  class="card-img-mask-stats-icon"><svg-icon   icon-class="zishu"/></div>
                    <span class="card-img-mask-stats-text"> {{ item.article_word_count}}</span>
                  </span>

                </div>

                <span class="card-img-mask-stats-reading-time">{{ item.article_read_time}}</span>

              </div>
            

            
            <div class="footer">
              <a class="title"><span>{{ item.article_title}}</span></a>
              <div class="author-wrapper">
                <a class="author">
                  <svg-icon class="author-avatar" icon-class="author"/>
                  <span class="name">  {{ item.author_name}}</span>
                </a>
                <!-- <span class="like-wrapper like-active">
                 <span  class="like-lottie" style="width: 16px; height: 16px;" ></span>
                  <svg-icon class="reds-icon" style="width: 16px; height: 16px;" icon-class="visits"/>
                  <span class="count">12</span>
                </span> -->
              </div>
            </div>
          </div>
        </template>
      </Waterfall>
        
</template>

<script setup>
import { reactive ,ref} from 'vue';
import { useRouter } from "vue-router";
import { LazyImg, Waterfall } from "vue-waterfall-plugin-next";
import "vue-waterfall-plugin-next/dist/style.css";


const router = useRouter();


const list = ref([
  {article_id:1, article_visits:1000,  article_word_count:20000 , article_read_time:'19:47',article_title:'eeeee家电测评干货之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创',  src: "https://cdn.shopify.com/s/files/1/2418/2505/files/BD1240-NAH3722-Default.webp?v=1723282674"},
  {article_id:2,  article_visits:3000,  article_word_count:40000 , article_read_time:'09:47',article_title:'2222222家电测评干货之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://tse1-mm.cn.bing.net/th/id/OIP-C.cGc4c8dVlqnfV3uwcS1IogHaE8?w=260&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
  {article_id:3,  article_visits:2000,  article_word_count:10000 , article_read_time:'10:47',article_title:'家电测评干货之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'转载', src: "https://tse1-mm.cn.bing.net/th/id/OIP-C.Zte3ljd4g6kqrWWyg-8fhAHaEo?w=264&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
  {article_id:4,  article_visits:4000,  article_word_count:20000 , article_read_time:'07:47',article_title:'eeeeeeeee家电测评干货之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://tse1-mm.cn.bing.net/th/id/OIP-C.Zte3ljd4g6kqrWWyg-8fhAHaEo?w=264&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
  {article_id:5,  article_visits:5000,  article_word_count:12000 , article_read_time:'07:47',article_title:'家vvvvvv电测评干货之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://tse4-mm.cn.bing.net/th/id/OIP-C.N0USLldg_iKDGVKT12vB4AHaEK?w=292&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
  {article_id:6,  article_visits:6000,  article_word_count:40000 , article_read_time:'06:47',article_title:'家电测vvvvvvv评干货之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://tse1-mm.cn.bing.net/th/id/OIP-C.jzcWzXf_uts2sgE2WChuCQHaEo?w=263&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
  {article_id:7,  article_visits:7000,  article_word_count:60000 , article_read_time:'05:47',article_title:'家电测评干货之电热水cccdddddd器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://tse1-mm.cn.bing.net/th/id/OIP-C.Zte3ljd4g6kqrWWyg-8fhAHaEo?w=264&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
  {article_id:8, article_visits:8000,  article_word_count:70000 , article_read_time:'03:47',article_title:'家电测评干货ddddddddd之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg" },
  {article_id:9, article_visits:8000,  article_word_count:3000 , article_read_time:'02:47',article_title:'家电测评干货之llllll电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg" },
  {article_id:10, article_visits:9000,  article_word_count:5000 , article_read_time:'04:37',article_title:'家电测评干货之bbbbbbbb电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg" },
  {article_id:11, article_visits:4000,  article_word_count:30000 , article_read_time:'02:47',article_title:'家电测评干货之jjjjjjjjjj电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg" },
  {article_id:12, article_visits:3000,  article_word_count:30000 , article_read_time:'02:27',article_title:'家电测评干货之hhhhhhhhhhh电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg" },
  {article_id:13, article_visits:2000,  article_word_count:30000 , article_read_time:'08:27',article_title:'家电测评干eeggg货之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg" },
  {article_id:14, article_visits:3000,  article_word_count:30000 , article_read_time:'11:47',article_title:'家电测评干gg45t货之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'转载', src: "https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg" },
  {article_id:15, article_visits:37000,  article_word_count:30000 , article_read_time:'14:27',article_title:'家电测评干gggg货之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'转载', src: "https://tse4-mm.cn.bing.net/th/id/OIP-C.N0USLldg_iKDGVKT12vB4AHaEK?w=292&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
  {article_id:16, article_visits:3500,  article_word_count:30000 , article_read_time:'134:17',article_title:'家电测评干货之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://tse1-mm.cn.bing.net/th/id/OIP-C.jzcWzXf_uts2sgE2WChuCQHaEo?w=263&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
  {article_id:17, article_visits:3300,  article_word_count:30000 , article_read_time:'12:47',article_title:'家电测评eee干货之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://tse3-mm.cn.bing.net/th/id/OIP-C.YzEeJqgWky6RQMatrMd6-gHaHa?w=170&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
  {article_id:18, article_visits:23000,  article_word_count:30000 , article_read_time:'11:27',article_title:'家电测评干货之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://tse3-mm.cn.bing.net/th/id/OIP-C.YzEeJqgWky6RQMatrMd6-gHaHa?w=170&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
  {article_id:19, article_visits:73000,  article_word_count:30000 , article_read_time:'9:7',article_title:'家电测评干ddd货之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://tse1-mm.cn.bing.net/th/id/OIP-C.Zte3ljd4g6kqrWWyg-8fhAHaEo?w=264&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
  {article_id:20, article_visits:9000,  article_word_count:30000 , article_read_time:'8:47',article_title:'家电测评wwwww干货之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://tse4-mm.cn.bing.net/th/id/OIP-C.N0USLldg_iKDGVKT12vB4AHaEK?w=292&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
  {article_id:21, article_visits:5000,  article_word_count:30000 , article_read_time:'7:47',article_title:'家电测评干货之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://tse1-mm.cn.bing.net/th/id/OIP-C.jzcWzXf_uts2sgE2WChuCQHaEo?w=263&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
  {article_id:22, article_visits:2000,  article_word_count:30000 , article_read_time:'84:47',article_title:'家电sss测评干货之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://tse1-mm.cn.bing.net/th/id/OIP-C.Zte3ljd4g6kqrWWyg-8fhAHaEo?w=264&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
  {article_id:23, article_visits:31000,  article_word_count:30000 , article_read_time:'94:47',article_title:'sssssssss家电测评干货之电热水器！别乱跟风买‼️家电测评干货之电热水器！别乱跟风买‼️',author_name:'原创', src: "https://tse1-mm.cn.bing.net/th/id/OIP-C.cGc4c8dVlqnfV3uwcS1IogHaE8?w=260&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7" },
]);



	//去看博文
	function goViewAticle(article_id){
		//直接跳转
		// const handleChange = () => {
		//   router.push("/testDemo");
		// };
		//带参数跳转

    if(article_id){
      router.push({name:'article',query:{id:article_id},key: new Date().getTime()});
    }else{
      console.log('非法请求')
    }
 
		

	}



//每行显示个数。如没有符合尺寸，默认选择相近条件。
const breakpoints=ref ({
  1424: {
    rowPerView:5
  },
  1192: {
    rowPerView:4
  },
  960: {
    rowPerView:3
  },
  696: {
    rowPerView:2
  },
  400: {
    rowPerView:1
  }

}) 


</script>


<style scoped>

.waterfall_card{
position: relative;
}

.lazy_img{
  cursor: pointer;

}


    .card-img-mask-stats {
      position: absolute;
      bottom: 90px;
      left: 0;
      z-index: 2;
      box-sizing: border-box;
      /* padding: 0px 8px 0px; */
      width: 100%;
      height: 20px;
      border-bottom-right-radius: 6px;
      border-bottom-left-radius: 6px;
      /* background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .8) 100%); */
      color: var(--card_bg);
      font-size: 13px;
      /* line-height: 18px; */
      opacity: 1;
      display: -webkit-flex;
      display: flex;
      align-items: center;
      justify-content: space-between;
  }




    .card-img-mask-stats-left {
        min-width: 0;
        flex: 1;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: flex-start
    }


    .card-img-mask-stats-item {
        margin-right: 12px;
        display: -webkit-flex;
        display: flex;
        align-items: flex-start;
        justify-content: center;
       
    }

    .card-img-mask-stats-text{
      word-break: keep-all;
    }


    .card-img-mask-stats-icon {
        /* margin-right: 2px; */
        display: flex;
        width: 18px;
        height: 18px;
        /* color: var(--bg); */
        justify-items: center;
        align-items: center;
        
    }



    .footer {
      padding: 12px;
      
      .title {
        margin-bottom: 8px;
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        font-weight: 500;
        font-size: 14px;
        line-height: 140%;
        color: var(--text);
      }

      .author-wrapper {
        display: flex;
    align-items: center;
    justify-content: space-between;
    height: 20px;
    color: var(--color-secondary-label);
    font-size: 12px;
    transition: color 1s;

        .author {
          display: flex;
    align-items: center;
    /* color: inherit; */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 12px;

          .author-avatar {
            margin-right: 6px;
    width: 20px;
    height: 20px;
    border-radius: 20px;
    border: 1px solid var(--color-border);
    flex-shrink: 0;
    /* cursor: pointer; */
          }

          .name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            
          }
        }

        .like-wrapper {
                position: relative;
                
                display: flex;
                align-items: center
            }

        .like-wrapper .count {
            text-wrap: nowrap
        }

        .like-active:hover {
            color: var(--color-primary-label)
        }

        .like-icon.active {
            visibility: hidden
        }

        .like-lottie {
            position: absolute;
            left: 0;
            top: 0;
            transform: scale(1.7)
        }

        .reds-icon {
    display: inline-block;
    vertical-align: middle;
    fill: currentColor;

   
}
.like-wrapper .count {
                margin-left: 2px
            }

      }
    }

</style>