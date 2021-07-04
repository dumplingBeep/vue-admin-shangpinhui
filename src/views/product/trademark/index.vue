<template>
  <div class="trademark-wraper">
    <el-button @click="addTrademark" type="primary" icon="el-icon-plus">添加</el-button>

    <!-- 品牌列表 -->
    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img
            :src="scope.row.logoUrl"
            :alt="scope.row.tmName"
            style="width:100px; height:80px; min-width:100px; min-height:80px"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" size="mini" icon="el-icon-edit" type="warning">
            编辑
          </el-button>
          <el-button
            @click="handleDelete(scope.row)"
            size="mini"
            icon="el-icon-delete"
            type="danger"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/修改品牌对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="30%">
      <el-form
        :model="trademarkForm"
        :rules="rules"
        ref="trademarkForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :on-success="handleAvatarSuccess"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
          >
            <img v-if="trademarkForm.logoUrl" :src="trademarkForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分页器 -->
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page="currentPage"
      :page-sizes="[1, 2, 3, 4, 5]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper, -> , sizes, total"
      :total="total"
      style="text-align: center"
    ></el-pagination>
  </div>
</template>

<script>
import { trademark } from './../../../api';

export default {
  name: 'TradeMark',
  data() {
    return {
      currentPage: 1, // 当前页码
      pageSize: 5, // 每页条数
      total: 20, // 总数
      trademarkList: [], // 品牌列表
      dialogVisible: false, // 对话框可见性
      dialogTitle: '', // 对话框标题
      // 品牌信息
      trademarkForm: {
        tmName: '',
        logoUrl: '',
      },
      // 添加/修改品牌信息校验规则
      rules: {
        tmName: [
          { required: true, message: '宝儿,输入品牌名称', trigger: 'blur' },
          { min: 2, max: 5, message: '宝儿,长度在 2 到 5 个字符', trigger: 'blur' },
        ],
        logoUrl: [{ required: true, message: '宝儿,上传品牌Logo', trigger: 'blur' }],
      },
    };
  },
  mounted() {
    this.setTrademarkList();
  },
  methods: {
    // 获取指定页码条数的品牌数据，设置到data
    async setTrademarkList() {
      const { currentPage, pageSize } = this;
      const res = await trademark.reqGetPageTrademarkList(currentPage, pageSize);
      this.trademarkList = res.data.records;
      this.total = res.data.total;
    },

    /**
     * @msg: 分页器页码发送改变：更新当前页码的数据(发送请求)
     * @param {*} page：分页器当前页码
     */
    handleCurrentChange(page) {
      this.currentPage = page;
      // 更新当前页码的数据
      this.setTrademarkList();
    },

    /**
     * @msg: 当每页条数发生改变：更新对应条数的数据(发生请求)
     * @param {*} pageSize: 一页展示的条数
     */
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      // 更新对应条数的数据
      this.setTrademarkList();
    },

    // 添加品牌点击事件：显示对话框
    addTrademark() {
      this.dialogTitle = '添加品牌';
      this.dialogVisible = true;
    },

    // 上传头像成功：获取头像地址
    handleAvatarSuccess(res, file) {
      this.trademarkForm.logoUrl = file.response.data;
    },

    /**
     * @msg: 对话框确定按钮click事件:
     *  表单校验，通过则添加品牌(发送请求)
     * @param {*} formName: 校验的表单
     */
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 校验通过
          try {
            if (this.dialogTitle === '添加品牌') {
              // 添加品牌(发送请求)
              await trademark.reqAddTrademark(this.trademarkForm);
              // 更新当前页码的数据
              this.setTrademarkList();
            } else {
              // 修改品牌(发送请求)
              await trademark.reqUpdateTrademark(this.trademarkForm);
            }
            // 隐藏会话框
            this.dialogVisible = false;
            // 提示消息框
            this.$message({
              message: `亲,${this.dialogTitle}成功`,
              type: 'success',
            });
          } catch (error) {
            // 隐藏会话框
            this.dialogVisible = false;
            // 提示消息框
            this.$message.error(`亲,${this.dialogTitle}失败!!!`);
          }
        }
      });
    },

    /**
     * @msg: 点击编辑触发事件：
     * @param {*} row: 当前编辑品牌数据
     */
    handleEdit(row) {
      console.log(row);
      // 展示对话框
      this.dialogTitle = '修改品牌';
      this.trademarkForm = row;
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss">
.trademark-wraper {
  padding-top: 20px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
