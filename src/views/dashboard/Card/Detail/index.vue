<template>
  <div>
    <div class="card-header">
      {{ title }}
      <i class="el-icon-info"></i>
    </div>
    <div class="card-content">{{ count }}</div>
    <div class="card-charts">
      <slot name="charts"></slot>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Detail",
  props: ["title", "count"],
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #d9d9d9;
}
.card-content {
  font-size: 30px;
  padding: 10px 0;
}
.card-charts {
  height: 40px;
}

.card-footer {
  border-top: 1px solid #eee;
  padding: 3px 0;
}
</style>
