<template>
  <el-tooltip :content="tipText" placement="top">
    <el-button v-bind="$attrs" size="mini"></el-button>
  </el-tooltip>
</template>

<script>
export default {
  name: 'TipButton',
  props: {
    tipText: {
      type: String,
      default: '提示文字',
    },
  },
};
</script>

<style></style>
