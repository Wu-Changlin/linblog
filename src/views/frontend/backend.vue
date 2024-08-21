<template>
    <div class="demo-input-suffix" style="margin-bottom:30px;">
        <el-collapse-transition>
          <div class="selectheader">
            达人分类:
            <div v-for="(item,index) in data.tagBtnList" :key="index" style="display:inline-block;">
              <el-button
                size="small"
                :class="{active:item.value==data.activeTag}"
                v-if="index<=data.tagBtnListLength"
                @click="selectBtnTag(item.value)"
              >{{item.label}}</el-button>
            </div>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-arrow-down"
              @click="showMore()"
              v-if="data.tagBtnList.length>3"
            >{{data.showBtnTags?"更多":"收起"}}</el-button>
          </div>
        </el-collapse-transition>
      </div>
</template>


<script setup>
   
//    export default {
//             data() {
//             return {
//                 activeTag: 0,
//                 tagBtnListLength: 3,
//                 showBtnTags: true,
//                     tagBtnList: [
//                         { value: 0, label: "全部" },
//                         { value: 1, label: "分类1" },
//                         { value: 2, label: "分类2" },
//                         { value: 3, label: "分类3" },
//                         { value: 4, label: "分类4" },
//                         { value: 5, label: "分类5" }
//                     ]
//                 }
//         },
//         methods: {
//         selectBtnTag(val) {
//         this.activeTag = val;
//         },
//         showMore() {
//             if (!this.showBtnTags) {
//                 this.tagBtnListLength = 3;
//             } else {
//                 this.tagBtnListLength = this.tagBtnList.length;
//             }
//             this.showBtnTags = !this.showBtnTags;
//         }

//         }

//    }


   import { ref,reactive } from 'vue';

const data=reactive({
    showBtnTags:true, //默认显示更多按钮
    tagBtnListLength:3,//截取默认显示标签数量
    activeTag: 0,//标签选中样式
    tagBtnList: [
        { value: 0, label: "全部" },
        { value: 1, label: "分类1" },
        { value: 2, label: "分类2" },
        { value: 3, label: "分类3" },
        { value: 4, label: "分类4" },
        { value: 5, label: "分类5" },
        { value: 0, label: "全部2" },
        { value: 1, label: "分类1" },
        { value: 2, label: "分类2" },
        { value: 3, label: "分类3" },
        { value: 4, label: "分类4" },
        { value: 0, label: "全部3" },
        { value: 1, label: "分类1" },
        { value: 2, label: "分类2" },
        { value: 3, label: "分类3" },
        { value: 4, label: "分类4" },
        { value: 0, label: "全部4" },
        { value: 1, label: "分类1" },
        { value: 2, label: "分类2" },
        { value: 3, label: "分类3" },
        { value: 4, label: "分类4" },
        { value: 0, label: "全部5" },
        { value: 1, label: "分类1" },
        { value: 2, label: "分类2" },
        { value: 3, label: "分类3" },
        { value: 4, label: "分类4" },
        { value: 0, label: "全部6" },
        { value: 1, label: "分类1" },
        { value: 2, label: "分类2" },
        { value: 3, label: "分类3" },
        { value: 4, label: "分类4" },
        { value: 0, label: "全部7" },
        { value: 1, label: "分类1" },
        { value: 2, label: "分类2" },
        { value: 3, label: "分类3" },
        { value: 4, label: "分类4" },
    ]

});



function showMore() {
            if (!data.showBtnTags) {
                data.tagBtnListLength = 3;
            } else {
                data.tagBtnListLength = data.tagBtnList.length;
            }
            data.showBtnTags = !data.showBtnTags;
        }

function selectBtnTag(val) {
     data.activeTag = val;
 }



</script>
<style  scoped>

    .active {
    color: #409eff;
    }
    </style>