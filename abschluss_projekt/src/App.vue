<template>
  <div id="app" class="home">
    <app-header class="header"/>
      <router-view/>
    <app-footer/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.home {
  background: url("assets/backgroundMD.jpg") no-repeat fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 1500px;
  max-height: 1500px;
}
.header {
  background-color: transparent;
}
</style>
<script>
import AppFooter from "@/components/footer";
import AppHeader from "@/components/header";
export default {
  components: {AppHeader, AppFooter}
}
</script>