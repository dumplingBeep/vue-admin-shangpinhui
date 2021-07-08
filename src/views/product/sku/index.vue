<template>
  <div class="sku-wraper">
    <!-- sku数据展示 -->
    <el-card>
      <el-table border :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column type="name" label="名称"></el-table-column>
        <el-table-column type="name" label="描述"></el-table-column>
        <el-table-column type="name" label="默认图片" align="center"></el-table-column>
        <el-table-column type="name" label="质量(KG)"></el-table-column>
        <el-table-column type="name" label="价格(元)"></el-table-column>
        <el-table-column type="name" label="操作" align="center">
          <TipButton tipText="下架" icon="el-icon-bottom  " type="warning" />
          <TipButton tipText="修改" icon="el-icon-edit" type="primary" />
          <TipButton tipText="查看详情" icon="el-icon-info" type="info" />
          <TipButton tipText="删除" icon="el-icon-delete" type="danger" />
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <!-- 
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
       -->
      <el-pagination
        :current-page="1"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="10"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="100"
        style="text-align: center; margin: 20px 0"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SKU',
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.sku-wraper {
  margin-top: 20px;
}
</style>
