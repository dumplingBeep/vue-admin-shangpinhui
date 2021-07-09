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
      <el-select
        v-model="spuSaleAttrName"
        :placeholder="`还有${notUsedAttrList.length}个属性未添加`"
      >
        <el-option
          v-for="item in notUsedAttrList"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        :disabled="!spuSaleAttrName"
        @click="addSaleAttr"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-plus"
      >
        添加销售属性
      </el-button>

      <!-- 销售属性表格 -->
      <el-table border :data="spuForm.spuSaleAttrList" style="width: 100%; margin: 20px 0">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="160"></el-table-column>
        <el-table-column label="属性值列表">
          <template slot-scope="{ row }">
            <el-tag
              v-for="spuSaleAttrValue in row.spuSaleAttrValueList"
              :key="spuSaleAttrValue.saleAttrValueName"
              closable
              :disable-transitions="false"
              @close="removeAttrValue(row.spuSaleAttrValueList, spuSaleAttrValue)"
            >
              {{ spuSaleAttrValue.saleAttrValueName }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="row.inputVisible"
              v-model="row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            ></el-input>
            <el-button class="button-new-tag" size="small" @click="showInput(row)">
              + 添加
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="{ row }">
            <TipButton
              tipText="删除"
              icon="el-icon-delete"
              type="danger"
              @click.prevent="deleteSpuSaleAttr(row)"
            />
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
  name: 'SpuForm',
  props: {
    category3Id: [String, Number],
    isShowSpuList: Boolean,
  },
  data() {
    return {
      // SPU表单数据
      spuForm: {
        category3Id: 0,
        spuName: '',
        id: 0,
        tmId: '', // 品牌id
        description: '', // SPU描述
        spuImageList: [], // spu图片列表
        spuSaleAttrList: [], // 销售属性列表
      },
      spuImageList: [], // 收集spu图片列表
      spuSaleAttrName: '',

      dialogVisible: false, // 是否展示图片
      dialogImgUrl: '', // 会话展示图片路径

      trademarkList: [], // 品牌数据列表
      baseSaleAttrList: [], // 销售属性列表
    };
  },
  methods: {
    // 初始化 update 时的 SpuForm 组件
    initUpdateSpuForm(id) {
      this.setSpuInfo(id);
      this.setSpuImageList(id);
      this.setTmAndAttrList();
    },

    // spu信息(发送请求)
    async setSpuInfo(id) {
      const { data } = await this.$API.spu.getSpuInfo(id);

      // 添加收集spu属性所需要的，两个属性
      data.spuSaleAttrList.forEach((spuAttr) => {
        spuAttr.inputVisible = false;
        spuAttr.inputValue = '';
      });
      this.spuForm = data;
    },

    // spuImageList(发送请求)
    async setSpuImageList(id) {
      const { data } = await this.$API.spu.getSpuImageList(id);
      data.forEach((spuImageObj) => {
        spuImageObj.name = spuImageObj.imgName;
        spuImageObj.url = spuImageObj.imgUrl;
      });
      this.spuImageList = data;
    },

    // 获取设置 trademarkList、baseSaleAttrList
    async setTmAndAttrList() {
      // 获得品牌列表数据(发送请求)
      const { data: trademarkList } = await this.$API.trademark.reqGetTrademarkList();
      this.trademarkList = trademarkList;

      // 获取基础销售属性列表(发送请求)
      const { data: baseSaleAttrList } = await this.$API.spu.getBaseSaleAttrList();
      this.baseSaleAttrList = baseSaleAttrList;
    },

    // 处理头像上传成功
    handleSuccess(res, file, fileList) {
      if (res.data) {
        file.imgUrl = res.data;
        file.imgName = file.name;
        this.spuImageList = fileList;
      }
    },

    // 处理图片卡预览
    handlePictureCardPreview({ url }) {
      this.dialogVisible = true;
      this.dialogImgUrl = url;
    },

    // 删除图片：删除对应数据
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },

    // 添加销售属性
    addSaleAttr() {
      // 拆分插入到 spuForm.spuSaleAttrList 中
      const [baseSaleAttrId, saleAttrName] = this.spuSaleAttrName.split(':');
      this.spuForm.spuSaleAttrList.push({
        saleAttrName,
        baseSaleAttrId,
        spuSaleAttrValueList: [],
        inputVisible: false,
        inputValue: '',
      });

      this.spuSaleAttrName = '';
    },

    // 删除 spu 销售属性
    deleteSpuSaleAttr({ baseSaleAttrId: id, saleAttrName: name }) {
      const { spuSaleAttrList } = this.spuForm;
      // 删除点击 spu 销售属性
      this.spuForm.spuSaleAttrList = spuSaleAttrList.filter(
        (spuSaleAttr) => spuSaleAttr.baseSaleAttrId !== id
      );

      // 按id排序
      this.baseSaleAttrList.sort((a, b) => a.id - b.id);
    },

    // 删除spu销售属性值
    removeAttrValue(attrValueList, value) {
      attrValueList.splice(attrValueList.indexOf(value), 1);
    },

    // 显示input框：收集spuSaleAttrValue
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    /**
     * @msg: 失去焦点/按下enter触发:
     *  添加一个 spuSaleAttrValue
     * @param {*} row：当前行数据对象
     */
    handleInputConfirm(row) {
      // 去除前后空格
      row.inputValue = row.inputValue.trim();
      const { baseSaleAttrId, inputValue: saleAttrValueName } = row;

      // 判断是否有值
      if (!saleAttrValueName) {
        row.inputVisible = false;
        row.inputValue = '';
        return;
      }

      // 判断是否存在相同值
      const isIncludes = row.spuSaleAttrValueList.some(
        (spuSaleAttrValue) => spuSaleAttrValue.saleAttrValueName === saleAttrValueName
      );

      // 存在则提示, 不存在则插入数据
      if (isIncludes) {
        this.$message('亲,属性值已存在');
      } else {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId,
          saleAttrValueName,
        });
      }

      // 初始化
      row.inputVisible = false;
      row.inputValue = '';
    },

    // 保存
    async save() {
      try {
        this.spuForm.category3Id = this.category3Id;
        this.spuForm.spuImageList = this.spuImageList;
        // 添加/修改Spu信息 (发送请求)
        await this.$API.spu.addOrUpdate(this.spuForm);

        this.$message({
          type: 'success',
          message: '亲,保存成功~~~',
        });

        // 保存成功展示 SpuList
        this.$emit('update:isShowSpuList', true);

        // 更新父组件 spuList
        this.$emit('setSpuList');

        // 重置数据
        Object.assign(this.$data, this.$options.data());
      } catch (error) {
        this.$message.error('亲,保存失败');
      }
    },

    // 取消
    cancel() {
      // 展示 SpuList
      this.$emit('update:isShowSpuList', true);

      // 重置数据
      Object.assign(this.$data, this.$options.data());
    },
  },
  computed: {
    notUsedAttrList() {
      const {
        baseSaleAttrList,
        spuForm: { spuSaleAttrList },
      } = this;

      const UsedAttr = spuSaleAttrList.reduce((p, spuAttr) => {
        p[spuAttr.baseSaleAttrId] = true;
        return p;
      }, {});

      return baseSaleAttrList.filter((baseSaleAttr) => !UsedAttr[baseSaleAttr.id]);
    },
  },
};
</script>

<style lang="scss">
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
