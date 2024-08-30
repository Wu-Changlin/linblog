<template>
    <div class="website-content-container">
        <div class="website-content-count-container">

            <div class="website-content-count-item" v-for="(item, index) in data.list" :key="index" >
                <h2 class="website-content-count-item-number">{{ item.number }}</h2> 
               
                <h4 class="website-content-count-item-title">{{ item.title }}</h4>
            </div>
    
           
        </div>
    </div>



   

</template>


<script setup>
import { ref, reactive} from 'vue';



const data = reactive({
    list: [
          { title: '分类', number: 6 },
          { title: '标签', number: 71 },
          { title: '文章', number:  20},
          { title: '字数', number:  20000},
          { title: '阅读', number:  100},
    ]
});


</script>

<style>
    /* 网站内容统计 */
    
    .website-content-container .website-content-count-container
    {
        text-align:center;
        display:block;
        clear:both;
        padding-top:5px;
       
    }
    
    .website-content-count .website-content-count-container:before,
    .website-content-count .website-content-count-container:after
    {
        content:'';
        display:block;
        clear:both;
        width:100%;
        height:1px;
    }
    
    .website-content-container .website-content-count-container .website-content-count-item
    {
        display:block;
        width:20%;
        float:left;
    }
    
    .website-content-container .website-content-count-container .website-content-count-item-number
    {
        margin:0;
        font-weight:700;
        display:block;
        color:#43a6f3;
        border-bottom:1px solid #b4b4b4;
        padding:15px 0;
    }
    
    .website-content-container .website-content-count-container .website-content-count-item-title
    {
        margin:0;
        color:#555;
        display:block;
        text-transform:uppercase;
        background-color:#e7e7e7;
        border-top:1px solid #fff;
        padding:15px 0;
        
    }
    
    .website-content-container .website-content-count-container .website-content-count-item:first-child .website-content-count-item-title
    {
        -webkit-border-bottom-left-radius: 16px;
        border-bottom-left-radius: 16px;
    }
    
    .website-content-container .website-content-count-container .website-content-count-item:last-child .website-content-count-item-title
    {
        -webkit-border-bottom-right-radius: 16px;
        border-bottom-right-radius: 16px;
    }
    
 
    </style>