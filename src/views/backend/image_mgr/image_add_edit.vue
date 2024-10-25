<template>

  <div class="page_title_container">
    <div class="line"></div>
    <div class="title">
      {{ page_title}}
    </div>
    <div class="line"></div>
  </div>

  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm"
    label-position="left">
    <el-form-item label="标签名" prop="img_name">
      <el-input v-model="ruleForm.img_name" placeholder="亲，请输入用户昵称"></el-input>
    </el-form-item>

    <el-form-item label="上传图片" prop="img_path" style="width: 100%;height: 600px;">
      <input type="file" @change="handleImageUpload" />

      <div class="carousel-container" ref="carouselContainerRef">

        <div class="carousel-content">
          <div class="carousel-inner">
            <div class="item">
              <canvas ref="canvas" @click="getColorAtClickPosition($event)"></canvas>
            </div>
          </div>
        </div>

        <div class="vui-carousel" :style="{backgroundColor:vui_carousel_color}">

          <div class="l-box">
            <div class="title">测试标题内容</div>
          </div>

          <div class="r-box">

            <ul class="dots">
              <li :class="[index==1?'pacman':'dot',index==1?'l':'']" v-for="(item,index) in 2">
                <!-- 吃豆人 -->
                <div v-if="index==1"></div>
                <div v-if="index==1"></div>
              </li>
            </ul>

          </div>

        </div>
      </div>
    </el-form-item>

    <el-form-item label="下架" prop="is_pulled">
      <el-switch v-model="ruleForm.is_pulled" inline-prompt active-text="是" inactive-text="否" />
    </el-form-item>


    <el-form-item label="类型" prop="img_type">
      <el-radio-group v-model="ruleForm.img_type">
        <el-radio v-for="item in options_img_type_data" :key="item.img_type" :value="item.img_type"> {{
          item.img_type_name }}</el-radio>
      </el-radio-group>
    </el-form-item>


    <el-form-item>
      <div style="width: 100%;">
        <el-button type="primary" @click="clickSubmit()">提交</el-button>
      </div>

    </el-form-item>

  </el-form>
</template>

