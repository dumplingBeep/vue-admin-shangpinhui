<template>
    <el-card style="margin-top:20px">
        <el-form
            :model="spuForm"
            ref="form"
            label-width="80px"
            :inline="false"
            size="normal"
            @submit.native.prevent
        >
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
                <el-select
                    v-model="attrIdAndValue"
                    :placeholder="`还有${unaddedSaleAttrList.length}个属性未添加`"
                >
                    <el-option
                        v-for="item in unaddedSaleAttrList"
                        :key="item.id"
                        :label="item.name"
                        :value="`${item.id}:${item.name}`"
                    ></el-option>
                </el-select>

                <el-button
                    @click="addSaleAttr"
                    :disabled="!unaddedSaleAttrList.length"
                    type="primary"
                    icon="el-icon-plus"
                    style="margin-left: 12px"
                >
                    添加销售属性
                </el-button>
            </el-form-item>

            <el-form-item>
                <el-table :data="spuForm.spuSaleAttrList" border>
                    <el-table-column
                        type="index"
                        align="center"
                        label="序号"
                        width="80"
                    ></el-table-column>
                    <el-table-column
                        prop="saleAttrName"
                        align="center"
                        label="属性名"
                        width="160"
                    ></el-table-column>
                    <el-table-column label="属性值列表">
                        <template v-slot="{ row }">
                            <el-tag
                                :key="tag.id"
                                v-for="(tag, index) in row.spuSaleAttrValueList"
                                closable
                                :disable-transitions="false"
                                @close="deleteAttrValueTag(row, index)"
                                style="margin-right: 10px"
                            >
                                {{ tag.saleAttrValueName }}
                            </el-tag>

                            <el-input
                                class="input-new-tag"
                                v-show="row.inputVisible"
                                v-model="inputAttrValue"
                                :ref="row.baseSaleAttrId"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(row)"
                                @blur="handleInputConfirm(row)"
                                style="width: 80px"
                            ></el-input>

                            <el-button
                                v-show="!row.inputVisible"
                                class="button-new-tag"
                                size="small"
                                @click="showAttrValInput(row)"
                            >
                                + 添加
                            </el-button>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" label="操作" width="100">
                        <template v-slot="{ $index, row }">
                            <el-popconfirm
                                @onConfirm="removeSaleAttr($index)"
                                :title="`确定删除属性'${row.saleAttrName}'吗？`"
                            >
                                <TipButton
                                    size="mini"
                                    tipTitle="删除"
                                    type="danger"
                                    icon="el-icon-delete"
                                    slot="reference"
                                />
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>

            <el-form-item>
                <el-button @click="save" type="primary">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
export default {
    name: 'SpuForm',
    props: {
        setSpuList: {
            type: Function,
        },
    },
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
            attrIdAndValue: '',

            // 销售属性列表
            baseSaleAttrList: [],
            inputAttrValue: '',
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

            // 设置基本销售属性列表(发送请求)
            this.setBaseSaleAttrList();
        },

        // 设置 spu 表单数据(发送请求)
        async setSpuFormData() {
            const { data } = await this.$API.spu.getSpuById(this.spuId);

            // 添加 inputVisible 属性，控制每个销售属性的 inpuu 框显示
            data.spuSaleAttrList.forEach((attr) => (attr.inputVisible = false));
            this.spuForm = data;
        },

        // 设置商标列表(发送请求)
        async setTrademarkList() {
            const { data } = await this.$API.trademark.getTrademarkList();
            this.trademarkList = data;
        },

        // 设置 spu 图像列表(发送请求)
        async setSpuImageList() {
            const { data } = await this.$API.spu.getSpuImageList(this.spuId);

            // 格式化数据（upload组件识别的属性）
            data.forEach((img) => {
                img.name = img.imgName;
                img.url = img.imgUrl;
            });

            this.spuImageList = data;
        },

        // 设置基本销售属性列表(发送请求)
        async setBaseSaleAttrList() {
            const { data } = await this.$API.spu.getBaseSaleAttrList();
            this.baseSaleAttrList = data;
        },

        // 处理图片上传成功
        handleUploadSuccess(res, file, fileList) {
            file.url = res.data;
            file.imgName = file.name;
            file.imgUrl = res.data;
            file.spuId = this.spuId;

            this.spuImageList = fileList;
        },

        // 处理图片上传之前(限制图片上传格式)
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

        // 添加销售属性
        addSaleAttr() {
            const [baseSaleAttrId, saleAttrName] = this.attrIdAndValue.split(':');

            this.spuForm.spuSaleAttrList.push({
                baseSaleAttrId,
                saleAttrName,
                spuId: this.spuId,
                spuSaleAttrValueList: [],
                inputVisible: false,
            });

            // 清空
            this.attrIdAndValue = '';
        },

        // 删除属性值标签
        deleteAttrValueTag(row, index) {
            row.spuSaleAttrValueList.splice(index, 1);
        },

        // 显示属性值输入框
        showAttrValInput(row) {
            row.inputVisible = true;
            this.$nextTick(() => {
                this.$refs[row.baseSaleAttrId].focus();
            });
        },

        // 添加属性标签
        handleInputConfirm(row) {
            // 去除前后空格
            const saleAttrValueName = this.inputAttrValue.trim();

            const { spuSaleAttrValueList, baseSaleAttrId } = row;

            // 查找是否存在相同属性值
            const isInclude = spuSaleAttrValueList.some(
                (attrValue) => attrValue.saleAttrValueName === saleAttrValueName
            );

            // 判断是否存在相同属性值
            if (isInclude) {
                this.$message.info(`属性值'${saleAttrValueName}'已存在！`);
            } else if (saleAttrValueName) {
                // 判断有值时，才添加
                spuSaleAttrValueList.push({ saleAttrValueName, baseSaleAttrId });
            }

            // 清空
            row.inputVisible = false;
            this.inputAttrValue = '';
        },

        // 删除销售属性
        removeSaleAttr(index) {
            this.spuForm.spuSaleAttrList.splice(index, 1);
        },

        // 保存spuForm信息（发送请求）
        async save() {
            const { spuForm, spuImageList } = this;

            // 合并图片列表
            spuForm.spuImageList = spuImageList;

            // 处理销售属性列表
            const unSetAttrValue = spuForm.spuSaleAttrList.find(
                (saleAttr) => !saleAttr.spuSaleAttrValueList.length
            );
            // 判断销售属性有没有
            if (unSetAttrValue) {
                this.$message.info(`销售属性'${unSetAttrValue.saleAttrName}'没有属性值！`);
                return;
            }

            // 发送请求
            await this.$API.spu.saveSpuFormData(spuForm);
            // 更新 spu 数据
            this.setSpuList();
            this.$message.success('保存成功～');
            this.cancel();
        },

        // 取消
        cancel() {
            Object.assign(this.$data, this.$options.data());
            this.$emit('update:isShowSpuForm', false);
        },
    },

    computed: {
        // 未添加的销售属性列表
        unaddedSaleAttrList() {
            const {
                baseSaleAttrList,
                spuForm: { spuSaleAttrList },
            } = this;

            const newAttrObj = spuSaleAttrList.reduce((pre, attr) => {
                pre[attr.baseSaleAttrId] = attr.baseSaleAttrId;
                return pre;
            }, {});

            return baseSaleAttrList.filter((attr) => !newAttrObj[attr.id]);
        },
    },
};
</script>

<style lang="scss"></style>
