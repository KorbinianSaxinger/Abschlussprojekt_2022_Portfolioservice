<template>
  <v-main>
    <v-card
      class="main flex-nowrap"
      rounded
    >
      <real-time-table/>
    </v-card>
  </v-main>
</template>

<script>
import RealTimeTable from "@/components/realtimedata/realTimeTable";
export default {
  name: "leftSidebar",
  components: {RealTimeTable}
}
</script>

<style scoped>
.main {
  margin-top: 11px;
  width: 300px;
  background-color: white;
}
</style>