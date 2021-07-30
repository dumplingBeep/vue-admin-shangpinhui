<template>
    <main class="spu-container">
        <!-- 分类 -->
        <CategorySelector />

        <!-- SPU -->
        <el-card shadow="always" style="margin-top:20px">
            <el-button type="primary" size="default" icon="el-icon-plus">添加SPU</el-button>

            <!-- SPU列表 -->
            <el-table :data="[{}, {}]" border style="margin-top:20px">
                <el-table-column
                    type="index"
                    label="序号"
                    :width="80"
                    align="center"
                ></el-table-column>
                <el-table-column label="SPU名称"></el-table-column>
                <el-table-column label="SPU描述"></el-table-column>
                <el-table-column label="操作" align="center" width="260">
                    <el-button type="success" size="mini" icon="el-icon-plus"></el-button>
                    <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                    <el-button type="info" size="mini" icon="el-icon-info"></el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
                </el-table-column>
            </el-table>

            <!-- 分页器 -->
            <!-- 
                @size-change="sizeChange"
                @current-change="currentChange"
                :current-page.sync="currentPage"
             -->
            <el-pagination
                :page-sizes="[2, 4, 8, 10]"
                :page-size="pager.currentPage"
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
import CategorySelector from '@/components/CategorySelector';

export default {
    name: 'Spu',
    components: {
        CategorySelector,
    },
    data() {
        return {
            // 分页器
            pager: {
                currentPage: 1,
                total: 50,
            },
        };
    },
};
</script>

<style lang="scss" scoped>
// .spu-container {
//     padding: 20px;
// }
</style>
