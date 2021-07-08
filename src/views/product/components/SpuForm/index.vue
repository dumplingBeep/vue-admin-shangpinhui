<template>
  <el-form :model="spuForm" label-width="80px">
    <el-form-item label="SPU名称">
      <el-input v-model="spuForm.spuName" placeholder="请输入SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="品牌">
      <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
        <el-option
          v-for="item in trademarkList"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        v-model="spuForm.description"
        :autosize="{ minRows: 4, maxRows: 4 }"
        placeholder="请输入SPU描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图片">
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :file-list="spuImageList"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImgUrl" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-select v-model="spuForm.tmId" :placeholder="`还有${baseSaleAttrList.length}个属性未添加`">
        <el-option
          v-for="item in baseSaleAttrList"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button :disabled="false" style="margin-left: 10px" type="primary" icon="el-icon-plus">
        添加销售属性
      </el-button>

      <!-- 销售属性表格 -->
      <el-table border :data="[{}, {}]" style="width: 100%; margin: 20px 0">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="" label="属性名" width="160"></el-table-column>
        <el-table-column label="属性值列表"></el-table-column>
        <el-table-column label="操作" width="160">
          <TipButton type="danger" icon="el-icon-delete" tipText="删除" />
        </el-table-column>
      </el-table>
      <el-button type="primary">取消</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      // SPU表单数据
      spuForm: {
        spuName: '',
        tmId: '', // 品牌id
        description: '', // SPU描述
        spuImageList: [], // spu图片列表
        spuSaleAttrList: [], // 销售属性列表
      },
      spuImageList: [], // 收集spu图片列表
      trademarkList: [], // 品牌数据列表
      dialogVisible: false, // 是否展示图片
      dialogImgUrl: '', // 会话展示图片路径
      baseSaleAttrList: '', // 销售属性列表
    };
  },
  async mounted() {
    try {
      // 获得品牌列表数据(发送请求)
      const { data: trademarkList } = await this.$API.trademark.reqGetTrademarkList();
      this.trademarkList = trademarkList;

      const { data: baseSaleAttrList } = await this.$API.spu.getBaseSaleAttrList();
      this.baseSaleAttrList = baseSaleAttrList;
    } catch (error) {
      this.$message.error('亲,出现错误,请联系管理员~');
    }
  },
  methods: {
    // 处理头像上传成功
    handleSuccess(res, file) {
      this.spuImageList.push(file);
    },

    // 处理图片卡预览
    handlePictureCardPreview({ url }) {
      this.dialogVisible = true;
      this.dialogImgUrl = url;
    },

    // 删除图片：删除对应数据
    handleRemove(file) {
      this.spuImageList = this.spuImageList.filter((spuImage) => spuImage.uid !== file.uid);
    },
  },
};
</script>

<style></style>
