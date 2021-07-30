<template>
    <el-tooltip class="item" effect="dark" :content="tipTitle" placement="top">
        <el-button v-bind="$attrs" v-on="$listeners"></el-button>
    </el-tooltip>
</template>

<script>
export default {
    name: 'TipButton',
    props: ['tipTitle'],
};
</script>

<style lang="scss" scoped></style>
