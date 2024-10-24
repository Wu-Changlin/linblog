<template>


  <div class="page_title_container">
    <div class="line"></div>
    <div class="title">
      {{ page_title}}
    </div>
    <div class="line"></div>
  </div>

  <div style="width: 100%;height: 100vh; overflow: hidden;">

    <div style="display: flex;flex-wrap: wrap;height: 62px;margin-top: 10px;">
      <div style="flex: 1;align-items: center; margin: 0 10px;" class="article-title-input">
        <el-input v-model="article_title_input" style="width: 100%; height: 100%;" placeholder="输入文章标题..." clearable />
      </div>
      <div style="display: flex;align-items: center;margin: 0 10px;">
        <el-button type="primary">草稿箱</el-button>
        <el-button type="primary" @click="is_show_panel=!is_show_panel">发布</el-button>
        <div class="panel" v-if="is_show_panel">
          <el-form ref="ruleFormRef" :model="ruleForm" label-position="left" style="width: 100%;">

            <div class="title">发布文章</div>

            <div style="padding: 10px;">

              <el-form-item label="摘要" prop="article_abstract" style="min-height: 100px">
                <el-input style="height: 100%;" v-model="ruleForm.article_abstract" type="textarea" maxlength="100" placeholder="亲，请输入简介"
                  show-word-limit></el-input>
              </el-form-item>


              <el-form-item label="栏目" prop="menu_id">
                <el-radio-group v-model="ruleForm.menu_id" @change="checkColumnRadioInfo">
                  <el-radio  v-for="item in options_menu_data" :key="item.menu_id" :value="item.menu_id"> {{
                    item.menu_title }}</el-radio>
                </el-radio-group>
              </el-form-item>


              <el-form-item label="作者" prop="author_name">
                <el-input v-model="ruleForm.author_name" type="text" placeholder="亲，请输入作者名称" clearable></el-input>
              </el-form-item>



              <el-form-item v-model="ruleForm.cover" label="封面" prop="cover">
                <div v-if="ruleForm.cover">
                  <el-image style="width: 100px; height: 100px" :src="ruleForm.cover"
                    :preview-src-list="[ruleForm.cover]" fit="cover" />
                </div>


                <el-button class="cover_card" @click="dialogConfig.is_show=true">

                  <img v-if="selected.cover_path" :src="selected.cover_path" alt="" class="cover_img">
                  <!-- <el-icon v-else class="cover_card_icon"><Plus /></el-icon> -->
                  <svg-icon v-else style="width: 20;height: 20;" class="reds-icon" icon-class="search" />

                </el-button>

                <ArticleCoverList :key="dialogConfig.is_show" :is_show="dialogConfig.is_show"
                  @close="dialogConfig.is_show = false" @success="SelectCover"></ArticleCoverList>



              </el-form-item>

              <el-form-item  label="标签" v-model="ruleForm.tag_ids" prop="tag_ids">

                <el-checkbox-group style="display: flex;overflow: hidden;flex-wrap: wrap;"   :max="3"  v-model="ruleForm.tag_ids"
                  @change="checkTagsBoxInfo">
                  <el-checkbox  style="margin-top: 10px;" v-for="item in options_tags_data" :key="item.tag_id"
                    :value="item.tag_id" :label="item.tag_name" size="large">
                    <el-tag>{{ item.tag_name }}</el-tag>
                  </el-checkbox>
                </el-checkbox-group>

              </el-form-item>


              <el-form-item label="下架" prop="is_pulled">
                <el-switch
                v-model="ruleForm.is_pulled"
                inline-prompt
                active-text="是"
                inactive-text="否"
              />
              </el-form-item>

            </div>

            <div class="bottom-button">
              <el-button>保存草稿</el-button>
              <el-button type="primary" @click="clickSubmit()">确定并发布</el-button>

            </div>


          </el-form>
        </div>
      </div>
    </div>


    <div style="width: 100%;height: calc(100vh - 62px);">


      <MdEditor style="width: 100%;height: calc(100vh - 72px);" v-model="ruleForm.article_content"
        @on-upload-img="onUploadImg" />
    </div>
  </div>
  <!-- <v-md-editor  height="100vh" :disabled-menus="[]" @upload-image="handleUploadImage"/> -->
</template>

