<template>
  <div
    class="test"
  >
      <v-card
        v-model="isVisible"
      >
        <v-card-title>Headline</v-card-title>
        <h1>Test</h1>
      </v-card>
  </div>
</template>

<script>
export default {
  name: "app-test",

  data() {
    return {
      isVisible: false,
    }
  },
  methods: {
    openWindow() {
      this.isVisible = true
    },

    closeWindow() {
      this.isVisible = false
      // this.reset()
    },

    created() {
      this.menuBus.$on('request-test', this.openWindow)
      // window.addEventListener('keydown', this.submitOnReturn)
    },

    beforeDestroy() {
      this.menuBus.$off('request-test', this.openWindow)
      // window.removeEventListener('keydown', this.submitOnReturn)
    },

  }
}
</script>

<style scoped>

</style>