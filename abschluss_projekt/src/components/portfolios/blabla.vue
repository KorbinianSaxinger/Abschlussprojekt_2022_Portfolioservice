<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="portfolios"
        must-sort
    >

    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "blabla",
  data() {
    return {
      headers: [
        {text: ''}
      ]
    }
  }
}
</script>

<style scoped>

</style>