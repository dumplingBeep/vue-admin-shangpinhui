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
      <!-- 属性列表 -->
      <div v-show="isShowAttrList">
        <el-button
          :disabled="!category3Id"
          type="primary"
          icon="el-icon-plus"
          @click="isShowAttrList = false"
        >
          添加属性
        </el-button>
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
      </div>

      <!-- 添加/修改 -->
      <div v-show="!isShowAttrList">
        <!-- 属性名称 -->
        <el-form
          :model="attrForm"
          :rules="attrFormRules"
          ref="attrForm"
          :inline="true"
          class="demo-ruleForm"
        >
          <el-form-item label="属性名" prop="attrName">
            <el-input v-model="attrForm.attrName" @input="attrNameInput"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          :disabled="isDisabledAddBtn"
          type="primary"
          icon="el-icon-plus"
          @click="addAttrName"
        >
          添加属性
        </el-button>

        <!-- 属性列表 -->
        <el-table border :data="attrForm.attrValueList" style="width: 100%; margin: 20px 0">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column label="属性值">
            <template slot-scope="{ $index, row }">
              <el-input
                :ref="$index"
                v-show="!row.attrValue || row.isEdit"
                v-model="row.attrValue"
                @blur="row.isEdit = false"
                size="mini"
                placeholder="请输入属性值名称"
              ></el-input>
              <span
                v-show="!!row.attrValue && !row.isEdit"
                @click="editAttrValue($index, row)"
                style="display: block;height: 23px"
              >
                {{ row.attrValue }}
              </span>
            </template>
            <el-input placeholder=""></el-input>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <el-tooltip content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
          </el-table-column>
        </el-table>

        <el-button :disabled="!attrForm.attrValueList.length" type="primary">
          保存
        </el-button>
        <el-button @click="isShowAttrList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// import CategorySelector from '@/components/CategorySelector';

export default {
  name: 'Attr',
  // components: {
  //   CategorySelector,
  // },
  data() {
    return {
      loading: false, // loading状态
      category1Id: '', //一级分类Id
      category2Id: '', //二级分类Id
      category3Id: '', //三级分类Id
      attrList: [], // 属性列表
      isShowAttrList: true, // 属性列表是否展示
      // 收集属性信息
      attrForm: {
        attrName: '',
        attrValueList: [],
      },
      // 属性信息校验规则
      attrFormRules: {
        attrName: [
          { required: true, message: '宝儿,输入属性名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
        ],
      },
      isDisabledAddBtn: true, // 添加按钮是否禁用
    };
  },
  methods: {
    // 添加属性
    addAttrName() {
      this.attrForm.attrValueList.push({
        attrValue: '',
        isEdit: true,
      });

      // DOM更新后，最后一行(新增行) input 框获得焦点
      this.$nextTick(() => this.$refs[this.attrForm.attrValueList.length - 1].focus());
    },

    // 属性名输入框 input 事件：校验失败则禁用添加按钮
    attrNameInput() {
      this.$refs.attrForm.validate((valid) => (this.isDisabledAddBtn = !valid));
    },

    // 点击属性值：切换 input 框编辑状态
    editAttrValue(index, row) {
      row.isEdit = true;
      // DOM更新后，当前行 input 框获得焦点
      this.$nextTick(() => this.$refs[index].focus());
    },
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
