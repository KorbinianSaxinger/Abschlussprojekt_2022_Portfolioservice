<template>
 <v-content>
   <v-data-table
     :headers="headers"
   >

   </v-data-table>
 </v-content>
</template>

<script>
export default {
  name: "realTimeTable",
  data() {
    return {
    headers: [
      {text: 'Name', value: 'Name'},
      {text: 'ISIN', value: 'isin'},
      {text: 'Kurs', value: 'kurs'},
    ]
    }
  },

}
</script>

<style scoped>

</style>