<template>
  <el-form :model="skuForm" label-width="80px" style="padding-bottom: 20px">
    <el-form-item label="SPU名称">
      <span>{{ spuForm.spuName }}</span>
    </el-form-item>
    <el-form-item label="SKU名称">
      <el-input v-model="skuForm.test" placeholder="请输入SKU名称"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input v-model="skuForm.test" placeholder="请输入SKU价格"></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input v-model="skuForm.test" placeholder="请输入SKU重量"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input
        type="textarea"
        :rows="4"
        v-model="skuForm.test"
        placeholder="请输入SKU规格描述"
      ></el-input>
    </el-form-item>

    <el-form-item label="平台属性" class="attrs">
      <el-form :inline="true" :model="skuForm" class="demo-form-inline" label-width="160px">
        <el-form-item
          v-for="skuAttrValue in skuAttrValueList"
          :key="skuAttrValue.id"
          :label="skuAttrValue.attrName"
        >
          <el-select v-model="skuForm.test" placeholder="请选择">
            <el-option
              v-for="attrValue in skuAttrValue.attrValueList"
              :key="attrValue.id"
              label="attrValue.valueName"
              :value="`${attrValue.attrId}:${attrValue.id}`"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性" class="attrs">
      <el-form :inline="true" :model="skuForm" class="demo-form-inline" label-width="160px">
        <el-form-item
          v-for="spuSaleAttr in spuSaleAttrList"
          :key="spuSaleAttr.id"
          :label="spuSaleAttr.saleAttrName"
        >
          <el-select v-model="skuForm.test" placeholder="请选择">
            <el-option
              v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList"
              :key="spuSaleAttrValue.id"
              :label="spuSaleAttrValue.saleAttrValueName"
              :value="spuSaleAttrValue.saleAttrValueName"
            ></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片列表">
      <!-- @selection-change="handleSelectionChange" -->
      <el-table
        border
        :data="skuImageList"
        tooltip-effect="dark"
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="{ row }">
            <img :src="row.imgUrl" :alt="row.imgName" style="width: 200px" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称">
          <template slot-scope="{ row }">
            <span>{{ row.imgName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作">
          <el-button type="primary">设为默认</el-button>
        </el-table-column>
      </el-table>

      <el-button type="primary">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SkuForm',
  props: {
    category1Id: [String, Number],
    category2Id: [String, Number],
    category3Id: [String, Number],
  },
  data() {
    return {
      skuForm: {
        test: '',
      },
      spuForm: {}, // spu 信息
      skuAttrValueList: [], // 平台属性
      spuSaleAttrList: [], // Spu 销售属性列表
      skuImageList: [], // Sku 图片列表
    };
  },
  methods: {
    // 初始化 SkuForm
    initSkuForm() {
      this.setSkuAttrValueList();
      this.setSpuSaleAttrList();
      this.setSkuImageList();
    },

    // 设置平台 attr 列表
    async setSkuAttrValueList() {
      const { data } = await this.$API.attr.reqGetAttrInfoList(
        this.category1Id,
        this.category2Id,
        this.category3Id
      );

      this.skuAttrValueList = data;
    },

    // 设置 Spu 销售属性列表
    async setSpuSaleAttrList() {
      const { data } = await this.$API.spu.reqGetSpuSaleAttrList(this.spuForm.id);
      this.spuSaleAttrList = data;
    },

    // 设置 Spu 销售属性列表
    async setSkuImageList() {
      const { data } = await this.$API.spu.getSpuImageList(this.spuForm.id);
      this.skuImageList = data;
    },

    // 取消按钮
    cancel() {
      Object.assign(this.$data, this.$options.data());
      this.$emit('update:isShowSkuForm', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.attrs {
  .el-form-item {
    margin-bottom: 10px;
  }
}
</style>
