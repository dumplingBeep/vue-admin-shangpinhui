<template>
  <div class="spu-wraper">
    <!-- 分类选择器 -->
    <el-card>
      <CategorySelector
        :category1Id.sync="category1Id"
        :category2Id.sync="category2Id"
        :category3Id.sync="category3Id"
        :isShowList="!isShowSpuList"
      />
    </el-card>

    <el-card v-show="isShowSpuList" style="margin-top: 20px">
      <el-button :disabled="!category3Id" @click="showSpuForm" type="primary" icon="el-icon-plus">
        添加SPU
      </el-button>

      <!-- 数据表格 -->
      <el-table v-loading="loading" border :data="spuList" style="width: 100%; margin:20px 0">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="spuName" label="SPU名称"></el-table-column>
        <el-table-column prop="description" label="SPU描述"></el-table-column>
        <el-table-column prop="name" label="操作" width="260" align="center">
          <template slot-scope="{ row }">
            <TipButton
              @click="showSkuForm(row)"
              type="success"
              icon="el-icon-plus"
              tipText="添加"
            />
            <TipButton @click="updateSpu(row)" type="primary" icon="el-icon-edit" tipText="修改" />
            <TipButton
              @click="getSpuList(row)"
              type="info"
              icon="el-icon-info"
              tipText="查看SKU列表"
            />
            <TipButton
              @click="deleteSpu(row)"
              type="warning"
              icon="el-icon-delete"
              tipText="删除"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pager.currentPage"
        :page-sizes="[2, 4, 6, 8, 10]"
        :page-size="pager.pageSize"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="pager.total"
        style="text-align:center"
      ></el-pagination>

      <!-- spuList -->
      <el-dialog :title="`${skuInfo.spuName} => SKU列表`" :visible.sync="isShowSkuList" width="30%">
        <el-table :data="skuInfo.skuInfoList" border style="width: 100%">
          <el-table-column prop="skuName" label="名称" align="center"></el-table-column>
          <el-table-column prop="price" label="价格(元)" align="center"></el-table-column>
          <el-table-column prop="weight" label="重量(KG)" align="center"></el-table-column>
          <el-table-column label="默认图片" width="220" align="center">
            <template slot-scope="{ row }">
              <img :src="row.skuDefaultImg" :alt="row.skuName" style="width: 100%" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>

    <!-- SpuForm -->
    <el-card v-show="isShowSpuForm" style="margin-top: 20px">
      <SpuForm
        :category3Id="category3Id"
        :isShowSpuForm.sync="isShowSpuForm"
        :currentPage.sync="pager.currentPages"
        @setSpuList="setSpuList"
        ref="spuForm"
      />
    </el-card>

    <!-- SkuForm -->
    <el-card v-show="isShowSkuForm" style="margin-top: 20px">
      <SkuForm
        :isShowSkuForm.sync="isShowSkuForm"
        ref="skuForm"
        :category1Id="category1Id"
        :category2Id="category2Id"
        :category3Id="category3Id"
      />
    </el-card>
  </div>
</template>

<script>
import SpuForm from './../components/SpuForm';
import SkuForm from './../components/SkuForm';

export default {
  name: 'SPU',
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      loading: false, // loading状态
      // 分页器
      pager: {
        currentPage: 1,
        pageSize: 4,
        total: 0,
      },
      category1Id: '',
      category2Id: '',
      category3Id: '',
      spuList: [], // SPU数据列表
      isShowSkuForm: false,
      isShowSpuForm: false,
      isShowSkuList: false,
      skuInfo: {
        spuName: '',
        skuInfoList: [],
      },
    };
  },
  methods: {
    // 获取并设置 spuList(发送请求)
    async setSpuList() {
      const {
        pager: { currentPage, pageSize },
        category3Id,
      } = this;

      // 展示加载状态
      this.loading = true;
      try {
        // 获取 spuList (发送请求)
        const {
          data: { records, total },
        } = await this.$API.spu.getSpuList(currentPage, pageSize, category3Id);

        // 隐藏加载状态
        this.loading = false;

        this.spuList = records;
        this.pager.total = total;
      } catch (error) {
        this.$message.error('亲,系统错误~~~');
      }
    },

    // 分页器: 展示对应条数spu数据
    handleSizeChange(pageSize) {
      this.pager.pageSize = pageSize;
      this.setSpuList();
    },

    // 分页器: 展示对应页码spu数据
    handleCurrentChange(currentPage) {
      this.pager.currentPage = currentPage;
      this.setSpuList();
    },

    // 添加显示 SpuForm 组件
    showSpuForm() {
      this.isShowSpuForm = true;

      // 标识此操作是添加
      this.$refs.spuForm.isAddSpu = true;
      // category3Id
      this.$refs.spuForm.spuForm.category3Id = this.category3Id;
      // 设置 trademarkList、saleAttrList
      this.$refs.spuForm.setTmAndAttrList();
    },

    // 显示 SpuForm
    updateSpu(row) {
      this.isShowSpuForm = true;
      this.$refs.spuForm.initUpdateSpuForm(row.id);
    },

    // 显示 SKuForm
    showSkuForm({ id, tmId, spuName }) {
      // 传递数据
      this.$refs.skuForm.spuForm = {
        id,
        tmId,
        spuName,
      };

      // 展示 SkuForm
      this.isShowSkuForm = true;
      this.$refs.skuForm.initSkuForm();
    },

    // 查看Spu信息列表
    async getSpuList(row) {
      const { data } = await this.$API.sku.reqGetSkuList(row.id);
      this.isShowSkuList = true;

      this.skuInfo.spuName = row.spuName;
      this.skuInfo.skuInfoList = data.map(({ skuName, weight, price, skuDefaultImg }) => ({
        skuName,
        weight,
        price,
        skuDefaultImg,
      }));
    },

    // 删除Spu
    deleteSpu(row) {
      this.$confirm(`此操作将永久删除"${row.spuName}"SPU, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 删除该 SPU
          await this.$API.spu.reqRemoveSpu(row.id);

          // 刷新数据
          this.setSpuList();

          // 提示
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
  },
  computed: {
    isShowSpuList() {
      return !this.isShowSkuForm && !this.isShowSpuForm;
    },
  },
  watch: {
    category3Id(newVal) {
      // 没有值则退出, 清空spuList
      if (!newVal) {
        this.spuList = [];
        return;
      }

      // 有值则获取 spuList (发送请求)
      this.setSpuList();
    },
  },
};
</script>

<style lang="scss">
.spu-wraper {
  margin: 20px 0;
}

.el-dialog {
  margin-bottom: 15vh;
}
</style>
