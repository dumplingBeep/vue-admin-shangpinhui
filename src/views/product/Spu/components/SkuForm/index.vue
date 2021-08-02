<template>
    <el-card style="margin-top: 20px">
        <el-form :model="skuForm" ref="skuForm" label-width="80px">
            <el-form-item label="SPU名称">
                {{ spuName }}
            </el-form-item>

            <el-form-item label="Sku名称">
                <el-input v-model="skuForm.skuName" placeholder="请输入SKU名称"></el-input>
            </el-form-item>

            <el-form-item label="价格(元)">
                <el-input v-model="skuForm.price" placeholder="请输入SKU价格"></el-input>
            </el-form-item>

            <el-form-item label="重量(KG)">
                <el-input v-model="skuForm.weight" placeholder="请输入SKU重量"></el-input>
            </el-form-item>

            <el-form-item label="规格描述">
                <el-input v-model="skuForm.skuDesc" placeholder="请输入SKU规格描述"></el-input>
            </el-form-item>

            <el-form-item label="平台属性" class="attr-wrapper">
                <el-form ref="form" label-width="80px" :inline="true">
                    <el-form-item
                        v-for="attrValue in skuAttrValueList"
                        :key="attrValue.id"
                        :label="attrValue.attrName"
                    >
                        <el-select v-model="attrValue.attrAndValId" placeholder="请选择">
                            <el-option
                                v-for="item in attrValue.attrValueList"
                                :key="item.id"
                                :label="item.valueName"
                                :value="`${item.attrId}:${item.id}`"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>

            <el-form-item label="销售属性" class="attr-wrapper">
                <el-form label-width="80px" :inline="true">
                    <el-form-item
                        v-for="skuSaleAttr in skuSaleAttrValueList"
                        :key="skuSaleAttr.id"
                        :label="skuSaleAttr.saleAttrName"
                    >
                        <el-select v-model="skuSaleAttr.attrAndValId" placeholder="请选择">
                            <el-option
                                v-for="spuSaleAttr in skuSaleAttr.spuSaleAttrValueList"
                                :key="spuSaleAttr.id"
                                :label="spuSaleAttr.saleAttrValueName"
                                :value="`${spuSaleAttr.baseSaleAttrId}:${spuSaleAttr.id}`"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>

            <el-form-item label="图片列表">
                <el-table
                    :data="skuImageList"
                    ref="multipleTable"
                    @selection-change="handleSelectionChange"
                    border
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column label="图片" align="center">
                        <template v-slot="{ row }">
                            <img :src="row.imgUrl" :alt="row.imgName" style="width: 200px" />
                        </template>
                    </el-table-column>
                    <el-table-column label="名称" align="center">
                        <template v-slot="{ row }">
                            {{ row.imgName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="200">
                        <template v-slot="{ row }">
                            <el-button
                                v-if="!+row.isDefault"
                                @click="setDefaultImg(row)"
                                type="primary"
                            >
                                设为默认
                            </el-button>
                            <el-tag v-else type="success" :disable-transitions="true">默认</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>

            <el-form-item>
                <el-button @click="saveSku" type="primary">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
export default {
    name: 'SkuForm',
    data() {
        return {
            // SPU 名称
            spuName: '',

            // 获取平台属性所需
            category: null,

            // 收集 sku 表单
            skuForm: {
                category3Id: 0,
                isSale: 0,
                price: '',
                skuAttrValueList: [],
                skuDefaultImg: '',
                skuDesc: '',
                skuImageList: [],
                skuName: '',
                skuSaleAttrValueList: [],
                spuId: 0,
                tmId: 0,
                weight: '',
            },

            // 平台属性列表
            skuAttrValueList: [],

            // sku 销售属性列表
            skuSaleAttrValueList: [],

            // sku 图片列表
            skuImageList: [],
        };
    },

    methods: {
        // 初始化 SkuForm
        initSkuForm() {
            // 设置平台属性值列表
            this.setAttrList();

            // 设置 spu 销售属性列表
            this.setSkuSaleAttrList();

            // 设置 sku 图片
            this.setSkuImageList();
        },

        // 设置平台属性值列表（发送请求）
        async setAttrList() {
            const { data } = await this.$API.spu.getAttrList(this.category);
            this.skuAttrValueList = data;
        },

        // 设置 spu 销售属性列表（发送请求）
        async setSkuSaleAttrList() {
            const { spuId } = this.skuForm;
            const { data } = await this.$API.spu.getSpuSaleAttrList(spuId);
            this.skuSaleAttrValueList = data;
        },

        // 设置 sku 图片列表（发送请求）
        async setSkuImageList() {
            const { spuId } = this.skuForm;
            const { data } = await this.$API.spu.getSpuImageList(spuId);

            // 添加属性标识是否为默认图片
            data.forEach((img) => (img.isDefault = '0'));

            this.skuImageList = data;
        },

        // 收集选中的图片
        handleSelectionChange(imgList) {
            const { skuImageList } = this.skuForm;

            // 判断是否是取消选中图片操作
            if (skuImageList.length > imgList.length) {
                // 对象属性记录当前所有选中图片的id
                const selectImgIdInfo = imgList.reduce((preImgInfo, imgInfo) => {
                    preImgInfo[imgInfo.id] = true;
                    return preImgInfo;
                }, {});

                // 取消选中的图片信息
                const removedImgInfo = skuImageList.find((imgInfo) => !selectImgIdInfo[imgInfo.id]);

                // 如果是默认图片则取消默认
                +removedImgInfo.isDefault && (removedImgInfo.isDefault = '0');
            }

            this.skuForm.skuImageList = imgList;
        },

        // 设置默认图片
        setDefaultImg(row) {
            // 重置所有图片
            this.skuImageList.forEach((imgInfo) => (imgInfo.isDefault = '0'));

            // 设置默认图片
            row.isDefault = '1';
            this.skuForm.skuDefaultImg = row.imgUrl;

            // 选中当前图片
            this.$refs.multipleTable.toggleRowSelection(row, true);
        },

        // 保存 sku
        async saveSku() {
            const {
                skuForm,
                category: { category3Id },
                skuAttrValueList,
                skuSaleAttrValueList,
            } = this;
            skuForm.category3Id = category3Id;

            // 处理平台属性值列表
            skuAttrValueList.forEach(({ attrAndValId }) => {
                // 收集选择了的平台属性
                if (attrAndValId) {
                    const [attrId, valueId] = attrAndValId.split(':');
                    skuForm.skuAttrValueList.push({ attrId, valueId });
                }
            });

            // 处理销售属性列表
            skuSaleAttrValueList.forEach(({ attrAndValId }) => {
                // 收集选择了的平台属性
                if (attrAndValId) {
                    const [saleAttrId, saleAttrValueId] = attrAndValId.split(':');
                    skuForm.skuSaleAttrValueList.push({ saleAttrId, saleAttrValueId });
                }
            });

            // 处理图片列表
            skuForm.skuImageList.forEach((imgInfo) => {
                imgInfo.spuImgId = imgInfo.id;
                delete imgInfo.id;
                delete imgInfo.spuId;
            });

            // 添加 SKU（发送请求）
            await this.$API.spu.saveSkuInfo(skuForm);

            this.$message.success('添加成功～');
            // 清空数据、隐藏
            this.cancel();
        },

        // 取消
        cancel() {
            // 清空数据
            Object.assign(this.$data, this.$options.data());

            // 隐藏
            this.$emit('update:isShowSkuForm', false);
        },
    },
};
</script>

<style lang="scss" scoped>
.attr-wrapper {
    .el-form-item {
        margin-bottom: 22px;
    }
}
</style>
