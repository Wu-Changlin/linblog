<template>
  <div class="page-container">
    <div class="page-search">
  
      <slot name="query">
  

 
      <el-form  :model="query_form_data">
        <div style="display: flex;flex-direction: column;">
        <el-form-item>
        <el-input v-model="query_form_data.nike_name" placeholder="搜索用户昵称" style="width: 200px">
        </el-input>
      </el-form-item>
        <el-form-item>
        <el-select  style="width: 200px" v-model="query_form_data.role" placeholder="请选择">
          <el-option v-for="item in options" :key="item.role" :label="item.label" :value="item.role" />
        </el-select>
      </el-form-item>

        <el-form-item>
        <div style="width: 100%;">
          <el-button type="primary" @click="queryInputData()">查询</el-button>
          <el-button type="primary" @click="resetTableData()">重置</el-button>
        </div>
        
        </el-form-item>
      </div>
      </el-form>
      </slot>
  

    </div>

    <div class="table-actions">
      <slot name="add">
        <!-- <el-button type="primary"  @click="addUserDialog">添加用户</el-button> -->
      </slot>

      <slot name="batchRemove">
        <el-button type="danger" v-if="data.selectedRowKeys.length > 0" @click="batchRemove()">批量删除</el-button>
      </slot>
    </div>




    <div class="table-container">
      <el-table class="custom-table-bg" :data="tableData()" style="width: 100%" :row-key="
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
            <el-table-column :prop="item.prop" :label="item.label" :key="item.key">
              <!-- 图片列特殊处理 start-->
              <template #default="scope">
                <slot :name="item.prop" :row="scope.row" :index="scope.$index"></slot>
              </template>
              <!-- 图片列特殊处理 start-->
            </el-table-column>
          </template>
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
  import { ref, reactive, inject,computed } from "vue";
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
    tableHeader:{// 表头数据由父页面传递而来
      type: Array
    },
    
    parentPagePaginationData:{// 分页数据由父页面传递而来
      type: Object
    },
   
  });
  // 
  
    //传递事件
    const emit = defineEmits(['queryCurrentActiveInputData','filterCurrentActiveValue','batchRemoveCurrentActiveIds','deleteCurrentActiveId'])


  //查询当前活动的输入数据
const query_form_data = reactive({
  nike_name: '',
  role: '',
})


//执行查询当前活动的输入数据
    function queryInputData(){
      console.log("查询当前活动的输入数据:",query_form_data)
    }


  //搜索框值
  const search_nike_name = ref("");

  //搜索字段值关键字
  function searchKeyword() {
    // console.log("search_nike_name.value ="+search_nike_name.value);
    data.tableData = data.tableData.filter(
      (item) => item.nike_name === search_nike_name.value
    );
    tableData();
 
    console.log("data.tableData =" + JSON.stringify(data.tableData));
    // tableData.value = tableData.value.filter(v =>v.name.includes(name.value))
  }

  //角色选择器下拉框选项change触发事件
  function filterData(value) {
    //console.log('filterData val='+value);
    let filterDataShow = [];
    //this.currentPage = 1; //将当前页设置为1，确保每次都是从第一页开始搜
    //筛选出tableData中，role值与子组件传入的value值相等的条目，并赋值给空数组
    data.tableData = data.tableData.filter((item) => item.role === value);

    console.log("data.tableData =" + JSON.stringify(data.tableData));

    //筛选出tableData中，role值与子组件传入的value值相等的条目，并赋值给空数组
    // if (value == undefined) {
    //   this.filterDataShow = this.tableData
    // }
  }

  const value = ref("");
  const options = [
    {
      role: 1,
      label: "管理员",
    },
    {
      role: 2,
      label: "普通用户",
    },
  ];

  //表头操作单行或多行批量删除
  function batchRemove() {
    let tableData = data.tableData;
    let removeBatchId = [];
    //console.log('batchRemove = '+ JSON.stringify(data.selectedRowKeys))
    data.selectedRowKeys.forEach((Ele, index) => {
      //console.log(Ele.date);
      for (var i = 0; i < tableData.length; i++) {
        var t = tableData[i][id_name.value];
        if (t == Ele[id_name.value]) {
          removeBatchId.push(Ele[id_name.value]);
          console.log("Ele[id_name.value]:",Ele[id_name.value]);
          //如果原始数据中的id等于选中数据id，那么执行删除
          tableData.splice(i, 1); //删除原始数据数组中选中数据id索引
        }
      }
    });

    //发送批量删除id到接口
    //发出删除对象数据id到父页面进行请求删除操作
    emit('batchRemoveCurrentActiveIds',removeBatchId);
  
    //重置表格数据

    //消息通知 四种不同类型的提醒框 success、warning、info 和error

    // $message('批量删除成功', 'success');
  }

  
  
 
   //表格内操作删除单行数据
   function deleteData(index,delete_obj_data) {
    //获取删除对象数据id
    let delete_obj_id=delete_obj_data[id_name.value];
     //删除原始数据数组中选中数据id索引
    data.tableData.splice(index, 1);
    //发出删除对象数据id到父页面进行请求删除操作
    emit('deleteCurrentActiveId',delete_obj_id);
    $message('删除成功', 'success');
  }


  //更新用户信息
  function updateUser(id) {
    //console.log('updateUser id= '+id)
  }

  //操作功能 end

  //当选择项发生变化时会触发该事件（用户选中或取消选中表格某行数据）
  const handleSelectionChange = (val) => {
    data.selectedRowKeys = val;
    console.log("handleSelectionChange=", data.selectedRowKeys)
  };

  //表格数据
  const data = reactive({
    tableData:[],
    selectedRowKeys: [],
  });


    // //把由父页面传递而来表格内容数据赋值到当前页面的data.tableData(赋值仅执行1次)
    if(props.parentPageTableData){
      //初始化表格数据
    initTableData();
    // data.tableData=computed(() => props.parentPageTableData);
    }

   //初始化表格数据赋值
    function initTableData(){
      data.tableData=props.parentPageTableData;
    }

    

  

  //表格用到的参数
