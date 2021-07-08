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
        <el-button :disabled="!category3Id" type="primary" icon="el-icon-plus" @click="addAttr">
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
            <template slot-scope="{ row }">
              <TipButton @click="editAttr(row)" tipText="编辑" icon="el-icon-edit" type="primary" />
              <TipButton
                @click="deleteAttr(row)"
                tipText="删除"
                icon="el-icon-delete"
                type="danger"
              />
            </template>
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
                v-if="row.isEdit"
                v-model="row.valueName"
                @blur="handleBlur(row)"
                size="mini"
                placeholder="请输入属性值名称"
              ></el-input>
              <span v-else @click="editAttrValue($index, row)" style="display: block;height: 23px">
                {{ row.valueName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ $index, row: { valueName } }">
              <el-popconfirm
                :title="`确定删除属性值&quot;${valueName}&quot;吗?`"
                @onConfirm="attrForm.attrValueList.splice($index, 1)"
              >
                <TipButton slot="reference" tipText="删除" icon="el-icon-delete" type="danger" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button
          @click="save"
          :disabled="isDisabledAddBtn || !attrForm.attrValueList.length"
          type="primary"
        >
          保存
        </el-button>
        <el-button @click="isShowAttrList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Attr',
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
        categoryId: '',
        categoryLevel: 3,
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
        valueName: '',
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

    // 保存: 添加/修改属性
    async save() {
      const { attrForm } = this;

      // 查找是否有空属性值
      // const isEmpty = attrForm.attrValueList.some((attrValue) => !attrValue.valueName.trim());
      // if (isEmpty) {
      //   // 有则提示，并退出函数
      //   this.$message({
      //     message: '亲,属性值不能为空',
      //     type: 'warning',
      //   });
      //   return;
      // }

      const isEdit = attrForm.attrValueList.some((attrValue) => attrValue.isEdit);
      if (isEdit) {
        // 有则提示，并退出函数
        this.$message({
          message: '亲,有正在编辑的值喔',
          type: 'warning',
        });
        return;
      }

      // 删除多余属性 isEdit
      attrForm.attrValueList.forEach((attrValue) => delete attrValue.isEdit);

      try {
        // 请求添加/修改属性
        await this.$API.attr.reqAddOrUpdateAttr({
          ...attrForm,
        });

        // 刷新属性列表
        this.setAttrInfoList();
        // 展示属性列表
        this.isShowAttrList = true;

        // 提示框
        this.$message({
          type: 'success',
          message: '亲,保存成功',
        });
      } catch (error) {
        this.$message.error('亲,保存失败');
      }
    },

    // 获取设置属性列表
    async setAttrInfoList() {
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

    // 添加属性
    addAttr() {
      // 展示添加控件
      this.isShowAttrList = false;
      // 禁用添加按钮
      this.isDisabledAddBtn = true;

      // 初始化值
      // 有id则删除
      this.attrForm.id && delete this.attrForm.id;
      this.attrForm.attrName = '';
      this.attrForm.categoryId = this.category3Id;
      this.attrForm.attrValueList = [];
    },

    // 编辑属性
    editAttr(row) {
      // 防止数据污染
      this.attrForm = { ...row };
      this.attrForm.attrValueList = row.attrValueList.map(
        (attrValue) => (attrValue.isEdit = false) || { ...attrValue }
      );

      // 显示修改组件
      this.isShowAttrList = false;
      // 取消禁用添加按钮
      this.isDisabledAddBtn = false;
    },

    // 删除属性
    deleteAttr(row) {
      this.$confirm(`此操作将永久删除"${row.attrName}"属性, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          // 确定
          // 删除属性(发送请求)
          await this.$API.attr.reqDeleteAttr(row.id);
          // 更新数据
          this.setAttrInfoList();

          this.$message({
            type: 'success',
            message: '删除成功!',
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },

    /**
     * @msg: 属性值输入框失去焦点事件：校验是否存在相同属性值
     *  是则保留input框状态
     * @param {*} row：当前属性值数据
     */
    handleBlur(row) {
      // 校验是否存在相同属性值
      let isEdit = this.attrForm.attrValueList.some((attrValue) => {
        if (row !== attrValue) {
          return attrValue.valueName === row.valueName;
        }
      });

      if (isEdit) {
        this.$message('亲,不可存在相同属性值');
      }

      // 去除首尾空格
      row.valueName = row.valueName.trim();
      // 属性值为空，则保持编辑状态
      if (!row.valueName) {
        isEdit = true;
      }
      row.isEdit = isEdit;
    },
  },
  watch: {
    async category3Id(newVal) {
      // 判断category3Id 是否有值，没有则清空 attrList，并退出
      if (!newVal) {
        this.attrList = [];
        return;
      }

      // 刷新属性列表
      this.setAttrInfoList();
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
