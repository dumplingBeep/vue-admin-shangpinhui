<template>
    <el-card>
        <el-form :disabled="!isDisabled" :inline="true" class="demo-form-inline">
            <el-form-item label="一级分类">
                <el-select v-model="category1Id" placeholder="请选择">
                    <el-option
                        v-for="category in category1List"
                        :key="category.id"
                        :label="category.name"
                        :value="category.id"
                    ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="二级分类">
                <el-select v-model="category2Id" placeholder="请选择">
                    <el-option
                        v-for="category in category2List"
                        :key="category.id"
                        :label="category.name"
                        :value="category.id"
                    ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="三级分类">
                <el-select v-model="category3Id" placeholder="请选择">
                    <el-option
                        v-for="category in category3List"
                        :key="category.id"
                        :label="category.name"
                        :value="category.id"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
export default {
    name: 'CategorySelector',
    props: {
        setList: {
            type: Function,
        },
        isDisabled: {
            type: Boolean,
        },
    },
    data() {
        return {
            category1Id: '',
            category2Id: '',
            category3Id: '',

            category1List: [],
            category2List: [],
            category3List: [],
        };
    },
    mounted() {
        // 获取一级分类（发送请求）
        this.setCategory1List();
    },
    methods: {
        // 获取一级分类（发送请求）
        async setCategory1List() {
            const { data } = await this.$API.category.getCategory1();
            this.category1List = data;
        },

        // 获取二级分类（发送请求）
        async setCategory2List() {
            let { category1Id } = this;
            const { data } = await this.$API.category.getCategory2(category1Id);
            this.category2List = data;
        },

        // 获取三级分类（发送请求）
        async setCategory3List() {
            let { category2Id } = this;
            const { data } = await this.$API.category.getCategory3(category2Id);
            this.category3List = data;
        },
    },
    watch: {
        category1Id(newVal) {
            // 获取二级分类（发送请求）
            this.setCategory2List();

            // 修改父组件 category1Id
            this.$emit('update:category1Id', newVal);

            // 初始化
            this.category2Id = '';
            this.category3Id = '';
            this.category3List = [];
        },

        category2Id(newVal) {
            if (!newVal) return;

            // 获取三级分类（发送请求）
            this.setCategory3List();

            // 修改父组件 category2Id
            this.$emit('update:category2Id', newVal);

            // 初始化
            this.category3Id = '';
        },

        category3Id(newVal) {
            // 修改父组件 category3Id
            this.$emit('update:category3Id', newVal);

            this.setList(this.category3Id);
        },
    },
};
</script>

<style lang="scss" scoped></style>
