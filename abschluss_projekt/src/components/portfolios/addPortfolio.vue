<template>
  <v-container>
    <v-card
      class="d-flex justify-content-center"
    >
      <v-text-field
        v-model="portfolioName"
      >
      </v-text-field>
      <v-btn
        type="submit"
        class="button"
        color="green"
        @click.prevent="closeWindow"
      >
      Portfolio Anlegen
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "addPortfolio",
  data() {
    return {
      selectedComponent: '',
      portfolioName: 'Test'
    }
  },
  methods: {
    closeWindow() {
      this.selectedComponent = '';
    }
  }
}
</script>

<style scoped>

</style>