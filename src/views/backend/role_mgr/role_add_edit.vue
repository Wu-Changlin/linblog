<template>
  
    <el-collapse>
      <el-collapse-item title="完善信息" name="1">
        
            <el-form
              ref="ruleFormRef"
              :model="ruleForm" 
              label-position="left"

            >

              <div class="form_info">

            
                <div class="left">
                  <el-form-item label="标题" prop="article_title">
                    <el-input v-model="ruleForm.article_title"  placeholder="亲，请输入标题"></el-input>
                  </el-form-item>


                  <el-form-item label="简介" prop="article_introduction">
                    <el-input v-model="ruleForm.article_introduction" type="textarea" placeholder="亲，请输入简介"></el-input>
                  </el-form-item>


                  <el-form-item label="栏目" prop="article_column">
                    <el-radio-group v-model="ruleForm.article_column">
                      <el-radio  v-for="item in columnList"  :key="item.id" :value="item.id" border> {{ item.name }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  

                  <el-form-item label="作者" prop="article_author">
                    <el-radio-group v-model="ruleForm.article_author">
                      <el-radio  v-for="item in authorList"  :key="item.id" :value="item.id" border> {{ item.name }}</el-radio>
                    </el-radio-group>
                  </el-form-item>

                </div>

                <div class="right">

                  <el-form-item v-model="ruleForm.article_cover" label="封面" prop="article_cover">

                    <el-button class="cover_card" @click="dialogConfig.is_show=true">

                      <img     v-if="selected.cover_path" :src="selected.cover_path" alt="" class="cover_img" >
                      <!-- <el-icon v-else class="cover_card_icon"><Plus /></el-icon> -->
						<svg-icon v-else style="width: 20;height: 20;" class="reds-icon" icon-class="search" />


                    </el-button>
                                          
                    <ArticleCoverList :key="dialogConfig.is_show" :is_show="dialogConfig.is_show"  @close="dialogConfig.is_show = false" @success="SelectCover"></ArticleCoverList>
                    


                  </el-form-item>

                  <el-form-item   v-model="ruleForm.article_tag"  label="标签" prpo="article_tag">
                  
                    <el-checkbox-group   v-model="ruleForm.article_tag"   @change="checkboxInfo">
                      <el-checkbox v-for="item in tagList"  :key="item.id" :value="item.id"  size="large" border>
                        {{ item.name }}
                      </el-checkbox>
                    </el-checkbox-group>
                  
                  </el-form-item>

                </div>
            

              </div>

          
          
           
              <el-form-item>
                <div class="bottom-button">
                  <el-button>保存草稿</el-button>
                  <el-button type="primary">发布</el-button>
                </div>
                
              </el-form-item>
      
        
            </el-form>
          
      </el-collapse-item>
    </el-collapse>
 
  
  <MdEditor  height="100vh"  v-model="text" @on-upload-img="onUploadImg" />
  <!-- <v-md-editor  height="100vh" :disabled-menus="[]" @upload-image="handleUploadImage"/> -->
</template>

<script setup>
import { ref, reactive, nextTick ,watch} from "vue"
import ArticleCoverList from '@/components/backend/article_cover_list.vue'
import {MdEditor} from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

const text = ref('Hello Editor!')
const onUploadImg = (files) => {
  console.log(files)
}
//栏目数据
const columnList = [
  {
    id: "001",
    name:'前端'
  },
  {
    id: "002",
    name:'服务端'
  },
  {
    id: "003",
    name:'随笔'
  },
]



//作者数据
const authorList = [
  {
    id: "001",
    name:'原创'
  },
  {
    id: "002",
    name:'转载'
  },
]

//标签数据
const tagList = [
  {
    id: "001",
    name:'php'
  },
  {
    id: "002",
    name:'vue'
  },
  {
    id: "003",
    name:'linux'
  },
  {
    id: "004",
    name:'js'
  },

 
]

//多选框选中值
function  checkboxInfo(val){
           
  //console.log('ruleForm.tag start='+ruleForm.tag)

  //用indexof来检测 被选中的数组里面是否已有现在点击的这条的id
  let checkedIndex = ruleForm.article_tag.indexOf(val.id)

  //console.log('checkedIndex ='+checkedIndex)

  //返回-1表示 无 则把该条的id push进数组并令flag为true
  if (checkedIndex == -1) {
    ruleForm.article_tag.push(val.id)
  } else {
    //如果有的话checkindex返回所在的index 当本来选中又取消时就需要把此条数据删除
    //此时正好用splice 要把本来在里面的所在的index的id从数组里删除
    ruleForm.article_tag.splice(checkedIndex, 1)
  }

  //console.log('ruleForm.tag end='+ruleForm.tag)

}


//接收子组件emit('success',id,path)，确认选中的封面图片id
function SelectCover(cover_id,cover_path) {
  // console.log('SelectCover id='+cover_id); 
  // console.log('SelectCover path='+cover_path); 

  selected.cover_id=cover_id;
  selected.cover_path=cover_path;


}


const selected=reactive({
  cover_id:'',
  cover_path:'',
})



const ruleFormRef = ref();

//初始化添加数据
const ruleForm=reactive({
  article_title:"",
  article_introduction:"",
  article_cover:"",
  article_tag:[],
  article_author:"",
  article_column:"",

})





// dialogConfig 控制显示/隐藏封面图片列表
const dialogConfig = reactive({
  is_show: false,
})

//markdown 上传本地图片
const handleUploadImage = (event, insertImage, files) => {
      // TODO: 在这里将二进制文件上传到服务器
      Notification.success('图片上传成功')
      // 通过回调中的 insertImage 向文本输入图片地址
      insertImage({
        url: '', // 服务器上传成功后的图片url
      })
    }

</script>


<style scoped>

/* :deep(.el-checkbox-button__inner){
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    margin-right:10px ;
    font-size: 12px;
  

} */

.form_info{
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--card_bg);
 

  .left{
    width: 40%;
    
  }
  .right{
      width: 55%;
      display: flex;
      flex-direction: column;

      :deep(.el-checkbox) {
        background-color: var(--cart_bg);
        line-height: 100%;
        border-radius: 4px;
        margin-right: 10px;  
        height: 26px;
        
      }

  }


}

.cover_card{
  margin: 0px 0px 0px 0px;
  padding: 0px 0px 0px 0px;
  width:  200px;
  height: 115px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  .cover_img{
    width: 100%;
    height: 100%;
    display: block;

  }
  
  .el-icon.cover_card_icon {
      font-size: 28px;
      color: #8c939d;
      text-align: center;
  }
    
}

.bottom-button{
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}


</style>