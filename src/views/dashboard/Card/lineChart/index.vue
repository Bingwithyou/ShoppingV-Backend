<template>
  <div ref="charts" class="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "lineCharts",
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
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
          type: "line",
          data: [8, 15, 33, 12, 55, 11, 27, 15, 40],
          itemStyle: {
            opacity: 0,
          },
          smooth: true,
          lineStyle: {
            color: "purple",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "#c775f9" },
                {
                  offset: 1,
                  color: "#fff",
                },
              ],
              global: false,
            },
          },
        },
      ],
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
