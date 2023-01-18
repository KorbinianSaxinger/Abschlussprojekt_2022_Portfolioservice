<template>
  <v-main>
    <div
      class="leftSideBar"
    >
      <left-sidebar/>
    </div>
    <div class="home">
      <div v-if="user != ''"
      >
        <portfolio-tabs/>
      </div>
        <div v-if="user === ''"
          class="d-inline-flex"
        >
          <v-card class="welcome">
            <v-card-title>Herzlich Wilkommen</v-card-title>
            <v-card-text class="cardText"> Bitte melden sie sich an,  <br> um unsere Software nutzen zu können!</v-card-text>
            <v-btn
              @click="Router().push('/Login')"
              class="loginBTN"
            >Anmelden</v-btn>
            <v-btn
                @click="Router().push('/register')"
                class="registerBTN"
            >Registrieren</v-btn>
          </v-card>
        </div>
    </div>
  </v-main>
</template>

<script>
import {getAuth, onAuthStateChanged} from "firebase/auth";
import app from "../../firebase";
import PortfolioTabs from "@/components/portfolios/portfolioTabs";
import LeftSidebar from "@/components/leftSidebar";
import Router from "@/router";

export default {
  name: "PHome",
  components: {LeftSidebar, PortfolioTabs},
  data() {
    return {
      user: '',
      email: '',
      passwort: '',
    }
  },
  methods: {
    Router() {
      return Router
    }
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
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        this.user = user.uid;
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
  /*max-height: 1500px;*/
  /*width: 1900px;*/
}
.leftSideBar {
  position: absolute;
}
.loginBTN {
  color: forestgreen;
}
.welcome {
  margin-top: 20px;
  height: 100%;
}
h1 {
  color: deepskyblue;
}
</style>