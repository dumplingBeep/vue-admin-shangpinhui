<template>
    <main class="spu-container">
        <!-- 分类 -->
        <CategorySelector :category3Id.sync="category3Id" :setList="setSpuList" />

        <!-- SPU -->
        <el-card shadow="always" style="margin-top:20px">
            <el-button :disabled="!category3Id" type="primary" size="default" icon="el-icon-plus">
                添加SPU
            </el-button>

            <!-- SPU列表 -->
            <el-table v-loading="loading" :data="spuList" border style="margin-top:20px">
                <el-table-column
                    type="index"
                    label="序号"
                    :width="80"
                    align="center"
                ></el-table-column>
                <el-table-column label="SPU名称" prop="spuName"></el-table-column>
                <el-table-column label="SPU描述" prop="description"></el-table-column>
                <el-table-column label="操作" align="center" width="260">
                    <TipButton type="success" size="mini" icon="el-icon-plus" tipTitle="添加SKU" />
                    <TipButton type="primary" size="mini" icon="el-icon-edit" tipTitle="修改SPU" />
                    <TipButton type="info" size="mini" icon="el-icon-info" tipTitle="查看SPU" />
                    <TipButton type="danger" size="mini" icon="el-icon-delete" tipTitle="删除SPU" />
                </el-table-column>
            </el-table>

            <!-- 分页器 -->
            <!-- 
                @size-change="sizeChange"
                @current-change="currentChange"
                :current-page.sync="currentPage"
             -->
            <el-pagination
                :current-page="pager.currentPage"
                :page-sizes="[2, 4, 8, 10]"
                :page-size="pager.limit"
                layout="prev, pager, next, jumper, ->, sizes, total"
                :total="pager.total"
                style="text-align: center; margin: 20px"
            >
                :pager-count="7">
            </el-pagination>
        </el-card>
    </main>
</template>

<script>
export default {
    name: 'Spu',
    data() {
        return {
            // loading 状态
            loading: false,

            // 三级分类
            category1Id: '',
            category2Id: '',
            category3Id: '',

            // spu 数据列表
            spuList: [],

            // 分页器
            pager: {
                currentPage: 1,
                total: 0,
                limit: 4,
            },
        };
    },
    methods: {
        // 设置 spu 列表
        async setSpuList(id) {
            const {
                pager: { currentPage: page, limit },
                category3Id,
            } = this;

            // 开启 loading 状态
            this.loading = true;

            // 获取 spu 数据列表（发送请求）
            const {
                data: { records, total },
            } = await this.$API.spu.getSpuList({ page, limit, category3Id });

            // 关闭 loading 状态
            this.loading = false;

            // 更新数据
            this.pager.total = total;
            this.spuList = records;
        },
    },
};
</script>

<style lang="scss" scoped></style>
