<template>
  <div>
    <el-button
      type="primary"
      v-show="$store.state.user.buttons.indexOf('btn.Add1') != -1"
      >添加按钮11</el-button
    >
    <el-button type="primary">添加按钮22</el-button>
  </div>
</template>

<script>
export default {
  name: "Test1",
};
</script>

<style scoped></style>
