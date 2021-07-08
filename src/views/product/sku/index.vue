<template>
  <div class="sku-wraper">
    <!-- sku数据展示 -->
    <el-card>
      <el-table v-loading="loading" border :data="productList" style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="skuName" type="name" label="名称"></el-table-column>
        <el-table-column prop="skuDesc" type="name" label="描述"></el-table-column>
        <el-table-column type="name" label="默认图片" align="center" width="120">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" alt="row.skuName" style="height: 80px; width: 100px" />
          </template>
        </el-table-column>
        <el-table-column
          prop="weight"
          type="name"
          label="质量(KG)"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="price"
          type="name"
          label="价格(元)"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column prop="skuName" type="name" label="操作" align="center" width="260">
          <TipButton tipText="下架" icon="el-icon-bottom  " type="warning" />
          <TipButton tipText="修改" icon="el-icon-edit" type="primary" />
          <TipButton tipText="查看详情" icon="el-icon-info" type="info" />
          <TipButton tipText="删除" icon="el-icon-delete" type="danger" />
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
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
      productList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,
    };
  },
  mounted() {
    // 首屏展示
    this.setProductList();
  },
  methods: {
    // 获取产品数据
    async setProductList() {
      this.loading = true;
      const { currentPage, pageSize } = this;
      const {
        data: { records, total },
      } = await this.$API.sku.reqGetProductList(currentPage, pageSize);
      this.loading = false;
      this.productList = records;
      this.total = total;
    },

    /**
     * @msg: 页数改变触发：展示对应产品数据(发送请求)
     * @param {*} currentPage: 当前点击页
     */
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      // 展示对应页产品数据(发送请求)
      this.setProductList();
    },

    /**
     * @msg: 每页条数改变触发：展示对应产品数据(发送请求)
     * @param {*} pageSize: 每页展示条数
     */
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      // 展示对应条数产品数据(发送请求)
      this.setProductList();
    },
  },
};
</script>

<style lang="scss" scoped>
.sku-wraper {
  margin-top: 20px;
}
</style>
