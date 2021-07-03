<template>
  <div class="trademark-wraper">
    <el-button type="primary" icon="el-icon-plus">添加</el-button>

    <el-table border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column label="品牌名称"></el-table-column>
      <el-table-column label="品牌LOGO"></el-table-column>
      <el-table-column label="操作"></el-table-column>
    </el-table>

    <!-- 
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
     -->
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 50]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper, -> , sizes, total"
      :total="total"
      style="text-align: center"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      currentPage: 1, // 当前页码
      pageSize: 5, // 每页条数
      total: 20, // 总数
    };
  },
};
</script>

<style lang="scss" scoped>
.trademark-wraper {
  padding-top: 20px;
}
</style>
>
