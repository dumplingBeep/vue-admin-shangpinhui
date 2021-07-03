<template>
  <div class="trademark-wraper">
    <el-button type="primary" icon="el-icon-plus">添加</el-button>

    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img
            :src="scope.row.logoUrl"
            :alt="scope.row.tmName"
            style="width:100px; height:80px; min-width:100px; min-height:80px"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template>
          <el-button size="mini" icon="el-icon-edit" type="warning">编辑</el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page="currentPage"
      :page-sizes="[1, 2, 3, 4, 5]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper, -> , sizes, total"
      :total="total"
      style="text-align: center"
    ></el-pagination>
  </div>
</template>

<script>
import { trademark } from './../../../api';

export default {
  name: 'TradeMark',
  data() {
    return {
      currentPage: 1, // 当前页码
      pageSize: 5, // 每页条数
      total: 20, // 总数
      trademarkList: [], // 品牌列表
    };
  },
  mounted() {
    this.setTrademarkList();
  },
  methods: {
    // 获取指定页码条数的品牌数据，设置到data
    async setTrademarkList() {
      const { currentPage, pageSize } = this;
      const res = await trademark.reqGetPageTrademarkList(currentPage, pageSize);
      this.trademarkList = res.data.records;
      this.total = res.data.total;
    },

    /**
     * @msg: 分页器页码发送改变：更新当前页码的数据(发送请求)
     * @param {*} page：分页器当前页码
     */
    handleCurrentChange(page) {
      this.currentPage = page;
      // 更新当前页码的数据
      this.setTrademarkList();
    },

    /**
     * @msg: 当每页条数发生改变：更新对应条数的数据(发生请求)
     * @param {*} pageSize: 一页展示的条数
     */
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      // 更新对应条数的数据
      this.setTrademarkList();
    },
  },
};
</script>

<style lang="scss" scoped>
.trademark-wraper {
  padding-top: 20px;
}
</style>
