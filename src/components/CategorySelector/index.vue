<template>
  <div class="cascade-wraper">
    <span class="cascade-title">一级分类</span>
    <el-select
      v-model="category1Id"
      placeholder="请选择"
      @change="category1Change"
      :disabled="isShowList"
    >
      <el-option
        v-for="category in category1List"
        :key="category.id"
        :label="category.name"
        :value="category.id"
      ></el-option>
    </el-select>
    <span class="cascade-title">二级分类</span>
    <el-select
      v-model="category2Id"
      placeholder="请选择"
      @change="category2Change"
      :disabled="isShowList"
    >
      <el-option
        v-for="category in category2List"
        :key="category.id"
        :label="category.name"
        :value="category.id"
      ></el-option>
    </el-select>
    <span class="cascade-title">三级分类</span>
    <el-select v-model="category3Id" placeholder="请选择" :disabled="isShowList">
      <el-option
        v-for="category in category3List"
        :key="category.id"
        :label="category.name"
        :value="category.id"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'CategorySelector',
  props: {
    isShowList: {
      type: Boolean,
      default: false,
    },
  },
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
  async mounted() {
    // 获取一级分类(发送请求)
    const { data } = await this.$API.category.reqGetCategory1List();
    this.category1List = data;
  },
  methods: {
    /**
     * @msg: 一级分类change事件：
     *  获取对应二级分类数据(发送请求)
     * @param {*} category1Id: 选中一级分类的Id
     */
    async category1Change(category1Id) {
      // 清空数据
      this.category2Id = '';
      this.category3Id = '';
      this.category3List = [];

      // 获取二级分类数据
      const { data } = await this.$API.category.reqGetCategory2List(category1Id);
      this.category2List = data;
    },

    /**
     * @msg: 二级分类change事件：
     *  获取对应三级分类数据(发送请求)
     * @param {*} category2Id: 选中二级分类的Id
     */
    async category2Change(category2Id) {
      // 清空数据
      this.category3Id = '';

      // 获取二级分类数据
      const { data } = await this.$API.category.reqGetCategory3List(category2Id);
      this.category3List = data;
    },
  },
  watch: {
    category1Id(newVal) {
      // 更新父组件 category1Id 的值
      this.$emit('update:category1Id', newVal);
    },
    category2Id(newVal) {
      // 更新父组件 category2Id 的值
      this.$emit('update:category2Id', newVal);
    },
    category3Id(newVal) {
      // 更新父组件 category3Id 的值
      this.$emit('update:category3Id', newVal);
    },
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

.el-select {
  margin-right: 10px;
}
</style>
