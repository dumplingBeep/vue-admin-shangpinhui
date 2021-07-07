<template>
  <div class="attr-wraper">
    <!-- 三级联动属性分类 -->
    <el-card shadow="always">
      <CategorySelector
        :category1Id.sync="category1Id"
        :category2Id.sync="category2Id"
        :category3Id.sync="category3Id"
      />
    </el-card>

    <!-- 属性列表 -->
    <el-card shadow="always" style="margin-top:20px">
      <el-button :disabled="!category3Id" type="primary" icon="el-icon-plus">添加属性</el-button>
      <el-table v-loading="loading" border :data="attrList" style="width: 100%; margin-top:20px">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="{ row }">
            <el-tag v-for="attrValue in row.attrValueList" :key="attrValue.id" type="info">
              {{ attrValue.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <el-tooltip content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import CategorySelector from '@/components/CategorySelector';

export default {
  name: 'Attr',
  components: {
    CategorySelector,
  },
  data() {
    return {
      loading: false, // loading状态
      category1Id: '', //一级分类Id
      category2Id: '', //二级分类Id
      category3Id: '', //三级分类Id
      attrList: [], // 属性列表
    };
  },
  watch: {
    async category3Id(newVal) {
      // 判断category3Id 是否有值，没有则清空 attrList，并退出
      if (!newVal) {
        this.attrList = [];
        return;
      }

      this.loading = true;
      // 获取属性列表(发送请求)
      const { data } = await this.$API.attr.reqGetAttrInfoList(
        this.category1Id,
        this.category2Id,
        this.category3Id
      );
      this.attrList = data;
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.attr-wraper {
  padding: 20px 0;

  .el-tag + .el-tag {
    margin-left: 10px;
  }
}
</style>
