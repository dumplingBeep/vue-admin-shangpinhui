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
          <template slot-scope="{ row }">
            <TipButton
              :tipText="row.isSale ? '下架' : '上架'"
              @click="setIsOnSale(row.id, row.isSale)"
              :icon="row.isSale ? 'el-icon-bottom' : 'el-icon-top'"
              :type="row.isSale ? 'warning' : 'info'"
            />
            <TipButton
              tipText="修改"
              @click="$message('宝儿,功能开发中~~~')"
              icon="el-icon-edit"
              type="primary"
            />
            <TipButton
              @click="viewDetail(row.id)"
              tipText="查看详情"
              icon="el-icon-info"
              type="info"
            />
            <TipButton tipText="删除" icon="el-icon-delete" type="danger" />
          </template>
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

      <!-- SKU 详情 -->
      <el-drawer
        title="SKU 详情"
        :before-close="closeDetail"
        :visible.sync="isShowDetail"
        size="50%"
      >
        <el-row>
          <el-col :span="5">名称</el-col>
          <el-col :span="19">
            {{ skuDetailInfo.skuName }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">描述</el-col>
          <el-col :span="19">
            {{ skuDetailInfo.skuDesc }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">价格</el-col>
          <el-col :span="19">
            {{ skuDetailInfo.price }}
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5">平台属性</el-col>
          <el-col :span="19">
            <el-tag
              v-for="skuAttrValue in skuDetailInfo.skuAttrValueList"
              :key="skuAttrValue.id"
              type="success"
              style="margin-right:10px"
            >
              {{ `${skuAttrValue.attrId}-${skuAttrValue.valueId}` }}
            </el-tag>
          </el-col>
        </el-row>

        <!-- 图片轮播 -->
        <el-row>
          <el-col :span="5">商品图片</el-col>
          <el-col :span="19">
            <el-carousel indicator-position="outside" height="400px" style="margin-top:20px">
              <el-carousel-item v-for="skuImage in skuDetailInfo.skuImageList" :key="skuImage.id">
                <img
                  :src="skuImage.imgUrl"
                  :alt="skuImage.imgName"
                  style="width: 400px;height: 400px;display:block;margin: 0 auto"
                />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </el-drawer>
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

      isShowDetail: false,
      skuDetailInfo: {
        skuAttrValueList: [],
        skuImageList: [],
        price: '',
        skuName: '',
        skuDesc: '',
      },
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

    /**
     * @msg: 点击按钮 下架/上架商品
     * @param {*} id: 商品id
     * @param {*} isSale: 商品是否上架(1)
     */
    async setIsOnSale(id, isSale) {
      try {
        // 判断
        if (isSale) {
          // 下架产品(发送请求)
          await this.$API.sku.reqCancelSaleProduct(id);

          // 更新页面
          this.setProductList();
        } else {
          // 上架产品(发送请求)
          await this.$API.sku.reqOnSaleProduct(id);

          // 更新页面
          this.setProductList();
        }

        // 提示框
        this.$message({
          type: 'success',
          message: `亲,${isSale ? '下架' : '上架'}成功`,
        });
      } catch (error) {
        this.$message.error(`亲,${isSale ? '下架' : '上架'}失败`);
      }
    },

    // 查看sku详情
    async viewDetail(id) {
      // 获取商品详情(发送请求)
      const {
        data: { skuAttrValueList, skuImageList, price, skuName, skuDesc },
      } = await this.$API.sku.reqGetSkuDetail(id);

      // 显示详情组件
      this.isShowDetail = true;

      this.skuDetailInfo = {
        skuAttrValueList,
        skuImageList,
        price,
        skuName,
        skuDesc,
      };
    },

    // 关闭detail页面
    closeDetail() {
      // 隐藏详情组件
      this.isShowDetail = false;
      // 清空数据
      this.skuDetailInfo = {};
    },
  },
};
</script>

<style lang="scss" scoped>
.sku-wraper {
  margin-top: 20px;
}

.el-row {
  height: 40px;

  .el-col:nth-child(1) {
    font-size: 18px;
    font-weight: bold;
    text-align: right;
  }

  .el-col:nth-child(2) {
    padding-left: 20px;
    width: 66.66667%;
  }
}

.el-col {
  line-height: 40px;
}
</style>
