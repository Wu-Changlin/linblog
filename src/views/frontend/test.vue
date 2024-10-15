<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column label="标签">
      <template slot-scope="scope">
        <el-tag
          v-for="(tag, index) in scope.row.tags"
          :key="index">
          {{ tag }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>
 
<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '张三',
          tags: ['重要', '客户']
        },
        {
          date: '2016-05-04',
          name: '李四',
          tags: ['官方', '合作']
        },
        // ... 更多数据
      ]
    };
  }
};
</script>