<template>
  <div class="gvb_container">
    <div class="gvb_search">
      <slot name="search">
        <!-- <el-button type="primary"  @click="addUserDialog">添加用户</el-button> -->
        <el-input
          placeholder="搜索用户昵称"
          style="width: 200px"
          v-model="search_nike_name"
        >
          <template #append>
            <el-button @click="searchNikeName"><svg-icon style="width: 20;height: 20;" class="reds-icon" icon-class="search" /></el-button>
          </template>
        </el-input>
      </slot>

      <slot name="filter">
        <el-select v-model="value" placeholder="请选择" @change="filterData">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </slot>
    </div>

    <div class="gvb_actions">
      <slot name="add">
        <!-- <el-button type="primary"  @click="addUserDialog">添加用户</el-button> -->
      </slot>

      <slot name="batchRemove">
        <el-button
          type="danger"
          v-if="data.selectedRowKeys.length > 0"
          @click="batchRemove()"
          >批量删除</el-button
        >
      </slot>
    </div>


 

    <div class="gvb_tables">
      <el-table
      class="custom-table-bg"
        :data="data.tableData"
        style="width: 100%"
        :row-key="
          (row) => {
            return row.id;
          }
        "
        @selection-change="handleSelectionChange"
      >
        <!-- 单选多选框 -->
        <el-table-column type="selection" :reserve-selection="true" />
        <el-table-column type="index" label="序号" />
        <!-- 自定义表头 start-->
        <template v-for="(item, index) in tableHeader">
          <template v-if="item.scopedSlot">
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :key="item.key"
            >
              <!-- 图片列特殊处理 start-->
              <template #default="scope">
                <slot
                  :name="item.prop"
                  :row="scope.row"
                  :index="scope.$index"
                ></slot>
              </template>
              <!-- 图片列特殊处理 start-->
            </el-table-column>
          </template>
          <template v-else>
            <el-table-column
              :prop="item.prop"
              :label="item.label"
              :key="item.key"
            />
          </template>
        </template>
        <!-- 自定义表头 end-->
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <div>
              <slot name="edit">
                <el-button size="small" type="primary">编辑</el-button>
              </slot>

              <el-popconfirm
                :fallback-placements="['bottom', 'top']"
                confirm-button-text="确认"
                cancel-button-text="取消"
                title="确实要从表中删除此项吗?"
                @confirm="deleteUser(scope.$index, scope.row)"
              >
                <template #reference>
                  <el-button size="small" type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="gvb_pages">
      <!-- 	layout 组件布局，子组件名用逗号分隔 sizes, prev, pager, next, jumper, ->, total-->
      <el-pagination
        v-model:page-size="pagination.limit"
        v-model:current-page="pagination.page"
        :page-sizes="[1, 3, 5, 10]"
        background
        layout="total, prev, pager, next, sizes"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const props = defineProps({
  tableHeader: Array, // 表头数据由父组件传递而来
});

//搜索框值
const search_nike_name = ref("");

//搜索用户昵称
function searchNikeName() {
  // console.log("search_nike_name.value ="+search_nike_name.value);
  data.tableData = data.tableData.filter(
    (item) => item.nike_name === search_nike_name.value
  );
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
    value: "1",
    label: "管理员",
  },
  {
    value: "2",
    label: "普通用户",
  },
];

//批量删除
function batchRemove() {
  let tableData = data.tableData;
  let removeBatchId = [];
  //console.log('batchRemove = '+ JSON.stringify(data.selectedRowKeys))
  data.selectedRowKeys.forEach((Ele, index) => {
    //console.log(Ele.date);
    for (var i = 0; i < tableData.length; i++) {
      var t = tableData[i].id;
      if (t == Ele.id) {
        //如果原始数据中的id等于选中数据id，那么执行删除
        tableData.splice(i, 1); //删除原始数据数组中选中数据id索引
        removeBatchId.push(Ele.id);
      }
    }
  });

  //发送批量删除id到接口
  console.log("removeBatchId=" + removeBatchId);
  //重置表格数据

  //消息通知 四种不同类型的提醒框 success、warning、info 和error
  proxy.$message.success("成功删除");
}

