<template>
  <div
      class="header d-flex"
  >
      <v-img
          class="logo align-left"
          max-height="100"
          max-width="100"
          src="../assets/logo.png"
      ></v-img>
          <p class="text-md-center">Portfolio Service Korbinian Saxinger</p>
  </div>
</template>

<script>
  export default {
    name: 'app-header',

    data: () => ({

    }),
  }
</script>

<style scoped>

.header {
    height: 110px;
    max-height: 110px;
}

p {
  position: inherit;
  margin-left: 37%;
  margin-top: 50px;
  color: black;
}

.logo {
  margin: 10px 10px 10px 10px;
}
</style>
