<template>
  <div ref="charts" class="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "barCharts",
  mounted() {
    let barCharts = echarts.init(this.$refs.charts);
    barCharts.setOption({
      xAxis: {
        axisLine: {
          show: false,
        },
        type: "category",
      },
      yAxis: {
        axisLine: {
          show: false,
        },
      },
      series: [
        {
          type: "bar",
          data: [8, 15, 33, 12, 55, 11, 27, 15, 40],
        },
      ],
      tooltip: {},
      grid: { left: 0, top: 0, right: 0, bottom: 0 },
    });
  },
};
</script>

<style scoped>
.charts {
  height: 100%;
  width: 100%;
}
</style>
