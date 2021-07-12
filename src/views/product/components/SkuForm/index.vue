<template>
  <el-form :model="skuForm" label-width="80px" style="padding-bottom: 20px">
    <el-form-item label="SPU名称">
      <span>{{ spuForm.spuName }}</span>
    </el-form-item>
    <el-form-item label="SKU名称">
      <el-input v-model="skuForm.skuName" placeholder="请输入SKU名称"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input v-model="skuForm.price" placeholder="请输入SKU价格"></el-input>
    </el-form-item>
    <el-form-item label="重量(千克)">
      <el-input v-model="skuForm.weight" placeholder="请输入SKU重量"></el-input>
    </el-form-item>
    <el-form-item label="规格描述">
      <el-input
        type="textarea"
        :rows="4"
        v-model="skuForm.skuDesc"
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
          <el-select v-model="skuAttrValue.attrAndValueId" placeholder="请选择">
            <el-option
              v-for="attrValue in skuAttrValue.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
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
          <el-select v-model="spuSaleAttr.attrAndValueId" placeholder="请选择">
            <el-option
              v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList"
              :key="spuSaleAttrValue.id"
              :label="spuSaleAttrValue.saleAttrValueName"
              :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`"
            ></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片列表">
      <el-table
        @selection-change="handleSelectionChange"
        :data="skuImageList"
        ref="multipleTable"
        border
        tooltip-effect="dark"
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="图片">
          <template slot-scope="{ row }">
            <img :src="row.imgUrl" :alt="row.imgName" style="width: 200px" />
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="{ row }">
            <span>{{ row.imgName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-tag v-show="row.isDefault === '1'" type="success">默认</el-tag>
            <el-button v-show="!+row.isDefault" @click="setSkuDefaultImg(row)" type="primary">
              设为默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button @click="save" type="primary">保存</el-button>
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
        skuName: '',
        price: 0,
        weight: '',
        skuDesc: '',
        skuDefaultImg: '',
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],

        category3Id: 0,
        spuId: 0,
        tmId: 0,
      },
      spuForm: {}, // spu 信息
      skuAttrValueList: [], // 平台属性
      spuSaleAttrList: [], // Spu 销售属性列表
      skuImageList: [], // Sku 图片列表
      skuDefaultImg: '', // 默认图片
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
      data.forEach((skuImage) => (skuImage.isDefault = '0'));
      this.skuImageList = data;
    },

    // 设置sku默认img
    setSkuDefaultImg(row) {
      // 设为默认，选中该项
      this.$refs.multipleTable.toggleRowSelection(row, true);
      // this.$refs.multipleTable.selec
      this.skuDefaultImg = row.imgUrl;

      // 去除其他图片默认状态
      this.skuImageList.forEach((skuImage) => (skuImage.isDefault = '0'));

      // 添加响应式属性
      row.isDefault = '1';
    },

    // 保存选中图片
    handleSelectionChange(imgList) {
      this.skuForm.skuImageList = imgList;
    },

    // 保存
    async save() {
      const { skuForm } = this;

      // 处理平台属性值列表
      skuForm.skuAttrValueList = this.skuAttrValueList.reduce((p, skuAttrValue) => {
        if (skuAttrValue.attrAndValueId) {
          const [attrId, valueId] = skuAttrValue.attrAndValueId.split(':');
          p.push({
            attrId,
            valueId,
          });
        }
        return p;
      }, []);

      // 处理销售属性值列表
      skuForm.skuSaleAttrValueList = this.spuSaleAttrList.reduce((p, spuSaleAttr) => {
        if (spuSaleAttr.attrAndValueId) {
          const [saleAttrId, saleAttrValueId] = spuSaleAttr.attrAndValueId.split(':');
          p.push({
            saleAttrId,
            saleAttrValueId,
          });
        }
        return p;
      }, []);

      // 处理图片列表
      skuForm.skuImageList = skuForm.skuImageList.reduce((p, spuSaleAttr) => {
        p.push({
          imgName: spuSaleAttr.imgName,
          imgUrl: spuSaleAttr.imgUrl,
          spuImgId: spuSaleAttr.spuId,
          isDefault: spuSaleAttr.isDefault || '0',
        });
        return p;
      }, []);

      // 其他数据
      skuForm.category3Id = this.category3Id;
      skuForm.spuId = this.spuForm.id;
      skuForm.tmId = this.spuForm.tmId;
      skuForm.skuDefaultImg = this.skuDefaultImg;

      try {
        // 添加SKU(发送请求)
        await this.$API.sku.reqAddOrUpdate(skuForm);

        // 显示 SpuList
        this.$emit('update:isShowSkuForm', false);

        // 提示信息
        this.$message({
          type: 'success',
          message: '亲,添加成功~~',
        });
      } catch (error) {
        this.$message.error('亲,添加失败');
      }
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
