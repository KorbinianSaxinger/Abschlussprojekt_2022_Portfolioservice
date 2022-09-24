<template>
  <div class="landingPage">
    <div>
      <h1>Landing</h1>
      <router-link to="/Login">
        <p>Login</p>
      </router-link>
      <router-link to="/Register">
        <p>Register</p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "PLanding",
  data() {
    return {

    }
},
}
</script>

<style scoped>
/*@import '~vuetify/src/styles/styles.sass';*/

.landingPage {
  background: url("../assets/backgroundMD.jpg") no-repeat fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 1080px;
  /*width: 1900px;*/
}
h1 {
  color: white;
}
  /*@media  (max-width: 1900px) {*/
  /*  .landingPage {*/
  /*    height: 80px;*/
  /*    width: 20px;*/
  /*}*/


/*}*/


</style>