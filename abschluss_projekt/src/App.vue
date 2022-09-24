<template>
  <div id="app">
    <app-header class="header"/>
      <router-view
        class="view"
      />
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

.header {
  background-color: transparent;
}
.view {
  background: url("assets/backgroundMD.jpg") no-repeat fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 850px;
  color: white;
  /*width: 1900px;*/
}
</style>
<script>
import AppFooter from "@/components/footer";
import AppHeader from "@/components/header";
export default {
  components: {AppHeader, AppFooter}
}
</script>