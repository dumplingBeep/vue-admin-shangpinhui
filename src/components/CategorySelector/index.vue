<template>
  <div class="cascade-wraper">
    <span class="cascade-title">一级分类</span>
    <!-- 
        :options="options"
        @change="handleChange" 
      -->
    <el-cascader v-model="category1Id"></el-cascader>
    <span class="cascade-title">二级分类</span>
    <el-cascader v-model="category2Id"></el-cascader>
    <span class="cascade-title">三级分类</span>
    <el-cascader v-model="category3Id"></el-cascader>
  </div>
</template>

<script>
export default {
  name: 'CategorySelector',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
};
</script>

<style lang="scss" scoped>
.cascade-wraper {
  margin-bottom: 20px;
}

.cascade-title {
  display: inline-block;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 0;
  font-weight: 700;
}

.el-cascader {
  margin-right: 10px;
}
</style>
