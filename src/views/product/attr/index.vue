<template>
  <div class="attr-wraper">
    <!-- 三级联动属性分类 -->
    <el-card shadow="always">
      <CategorySelector />
    </el-card>

    <!-- 属性列表 -->
    <el-card shadow="always" style="margin-top:20px">
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
      <el-table border :data="attrList" style="width: 100%; margin-top:20px">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="date" label="属性名称"></el-table-column>
        <el-table-column prop="name" label="属性值列表"></el-table-column>
        <el-table-column prop="address" label="操作" width="180"></el-table-column>
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
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],
    };
  },
};
</script>

<style lang="scss" scoped>
.attr-wraper {
  padding: 20px 0;
}
</style>