/*页码相关参数 开始*/ 
  //保存初始化数据
let initPaginationData = {
  current_page: 1, //当前页数
  current_page_limit: 10, // 每页显示个数选择器的选项设置
  total_count: 0, //总个数
}


   //把由父页面传递而来分页数据赋值到当前页面的initPaginationData(赋值仅执行1次)
   if(props.parentPagePaginationData){
    //初始化赋值
    initPagination();
    }

    //初始化赋值
    function initPagination(){
      initPaginationData = { ...props.parentPagePaginationData };
    }

/*
reactive({...initPaginationData}); 这行代码的意思是创建一个响应式的数据对象。
这里，initPaginationData 是一个初始化分页数据的对象，它可能包含了一些基本的分页信息，如当前页、每页显示条数等。
通过 reactive() 函数，这些数据被包装成一个响应式对象，任何对 initPaginationData 对象的修改都会自动反映到视图上。
*/
//使用展开运算符合并
const pagination =  reactive({...initPaginationData});
//重置分页数据函数
const resetPaginationData = () => {
  // Object.assign(initPaginationData,pagination);
  Object.assign(pagination,initPaginationData);
}

  /*页码相关参数 结束*/ 


  //size-change	page-size 每页显示个数选择器的选项设置改变时触发
  const handleSizeChange = (val) => {
    console.log(`每页${val}个`);
    pagination.current_page_limit = val;
    //将当前页设置为1，确保每次都是从第一页开始
    pagination.current_page = 1;
    router.push({ name:route.name, query: { current_page:1,current_page_limit:pagination.current_page_limit}, key: new Date().getTime() });
    tableData();
  };
  //current-change	current-page 当前页数改变时触发
  const handleCurrentChange = (val) => {
    console.log(`当前页数: ${val}`);
    pagination.current_page = val;
    //  /index ===>  /index?tag_id=Java  路由携参跳转（当前页只添加路由参没有跳转）
    //如果没有查询数据，执行默认
    if(query_form_data){
      
      let query_data={ ...pagination, ...query_form_data };
       query_data = removeEmptyValues(query_data);
      console.log(`query_data,`,query_data);
      // router.push({ name:route.name, query: pagination, key: new Date().getTime() });
    }else{
    router.push({ name:route.name, query: { current_page:pagination.current_page,current_page_limit:pagination.current_page_limit }, key: new Date().getTime() });

     

    }


    tableData();
  };

  //重置表格数据
 function resetTableData(){
  //初始分页数据
  initPagination();
  //重置分页数据函数
  resetPaginationData();
  //初始化表格数据赋值
  initTableData();
  //更新目前表格显示数据
  tableData();
 }

  //目前表格显示数据
  const tableData = () => {
   
    return data.tableData.filter(
      (item, index) =>
        index < pagination.current_page * pagination.current_page_limit &&
        index >= pagination.current_page_limit * (pagination.current_page - 1)
    );

   

  };

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
  }

  :deep(.el-table__header-wrapper thead th) {
    background-color: var(--bg);
  }


  /* 修改前后箭头未点击时的背景颜色 */
  :deep .el-pagination .btn-prev,
  :deep .el-pagination .btn-next {
    background-color: #0e3a90 !important;
  }

  /* 修改未点击时的数字方块背景颜色 */
  :deep .el-pagination .el-pager li:not(.active):not(.disabled):hover {
    background-color: #75fbff !important;
  }

  /* 未点击时的数字方块背景颜色 */
  :deep .el-pagination .el-pager li:not(.active):not(.disabled) {
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

    .table-img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      justify-content: center;
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