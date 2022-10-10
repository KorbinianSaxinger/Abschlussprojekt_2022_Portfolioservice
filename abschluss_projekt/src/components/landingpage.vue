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
import {getAuth, onAuthStateChanged} from "firebase/auth";
import app from "../../firebase";
import router from "@/router";

export default {
  user: null,
  name: "PLanding",
  data() {
    return {

    }
},
  mounted() {
    const auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user.uid;
        await this.fetchPortfolios();
        await this.getPositions(this.portfoliotabs[0].id);
      }
    });

    if (this.user !== null) {
      router.push('home')
    }
  },
}
</script>

<style scoped>

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



</style>