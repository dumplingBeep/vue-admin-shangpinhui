<template>
    <el-card style="margin-top:20px">
        <el-form :model="spuForm" ref="form" label-width="80px" :inline="false" size="normal">
            <el-form-item label="SPU名称">
                <el-input v-model="spuForm.spuName"></el-input>
            </el-form-item>

            <el-form-item label="品牌">
                <el-select v-model="spuForm.tmId" placeholder="请选择">
                    <el-option
                        v-for="item in trademarkList"
                        :key="item.id"
                        :label="item.tmName"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="SPU描述">
                <el-input type="textarea" rows="4" v-model="spuForm.description"></el-input>
            </el-form-item>

            <el-form-item label="SPU图片">
                <el-upload
                    action="/dev-api/admin/product/fileUpload"
                    list-type="picture-card"
                    :on-success="handleUploadSuccess"
                    :before-upload="beforeUpload"
                    :file-list="spuImageList"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" />
                </el-dialog>
            </el-form-item>

            <el-form-item label="销售属性">
                <el-select v-model="attrAndValueId" :placeholder="`还有3个属性未添加`">
                    <el-option
                        v-for="item in spuSaleAttrList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>

                <el-button type="primary" icon="el-icon-plus" style="margin-left: 12px">
                    添加销售属性
                </el-button>
            </el-form-item>

            <el-form-item>
                <el-table :data="[{}, {}]" border>
                    <el-table-column
                        type="index"
                        align="center"
                        label="序号"
                        width="80"
                    ></el-table-column>
                    <el-table-column align="center" label="属性名" width="160"></el-table-column>
                    <el-table-column label="属性值列表"></el-table-column>
                    <el-table-column align="center" label="操作" width="100">
                        <TipButton
                            size="mini"
                            tipTitle="删除"
                            type="danger"
                            icon="el-icon-delete"
                        />
                    </el-table-column>
                </el-table>
            </el-form-item>

            <el-form-item>
                <el-button type="primary">保存</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
export default {
    name: 'SpuForm',
    data() {
        return {
            spuId: 0,

            // 收集表单数据
            spuForm: {
                category3Id: 0,
                description: '',
                id: 0,
                spuImageList: [],
                spuName: '',
                spuSaleAttrList: [],
                tmId: 0,
            },

            // 品牌列表
            trademarkList: [],

            // 图片列表
            spuImageList: [],

            // 图片预览
            dialogImageUrl: '',
            dialogVisible: false,

            // 销售属性id
            attrAndValueId: '',

            // 销售属性列表
            spuSaleAttrList: [],
        };
    },

    methods: {
        // 初始化 SpuForm 数据
        initSpuForm() {
            // 设置 spuForm 数据(发送请求)
            this.setSpuFormData();

            // 设置商标列表(发送请求)
            this.setTrademarkList();

            // 设置图片列表(发送请求)
            this.setSpuImageList();
        },

        // 设置 spu 表单数据(发送请求)
        async setSpuFormData() {
            const { data } = await this.$API.spu.getSpuById(this.spuId);
            this.spuForm = data;
        },

        // 设置商标列表(发送请求)
        async setTrademarkList() {
            const { data } = await this.$API.trademark.getTrademarkList();
            this.trademarkList = data;
        },

        // 初始化设置图片列表(发送请求)
        async setSpuImageList() {
            const { data } = await this.$API.spu.getSpuImageList(this.spuId);

            // 格式化数据（upload组件识别的属性）
            data.forEach((img) => {
                img.name = img.imgName;
                img.url = img.imgUrl;
            });

            this.spuImageList = data;
        },

        // 处理图片上传成功
        handleUploadSuccess(res, file, fileList) {
            file.url = res.data;
            file.imgName = file.name;
            file.imgUrl = res.data;
            file.spuId = this.spuId;

            this.spuImageList = fileList;
        },

        // 处理图片上传成功(限制图片上传格式)
        beforeUpload(file) {
            const fileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            const isLt2M = file.size / 1024 / 1024 < 2;
            const isTypePass = fileTypes.includes(file.type);

            if (!isTypePass) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isTypePass && isLt2M;
        },

        // 处理图片删除
        handleRemove(file, fileList) {
            this.spuImageList = fileList;
        },

        // 处理图片预览
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.imgUrl;
            this.dialogVisible = true;
        },
    },
};
</script>

<style lang="scss"></style>
