<template>
  <div class="page-container">
    <div class="page-search">

      <slot name="query">
        <!-- <el-form>查询表单</el-form> -->
      </slot>


    </div>

    <div class="table-actions">
      <slot name="add">
        <!-- <el-button type="primary"  @click="addUserDialog">添加用户</el-button> -->
      </slot>

      <slot name="batchRemove">
        <el-button type="danger" v-if="data.selectedData.length > 0" @click="batchRemove()">批量删除</el-button>
      </slot>
    </div>




    <div class="table-container">
      <el-table class="custom-table-bg" :data="data.tableData" style="width: 100%" :row-key="
          (row) => {
            return row[id_name];
          }
        " @selection-change="handleSelectionChange">
        <!-- 单选多选框 -->
        <el-table-column type="selection" :reserve-selection="true" />
        <el-table-column type="index" label="序号" />
        <!-- 自定义表头 start-->
        <template v-for="(item, index) in tableHeader">
          <template v-if="item.scopedSlot">
            <el-table-column width="200" align="center" :prop="item.prop" :label="item.label" :key="item.key">
              <!-- 图片列特殊处理 start-->
              <template #default="scope">
                <!-- <slot :name="item.prop" :row="scope.row" :index="scope.$index"></slot> -->
                <slot :name="item.prop" :row="scope.row" :index="scope.$index"></slot>
              </template>

              
              <!-- 图片列特殊处理 start-->
            </el-table-column>
          </template>
          
            <!-- 标签列特殊处理 start-->
            <!-- <template v-else-if="item.key==='tag_ids_names'">
              <el-table-column width="240" :prop="item.prop" :label="item.label" :key="item.key">
                <template #default="scope">
                  <el-tag
                  v-for="(tag, index) in scope.row.tag_ids_names"
                  :key="index"
                
                  :prop="item.tag" 
                  :label="item.tag" 
                  size="small">
                  {{ tag }}
                </el-tag>

          </template>
        </el-table-column>
      </template> -->
              
          

          <template v-else>
            <el-table-column :prop="item.prop" :label="item.label" :key="item.key" />
          </template>
        </template>
        <!-- 自定义表头 end-->
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <div>
              <slot name="edit" :active_data="scope.row[id_name]">
                <el-button size="small" type="primary">编辑</el-button>
              </slot>

              <el-popconfirm :fallback-placements="['bottom', 'top']" confirm-button-text="确认" cancel-button-text="取消"
                title="确实要从表中删除此项吗?" @confirm="deleteData(scope.$index, scope.row)">
                <template #reference>
                  <el-button size="small" type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="bottom-pages">
      <!-- 	layout 组件布局，子组件名用逗号分隔 sizes, prev, pager, next, jumper, ->, total-->
      <el-pagination v-model:page-size="pagination.current_page_limit" v-model:current-page="pagination.current_page"
        :page-sizes="[5,10,20,30]" background layout="total, prev, pager, next, sizes" :total="pagination.total_count"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>