<script setup>
  import { ref, reactive, onMounted, computed, nextTick, inject } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import ArticleCoverList from '@/components/backend/article_cover_list.vue';
  import { sendMsg } from '@/components/cross_tag_msg/crossTagMsg.js';


  const route = useRoute();
  const router = useRouter();
  //使用 provide inject 代替getCurrentInstance
  const $verify = inject('$verify');
  const $message = inject('$message');



  //监听图片上传
  const canvas = ref(null);
  const carouselContainerRef = ref(null);
  const vui_carousel_color = ref('');

  function handleImageUpload(event) {
    const image = event.target.files[0];
    const img = new Image();
    img.onload = () => {
      // 设置轮播图元素的宽度和高度
      carouselContainerRef.value.style.width = img.width + 'px';
      carouselContainerRef.value.style.height = img.height + 'px';
      // 设置画布元素的宽度、高度及相关属性
      const ctx = canvas.value.getContext('2d');
      canvas.value.width = img.width;
      canvas.value.height = img.height;
      ctx.drawImage(img, 0, 0);
      // getColorsFromCanvas();
    };
    img.src = URL.createObjectURL(image);

    console.log('canvas.value.image:', image)



  };


  function getColorAtClickPosition(event) {
    // Multiple readback operations using getImageData are faster with the willReadFrequently attribute set
    // HTML Canvas2D：设置willReadFrequently属性为true可加快多个getImageData读取操作的速度
    // HTML Canvas2D中的willReadFrequently属性是一个布尔值，用于控制是否将图像数据缓存在GPU内存中，当设置为true时，浏览器会尽量将图像数据缓存在GPU内存中，从而提高多个getImageData读取操作的速度。

    const context = canvas.value.getContext('2d', { willReadFrequently: true });
    const rect = canvas.value.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const imgData = context.getImageData(x, y, 1, 1);
    const data = imgData.data;
    const r = data[0];
    const g = data[1];
    const b = data[2];
    const a = data[3];
    vui_carousel_color.value = `rgba(${r}, ${g}, ${b}, ${a}) !important`;
    console.log(`Clicked RGBA: (${r}, ${g}, ${b}, ${a})`);
    console.log(`vui_carousel_color.value: (${vui_carousel_color.value})`);
  };



  //表单ref
  const ruleFormRef = ref();
  //初始化添加数据
  const ruleForm = reactive({
    tag_id: 0,
    menu_id: '',
    menu_name: "",
    menu_title: "",
    tag_name: "",
    tag_keywords: "",
    tag_description: "",
    is_pulled: false,
  })



  //栏目选择器的选中值
  function selectColumnInfo(val) {

    // 查找相等id返回menu_title。find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
    const current_active_menu_id_data = options_img_type_data.value.find(menu => menu.menu_id === ruleForm.menu_id);
    ruleForm.menu_title = current_active_menu_id_data.menu_title;
    // console.log('ruleForm. ruleForm.menu_title:',ruleForm.menu_title)
    // console.log('selectColumnInfo（val） =',val)
  }


  //校验
  const rules = {
    email: [
      { required: true, message: "请输入邮箱" },
      { maxlength: 150, message: "邮箱长度超限" },
      // { validator: proxy.$verify.email, message: "邮箱格式有误" },
    ],
  };

  //提交修改数据
  function clickSubmit() {
    //valid 类型：布尔值 。fields 没有通过校验的字段，类型：对象
    ruleFormRef.value.validate((valid, fields) => {
      if (valid) {
        console.log("表单数据:", ruleForm)
        // 处理提交逻辑
        $postData('/data/backend/edit_tag_data.json', ruleForm)
          .then(response => {
            //把修改或添加消息广播出去
            // const msg_content=response.action_success_data;
            if (route.query.action == "edit") {
              //模拟
              let msg_content = {
                tag_id: route.query.id ? Number(route.query.id) : 1,
                menu_id: ruleForm.menu_id,
                menu_name: ruleForm.menu_name,
                menu_title: ruleForm.menu_title,
                tag_name: ruleForm.tag_name,
                tag_keywords: ruleForm.tag_keywords,
                tag_description: ruleForm.tag_description,
                is_pulled: ruleForm.is_pulled === true ? 1 : 0,
                account_status: "edit-tag",
                created_time: "1687938191",
                update_time: "1728874350",
              }


              sendMsg('edit-tag', msg_content);
              $message('修改成功', 'success');

            } else if (route.query.action == "add") {
              //模拟
              let msg_content = {
                tag_id: 999,
                menu_id: ruleForm.menu_id,
                menu_name: ruleForm.menu_name,
                menu_title: ruleForm.menu_title,
                tag_name: ruleForm.tag_name,
                tag_keywords: ruleForm.tag_keywords,
                tag_description: ruleForm.tag_description,
                is_pulled: ruleForm.is_pulled === true ? 1 : 0,
                account_status: "edit-tag",
                created_time: "1687938191",
                update_time: "1728874350",
              }


              sendMsg('add-tag', msg_content);
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


  function getEditCurrentIdData(edit_current_id_data) {
    $postData('/data/backend/edit_tag_data.json', edit_current_id_data)
      .then(response => {

        ruleForm.tag_id = response.tag_id;
        ruleForm.menu_id = response.menu_id;
        ruleForm.menu_name = response.menu_name;
        ruleForm.menu_title = response.menu_title;

        ruleForm.tag_name = response.tag_name;
        ruleForm.tag_keywords = response.tag_keywords;
        ruleForm.tag_description = response.tag_description;
        ruleForm.is_pulled = response.is_enable == 1 ? true : false;

        //模拟数据 id=route.query.id
        ruleForm.menu_id = route.query.id;

      })
      .catch(error => {
        // console.log(' getPageLayoutData()=>error:',error)
        $message('请求未找到', 'error');
        // $message('请求未找到', 'error');
      });

  }



  //选择器数据
  const options_img_type_data = ref([]);

  // 获取页面框架数据
  function getAddOrEditPageLayoutData() {


    $getData('/data/backend/tag_page_layout_data.json')
      .then(response => {

        options_img_type_data.value = response.options_img_type_data;

      })
      .catch(error => {
        // console.log(' getPageLayoutData()=>error:',error)
        $message('请求未找到', 'error');
        // $message('请求未找到', 'error');
      });

  }

  const page_title = ref('');
  onMounted(() => {


    if (Object.keys(route.query).length > 0) {
      //如果是action=="edit"，那么获取当前编辑id数据
      if (route.query.action == "edit") {
        getEditCurrentIdData(route.query);
        getAddOrEditPageLayoutData();

        page_title.value = '编辑图片';
      } else if (route.query.action == "add") {
        getAddOrEditPageLayoutData();
        page_title.value = '添加图片';

      } else {
        $message('非法操作', 'error');
        router.push({ path: '/404' });//重定向到404页面
        return;
      }


    } else {
      $message('非法请求', 'error');
    }
  });

</script>


<style scoped>
  .page_title_container {
    display: flex;
    align-items: center;
    /* 垂直居中 */
    justify-content: space-between;
    /* 水平间隔 */
    height: 100px;

    /* 容器高度 */
    .title {
      text-align: center;
      flex: 1;
      /* 占据剩余空间 */
    }

    .line {
      flex: 1;
      /* 占据剩余空间 */
      border-top: 2px solid #999999;
      /* 横线样式 */
      margin: 0 10px;
      /* 横线外边距 */
    }
  }


  .carousel-container {
    padding: 0;
    width: 100%;
    margin: 0;
  }

  /* 轮播图 开始*/
  .carousel-content {
    width: 100%;
    height: 0;
    /* 宽高比 16/9 */
    padding-top: 56.25%;
    position: relative;
    overflow: hidden;

  }

  .carousel-inner {
    width: 100%;
    position: absolute;
    inset: 0;
    display: flex;
    transition: transform 1s ease-in-out;

  }


  .item {
    flex: 0 0 100%;

  }

  .carousel-inner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }


  /* 轮播图底部交互 开始*/
  .vui-carousel {
    display: flex;
    /* 计算底部区域高度 */
    /* height: 100%; */
    /* --b-color是自定义属性，接口返回进行动态赋值 */
    --b-color: rgba(0, 0, 0);
    background-color: var(--b-color);
    color: var(--text);
    /* 相对定位 */
    position: relative;
  }



  /* 图片底部的渐变部分 */
  .vui-carousel::before {
    content: "";
    width: 100%;
    height: 50px;
    /* 背景渐变（透明——底部区域同色，上到下） */
    background: linear-gradient(to bottom, transparent, var(--b-color));
    /* 绝对定位 位置上移它的高度 */
    position: absolute;
    top: -50px;
    /* 确保了伪元素不会接收或阻止鼠标事件，从而允许父元素接收到点击事件。 */
    pointer-events: none;
  }

  /* 底部区域的左侧部分 */
  .vui-carousel .l-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 12px;
    width: 100%;
  }

  .vui-carousel .title {
    width: 100%;
    font-size: 18px;
    line-height: 25px;
    /* 标题不换行，溢出显示省略号 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .vui-carousel .dots {
    display: flex;
    margin-top: 13px;
    margin-right: 0;
  }

  /* 指示器（小圆点） */
  .vui-carousel li {
    width: 8px;
    height: 8px;
    background-color: rgba(128, 128, 128, 0.7);
    margin: 4px;
    border-radius: 50%;
    cursor: pointer;
  }

  /* 指示器选中态（吃豆人） */
  .vui-carousel li.pacman {
    position: relative;
    width: 14px;
    height: 14px;
    background-color: transparent;
    margin-top: 1px;
  }

  /* 吃豆人由两个div组成 */
  .vui-carousel li.pacman div {
    width: 0;
    height: 0;
    border: 7px solid var(--vui_carousel_bg);
    border-radius: 50%;
    border-right-width: 7px;
    border-right-color: transparent;
    /* 绝对定位 两个重合 */
    position: absolute;
  }

  /* 吃豆人朝向左 */
  .vui-carousel li.pacman.l {
    transform: rotate(180deg);
  }

  /* 接下来分别为吃豆人的两个部分设置动画 */
  .vui-carousel li.pacman div:nth-child(1) {
    /* 执行动画：动画名 时长 线性的 停留在最后一帧 */
    animation: pacman1 0.75s linear forwards;
  }

  .vui-carousel li.pacman div:nth-child(2) {
    animation: pacman2 0.75s linear forwards;
  }

  /* 底部区域的右侧部分 */
  .vui-carousel .r-box {
    display: flex;
    margin-right: 10px;
  }


  /* 定义吃豆人动画 */
  @keyframes pacman1 {
    0% {
      transform: rotate(360deg);
    }

    40% {
      transform: rotate(270deg);
    }

    60% {
      transform: rotate(360deg);
    }

    100% {
      transform: rotate(270deg);
    }
  }

  @keyframes pacman2 {
    0% {
      transform: rotate(0deg);
    }

    40% {
      transform: rotate(90deg);
    }

    60% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(90deg);
    }
  }

  /* 轮播图底部交互 结束*/

  /* 轮播图 结束*/
</style>