<template>
  <div class="home">
    <div v-if="user != ''"
    >
      <portfolio-table/>
    </div>
    <div
      v-if="user === ''"
    >
      <p-login/>
    </div>
  </div>
</template>

<script>
import {getAuth, onAuthStateChanged} from "firebase/auth";
import app from "../../firebase";
import PLogin from "@/components/auth/login";
import PortfolioTable from "@/components/portfolios/portfolioTable";
// const axios = require('axios')
export default {
  name: "PHome",
  components: {PLogin, PortfolioTable},
  data() {
    return {
      user: '',
      email: '',
      passwort: '',
    }
  },
  methods: {
    // fetchData() {
    //   axios.get('http://localhost/get.php').then(response  => (
    //       this.todo_list = response.data)
    //   ).finally(() =>
    //       this.text = ''
    //   );
    // }
  },
  mounted() {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user)
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        this.user = user.email;
        const uid = user.uid;
        console.log(uid)
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }
}
</script>
<style scoped>
.home {
    background: url("../assets/backgroundMD.jpg") no-repeat fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    height: 1080px;
    /*width: 1900px;*/
}
h1 {
  color: deepskyblue;
}
</style>