//删除用户
function deleteUser(index, scoped) {
  // console.log('deleteUser index= '+index)
  // console.log('deleteUser scoped.id= '+scoped.id)
  data.tableData.splice(index, 1); //删除原始数据数组中选中数据id索引
  proxy.$message.success("成功删除");
  // deleteProduct(scoped.id);
}

//更新用户信息
function updateUser(id) {
  //console.log('updateUser id= '+id)
}

//操作功能 end

//当选择项发生变化时会触发该事件
const handleSelectionChange = (val) => {
  data.selectedRowKeys = val;
  // console.log("handleSelectionChange="+data.selectedRowKeys)
};

//表格数据
const data = reactive({
  tableData: [
    {
      id: 1,
      nike_name: "张一",
      avatar: "/public/avatar.png",
      email: "111@qq.com",
      role: "1",
      account_status: "正常",
      ip: "10.198.1.1",
      created_time: "1687938191",
      update_time: "1687938191",
      delete_time: "1687938191",
    },
    {
      id: 2,
      nike_name: "李二",
      avatar: "/public/avatar.png",
      email: "111@qq.com",
      role: "2",
      account_status: "注销",
      ip: "10.198.1.1",
      created_time: "1687938191",
      update_time: "1687938191",
      delete_time: "1687938191",
    },
    {
      id: 3,
      nike_name: "李三",
      avatar: "/public/avatar.png",
      email: "111@qq.com",
      role: "1",
      account_status: "锁定（密码输入错误超过3次，异常登陆）",
      ip: "10.198.1.1",
      created_time: "1687938191",
      update_time: "1687938191",
      delete_time: "1687938191",
    },
    {
      id: 4,
      nike_name: "赵四",
      avatar: "/public/avatar.png",
      email: "111@qq.com",
      role: "2",
      account_status: "停用",
      ip: "10.198.1.1",
      created_time: "1687938191",
      update_time: "1687938191",
      delete_time: "1687938191",
    },
    {
      id: 5,
      nike_name: "王五",
      avatar: "/public/avatar.png",
      email: "111@qq.com",
      role: "2",
      account_status: "停用",
      ip: "10.198.1.1",
      created_time: "1687938191",
      update_time: "1687938191",
      delete_time: "1687938191",
    },
    {
      id: 6,
      nike_name: "赵六",
      avatar: "/public/avatar.png",
      email: "111@qq.com",
      role: "2",
      account_status: "停用",
      ip: "10.198.1.1",
      created_time: "1687938191",
      update_time: "1687938191",
      delete_time: "1687938191",
    },
  ],
  selectedRowKeys: [],
  showAddUserDialog: false,
});

//size-change	page-size 每页显示个数选择器的选项设置改变时触发
const handleSizeChange = (val) => {
  // console.log(`${val} items per page`);
  pagination.limit = val;
};
//current-change	current-page 当前页数改变时触发
const handleCurrentChange = (val) => {
  // console.log(`current page: ${val}`);
  pagination.page = val;
};

//表格用到的参数
const pagination = reactive({
  page: 1, //当前页数
  limit: 5, // 每页显示个数选择器的选项设置
  total: 6, //总个数
});

//目前表格显示数据
const tableData = () => {
  return data.tableData.filter(
    (item, index) =>
      index < pagination.page * pagination.limit &&
      index >= pagination.limit * (pagination.page - 1)
  );
};
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

.gvb_container {
  background: var(--bg);

  .gvb_search {
    padding: 10px;
    border-bottom: 1px solid var(--card_bg);
  }

  .gvb_actions {
    padding: 10px;
    .el-button {
      margin-right: 10px;
    }
  }

  .gvb_tables {
  background-color: var(--bg);

  }

  .gvb_pages {
    display: flex;
    justify-content: center;
    padding: 10px;
    margin-bottom: 20px;

  }

  .gvb_table_avatar {
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
  border-top: 1px solid var(--card_boder);
}

/* 标题区域 下边框 */
:deep(.el-dialog__header) {
  border-bottom: 1px solid var(--card_boder);
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
