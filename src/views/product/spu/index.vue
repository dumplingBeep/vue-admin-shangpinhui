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
            <TipButton type="success" icon="el-icon-plus" tipText="添加" />
            <TipButton @click="updateSpu(row)" type="primary" icon="el-icon-edit" tipText="修改" />
            <TipButton type="info" icon="el-icon-info" tipText="查看SPU列表" />
            <TipButton type="warning" icon="el-icon-delete" tipText="删除" />
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
    </el-card>

    <el-card v-show="!isShowSpuList" style="margin-top: 20px">
      <SpuForm
        :category3Id="category3Id"
        :isShowSpuList.sync="isShowSpuList"
        @setSpuList="setSpuList"
        ref="spuForm"
      />
    </el-card>
  </div>
</template>

<script>
import SpuForm from './../components/SpuForm';

export default {
  name: 'SPU',
  components: {
    SpuForm,
  },
  data() {
    return {
      loading: false, // loading状态
      // 分页器
      pager: {
        currentPage: 1,
        pageSize: 2,
        total: 0,
      },
      category1Id: '',
      category2Id: '',
      category3Id: '',
      isShowSpuList: true, // 是否展示Spu列表
      spuList: [], // SPU数据列表
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

    // 显示 SpuForm 组件
    showSpuForm() {
      this.isShowSpuList = false;

      // category3Id
      this.$refs.spuForm.spuForm.category3Id = this.category3Id;
      // 设置 trademarkList、saleAttrList
      this.$refs.spuForm.setTmAndAttrList();
    },

    updateSpu(row) {
      this.isShowSpuList = false;
      this.$refs.spuForm.initUpdateSpuForm(row.id);
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

<style lang="scss" scoped>
.spu-wraper {
  margin: 20px 0;
}
</style>