<script setup>
  import { ref, reactive, onMounted, computed, nextTick, inject } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import ArticleCoverList from '@/components/backend/article_cover_list.vue';
  import {sendMsg} from '@/components/cross_tag_msg/crossTagMsg.js';
  import { MdEditor } from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';



  const route = useRoute();
  const router = useRouter();
  //使用 provide inject 代替getCurrentInstance
  const $verify = inject('$verify');
  const $getData = inject('$getData');
  const $postData = inject('$postData');
  const $message = inject('$message');

  const is_show_panel = ref(false);




  const onUploadImg = (files) => {
    console.log(files)
  }

  const article_title_input = ref('');



  //点击栏目单选框选中值
  function checkColumnRadioInfo(val) {
    // console.log('checkColumnRadioInfo =',val);
    //显示栏目下标签
    options_tags_data.value = response_tags_data.value.filter(tag => tag.menu_id === val);
  }



    //点击标签多选框选中值
    function checkTagsBoxInfo(val) {

      // 使用函数
      ruleForm.tag_ids_names = findTagNamesById(ruleForm.tag_ids, options_tags_data.value);
      console.log('ruleForm.tag_ids_names:', ruleForm.tag_ids_names)
      console.log('checkTagsBoxInfo（val） =',val)
    }



  // dialogConfig 控制显示/隐藏封面图片列表
  const dialogConfig = reactive({
    is_show: false,
  })

  //接收子组件emit('success',id,path)，确认选中的封面图片id
  function SelectCover(cover_id, cover_path) {
    // console.log('SelectCover id='+cover_id); 
    // console.log('SelectCover path='+cover_path); 

    selected.cover_id = cover_id;
    selected.cover_path = cover_path;


  }


  const selected = reactive({
    cover_id: '',
    cover_path: '',
  })



  const ruleFormRef = ref();
  //初始化添加数据
  const ruleForm = reactive({
    article_id: 0,
    title: "",
    article_abstract: "",
    cover: "",
    tag_ids: [],
    tag_ids_names:'',
    author_name: "",
    menu_id: "",
    article_content: "",
    is_pulled:false

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


  //提交修改数据
  function clickSubmit() {
    //  valid 类型：布尔值 。fields 没有通过校验的字段，类型：对象
    ruleFormRef.value.validate((valid, fields) => {
      if (valid) {
        console.log("表单数据:", ruleForm)
        // 处理提交逻辑
        $postData('/data/backend/edit_article_data.json', ruleForm)
          .then(response => {
            //把修改或添加消息广播出去
            // const msg_content=response.action_success_data;
            if (route.query.action == "edit") {
              //模拟
              let msg_content = {
                article_id:route.query.id ?Number(route.query.id): 30,
                title: "edit-article",
                menu_title: "后端",
                cover: "/logo.png",
                is_pulled:ruleForm.is_pulled===true?1:0,
                // JavaScript数组转换为逗号分隔的字符串，可以使用join()方法。
                tag_ids:ruleForm.tag_ids.join(','),
                tag_ids_names:  ruleForm.tag_ids_names ?  ruleForm.tag_ids_names: '',
                visits: 1,
                word_count: 1000,
                read_time: "3:03",
                created_time: "1687938191",
                update_time: "1728874350",
              }


              sendMsg('edit-article', msg_content);
              $message('修改成功', 'success');

            } else if (route.query.action == "add") {
              //模拟
              let msg_content = {
                article_id: 999,
                title: "add-article",
                menu_title: "前端",
                cover: "/logo.png",
                is_pulled:ruleForm.is_pulled===true?1:0,
                // JavaScript数组转换为逗号分隔的字符串，可以使用join()方法。
                tag_ids: ruleForm.tag_ids.join(','),
                tag_ids_names:  ruleForm.tag_ids_names ?  ruleForm.tag_ids_names: '',
                visits: 1,
                word_count: 1000,
                read_time: "3:03",
                created_time: "1687938191",
                update_time: "1728874350",
              }


              sendMsg('add-article', msg_content);
              $message('添加成功', 'success');

            }

          })
          .catch(error => {
            // console.log(' getPageLayoutData()=>error:',error)
            $message('请求未找到', 'error');
            // $message('请求未找到', 'error');
          });

      } else {
        // 有字段没有通过验证
        let obj = Object.keys(fields)[0];
        //使用formEl.scrollToField方法来焦点定位并滚动到特定的表单字段,这里跳到第一个字段
        ruleFormRef.value.scrollToField(obj);
        $message('输入数据有误，请检查', 'warning');
        return false;
      }
    });


  }



  //获取编辑id的数据
  function getEditCurrentIdData(edit_current_id_data) {
    $postData('/data/backend/edit_article_data.json', edit_current_id_data)
      .then(response => {

        ruleForm.article_id = response.article_id;
        ruleForm.title = response.title;
        ruleForm.article_abstract = response.article_abstract;
        ruleForm.cover = response.cover;
        ruleForm.tag_ids = response.tag_ids.length > 0 ? response.tag_ids.split(',').map(Number) : '';
        /*String.prototype.split方法来将字符串按照指定的分隔符拆分为数组。
        将数组转换为数字类型的数组，使用Array.prototype.map方法*/
        ruleForm.author_name = response.author_name;
        ruleForm.menu_id = response.menu_id;
        ruleForm.article_content = response.article_content;
        ruleForm.is_pulled = response.is_pulled;

         //模拟数据 id=route.query.id
    ruleForm.article_id = route.query.id;

      })
      .catch(error => {
        // console.log(' getPageLayoutData()=>error:',error)
        $message('请求未找到', 'error');
        // $message('请求未找到', 'error');
      });

  }



  //栏目数据
  const options_menu_data = ref();
  //标签数据
  const options_tags_data = ref();
  //页面框架数据的标签数据
  const response_tags_data = ref();



  // 获取页面框架数据
  function getAddOrEditPageLayoutData() {


    $getData('/data/backend/article_page_layout_data.json')
      .then(response => {

        options_menu_data.value = response.options_menu_data;
        response_tags_data.value = response.options_tags_data;
        if (ruleForm.menu_id) {

          options_tags_data.value = response_tags_data.value.filter(tag => tag.menu_id === ruleForm.menu_id);
        } else {
          //使用数组的解构赋值方式获取栏目第一个元素 
          const [firstElement] = options_menu_data.value;
          ruleForm.menu_id = firstElement.menu_id;
          options_tags_data.value = response_tags_data.value.filter(tag => tag.menu_id === firstElement.menu_id);
        }


      })
      .catch(error => {
        // console.log(' getPageLayoutData()=>error:',error)
        $message('请求未找到', 'error');
        // $message('请求未找到', 'error');
      });

  }


  const page_title=ref('');
  onMounted(() => {


    if (Object.keys(route.query).length > 0) {
      //如果是action=="edit"，那么获取当前编辑id数据
      if (route.query.action == "edit") {
        getEditCurrentIdData(route.query);
        getAddOrEditPageLayoutData();
        page_title.value='编辑文章';
      } else if (route.query.action == "add") {
        getAddOrEditPageLayoutData();
        page_title.value='添加文章';
      } else {
        $message('非法操作', 'error');
        router.push({ path: '/404' });//重定向到404页面
        return;
      }


    } else {
      $message('非法请求', 'error');
    }
  });



  

  /*
  js数据处理:根据字符串tag_id数组,递归找到另一个对象数组里对应tag_id项所对应的tag_name
  使用JavaScript中的String.prototype.replace()方法来去除字符串中的第一个逗号。
  */
  function findTagNamesById(ids, data){
  // return ids.map(id => {
  //   const item = data.find(item => item.tag_id === id);
  //   return item ? item.tag_name : null; // 如果找不到对应的项，返回null或者其他默认值
  // });


//   let tag_name_array=[];

// ids.map(id => {
//  const item = data.find(item => item.tag_id === id);
//   item ?tag_name_array.push(item.tag_name) : null; // 如果找不到对应的项，返回null或者其他默认值
// });


// return tag_name_array;


  let tag_name_string='';

   ids.map(id => {
    const item = data.find(item => item.tag_id === id);
     item ?tag_name_string +=","+item.tag_name : null; // 如果找不到对应的项，返回null或者其他默认值
  });

  tag_name_string = tag_name_string.replace(/^,/, '');

  return tag_name_string;


};



</script>


<style scoped>

:deep(.el-textarea__inner ){
min-height: 100% !important;
}

  .panel {
    position: absolute;
    margin: 1.8rem -3rem 0 0;
    /* top: 50%; */
    transform: translate(-15%, 53%);
    right: 0;
    width: 560px;
    font-size: 1.2rem;
    white-space: nowrap;
    color: #909090;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 2px;
    -webkit-box-shadow: 0 1px 2px #f1f1f1;
    box-shadow: 0 1px 2px #f1f1f1;
    cursor: default;
    z-index: 100;

  }


  .panel:before {
    content: "";
    position: absolute;
    margin-left: -.5rem;
    top: -.6rem;
    right: 1rem;
    width: 1rem;
    height: 1rem;
    background-color: #fff;
    border: 1px solid #ddd;
    border-right: none;
    border-bottom: none;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg)
  }

  .panel .title {
    padding: 24px 20px 16px 20px;
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    color: #1d2129;
    border-bottom: 1px solid #e5e6eb
}

  .article-title-input {
    :deep(.el-input__wrapper) {
      align-items: center;
      border: none;
      outline: none !important;
      box-shadow: none;

      margin: 0;
      padding: 0;
      font-size: 24px;
      font-weight: 500;
      color: #1d2129;

    }
  }

  /* :deep(.el-checkbox-button__inner){
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    margin-right:10px ;
    font-size: 12px;
  

} */

  .form_info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--card_bg);


    .left {
      width: 40%;

    }

    .right {
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

  .cover_card {
    margin: 0px 0px 0px 0px;
    padding: 0px 0px 0px 0px;
    width: 200px;
    height: 115px;
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    .cover_img {
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

  .bottom-button {

    /* width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px; */

    display: flex;
    border-top: 1px solid #e5e6eb;
    height: 72px;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    align-items: center;
    justify-content: end;

    padding: 0 20px
  }


  .page_title_container {
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: space-between;  /* 水平间隔 */
  height: 100px; /* 容器高度 */
  .title {
  text-align: center;
  flex: 1; /* 占据剩余空间 */
}

.line {
  flex: 1; /* 占据剩余空间 */
  border-top: 2px solid #999999; /* 横线样式 */
  margin: 0 10px; /* 横线外边距 */
}
}

  
</style>