<script setup>
  import { ref, reactive, inject, computed } from "vue";
  import { useRoute, useRouter } from "vue-router";
  const route = useRoute();
  const router = useRouter();
  //使用 provide inject 代替getCurrentInstance
  const $message = inject('$message');

  //获取页面名称前缀用于拼接各页面的id名：使用slice方法，是从开始到"_"的位置之。
  let prefix_name = route.name.slice(0, route.name.indexOf('_'));
  const id_name = ref(prefix_name + '_id');

  const props = defineProps({
    parentPageTableData: {//表格内容数据由父页面传递而来
      type: Array
    },
    tableHeader: {// 表头数据由父页面传递而来
      type: Array
    },

    parentPagePaginationData: {// 分页数据由父页面传递而来
      type: Object
    },

  });

  //表格数据
  const data = reactive({
    tableData: [],
    selectedData: [],
  });

  /*计算属性也有缓存效果，可以监听数值是否发生改变，改变了，才能触发重新计算。*/
  //该 prop 变更时计算属性也会自动更新，更新表格数据
  data.tableData = computed(() => props.parentPageTableData);

  /*分页器数据定义和计算属性 开始*/

  //分页器数据定义

  const init_pagination= computed(() => props.parentPagePaginationData);


  const pagination = reactive({
    current_page: 1, //当前页数
    current_page_limit: 10, // 每页显示个数选择器的选项设置
    total_count: 0, //总个数
  })

  /*
  get时是跟双向绑定的数据有关，当那个数据变化的时候就触发一下get，进行的一些处理（更新值）。
  set时就是处理当改数据变化时，进行的一些处理（重新赋值）。
  */
  // 分页器数据计算属性   来自 prop，
  pagination.current_page = computed({
    get() {
      return init_pagination.value.current_page; // Getter
    },
    set(newValue) {
      init_pagination.value.current_page=newValue; // Setter
    }
  });

  pagination.current_page_limit = computed({
    get() {
      return init_pagination.value.current_page_limit; // Getter
    },
    set(newValue) {
      init_pagination.value.current_page_limit=newValue; // Setter
    }
  });


  pagination.total_count = computed(() => props.parentPagePaginationData.total_count);
  /*分页器数据定义和计算属性 结束*/



  //传递事件
  const emit = defineEmits(['getPaginationChangeData', 'batchRemoveCurrentActiveIds', 'deleteCurrentActiveId']);


  //表头操作单行或多行批量删除
  function batchRemove() {
    let tableData = data.tableData;
    let removeBatchId = [];
    //console.log('batchRemove = '+ JSON.stringify(data.selectedData))
    data.selectedData.forEach((Ele, index) => {
      //console.log(Ele.date);
      for (var i = 0; i < tableData.length; i++) {
        var t = tableData[i][id_name.value];
        if (t == Ele[id_name.value]) {
          removeBatchId.push(Ele[id_name.value]);
          // console.log("Ele[id_name.value]:", Ele[id_name.value]);
          //如果原始数据中的id等于选中数据id，那么执行删除
          tableData.splice(i, 1); //删除原始数据数组中选中数据id索引
        }
      }
    });

    //发送批量删除id到接口
    //发出删除对象数据id到父页面进行请求删除操作
    emit('batchRemoveCurrentActiveIds', removeBatchId);

    //消息通知 四种不同类型的提醒框 success、warning、info 和error
    $message('批量删除成功', 'success');
  }


  //表格内操作删除单行数据
  function deleteData(index, delete_obj_data) {
    //获取删除对象数据id
    let delete_obj_id = delete_obj_data[id_name.value];
    //删除原始数据数组中选中数据id索引
    data.tableData.splice(index, 1);
    //发出删除对象数据id到父页面进行请求删除操作
    emit('deleteCurrentActiveId', delete_obj_id);
    $message('删除成功', 'success');
  }


  //更新用户信息
  function updateUser(id) {
    //console.log('updateUser id= '+id)
  }

  //操作功能 end

  //当选择项发生变化时会触发该事件（用户选中或取消选中表格某行数据）
  const handleSelectionChange = (val) => {
    data.selectedData = val;
    // console.log("handleSelectionChange=", data.selectedData);
  };

  //size-change	page-size 每页显示个数选择器的选项设置改变时触发
  const handleSizeChange = (val) => {
    // console.log(`每页${val}个`);
    pagination.current_page_limit = val;
    //将当前页设置为1，确保每次都是从第一页开始
    pagination.current_page = 1;
    // 每页显示个数更改或当前页数更改共享函数
    updatePageSizeOrCurrentPageCommunal();
  };
  //current-change	current-page 当前页数改变时触发
  const handleCurrentChange = (val) => {

    // console.log(`当前页数: ${val}`);

    pagination.current_page= val;
   
    // 每页显示个数更改或当前页数更改共享函数

    updatePageSizeOrCurrentPageCommunal();

  };

  // 每页显示个数更改或当前页数更改共享函数
  function updatePageSizeOrCurrentPageCommunal() {
   
    //发出分页器数据到父页面进行请求新表格数据
    emit('getPaginationChangeData', pagination);
  }

  //目前表格显示数据
  // const tableData = () => {
  //   return data.tableData;
  // };

  // 去除 JavaScript 对象中的空值和空对象
  function removeEmptyValues(obj) {
    let parsedObj = Object.keys(obj)
      .filter((key) => obj[key] !== null && obj[key] !== undefined && obj[key] !== '')
      .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
    return parsedObj;
  }

</script>

<style scoped>
  /* //表格内容颜色 */
  :deep(.el-table__body tbody tr) {
    background-color: var(--bg);
    /* text-align: center; */

  }

  /* 表头 */
  :deep(.el-table__header-wrapper thead th) {
    background-color: var(--bg);
    /* text-align: center; */
  }



  /* 修改前后箭头未点击时的背景颜色 */
  :deep(.el-pagination .btn-prev),
  :deep(.el-pagination .btn-next){
    background-color: #0e3a90 !important;
  }

  /* 修改未点击时的数字方块背景颜色 */
  :deep(.el-pagination .el-pager li:not(.active):not(.disabled):hover) {
    background-color: #75fbff !important;
  }

  /* 未点击时的数字方块背景颜色 */
  :deep(.el-pagination .el-pager li:not(.active):not(.disabled)) {
    background-color: #0e3a90 !important;
    color: #75fbff;
  }

  /* 修改默认的背景色 */
  :deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
    background-color: #75fbff !important;
    color: #01133c;
  }


  .page-container {
    margin-top: 72px;
    background-color: var(--bg);

    .page_search {
      padding: 10px;
      border-bottom: 1px solid var(--card_bg);
    }

    .table-actions {
      padding: 10px;

      .el-button {
        margin-right: 10px;
      }
    }

    .table-container {
      background-color: var(--bg);
    }

    .bottom-pages {
      display: flex;
      justify-content: center;
      padding: 10px;
      margin-bottom: 20px;
    }

  }

  .cover_card {
    width: 40px;
    height: 40px;
    border-radius: 50%;

    .cover_img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .el-icon.cover_card_icon {
      font-size: 28px;
      color: #8c939d;
      text-align: center;
    }
  }


  :deep(.table_img) {
    width: 100%;
    height: auto;
    /* border-radius: 10%; */
    /* justify-content: center; */
  }

  /* 搜索框
:deep(.el-input__wrapper){
background-color:var(--card_bg);
}
搜索按钮
:deep(.el-input-group__append){
background-color:var(--card_bg);

 } */

  /* 底部按钮区域 上边框 */
  :deep(.el-dialog__footer) {
    border-top: 1px solid var(--bg);
  }

  /* 标题区域 下边框 */
  :deep(.el-dialog__header) {
    border-bottom: 1px solid var(--bg);
  }

  /* :deep(.el-select-dropdown) {
  position: absolute !important;
    top: 50px !important;
    left: 0 !important;
  } */

  /* :deep(.el-select-dropdown) {
  position: absolute !important;
  left: 0px !important;
  top:0px !important;
 } */
</style>