<template>
    <div style="width: 500px; height: 230px">
      <SimpleBaselineChart :series="series" :baseValue="baseValue" :options="options" />
    </div>
</template>

<script>
import SimpleBaselineChart from 'vue-sbchart';
export default {
  name: "AppChart",
  components: { SimpleBaselineChart },
  props: { msg: String },
  setup() {
    const series = [
      { timestamp: 1656818225, value: 12 },
      { timestamp: 1656818226, value: 13 },
      { timestamp: 1656818227, value: 14 },
      { timestamp: 1656818228, value: 15 },
      { timestamp: 1656818229, value: 12.5 },
      { timestamp: 1656818230, value: 13 },
      { timestamp: 1656818231, value: 11 },
      { timestamp: 1656818232, value: 12.3 },
      { timestamp: 1656818233, value: 12.9 },
      { timestamp: 1656818234, value: 13.2 },
      { timestamp: 1656818235, value: 14.6 },
      { timestamp: 1656818236, value: 13.3 },
      { timestamp: 1656818237, value: 13.9 },
      { timestamp: 1656818238, value: 12.9 },
      { timestamp: 1656818239, value: 12.3 },
      { timestamp: 1656818240, value: 12 }
    ];
    const baseValue = 13;
    const options = { upColor: '#37eb34', downColor: '#eb3434', lineWidth: 1 };
    return { series, baseValue, options };
  }
}
</script>

<style scoped>

</style>