<template>
  <div
      class="header d-flex"
  >
    <router-link to="/Home">
      <v-img
          class="logo align-left"
          max-height="100"
          max-width="100"
          src="../assets/logo.png"
      ></v-img>
    </router-link>
          <p class="text-md-center">Portfolio Service Korbinian Saxinger</p>
          <div v-if="user !== ''">
            <v-btn class="lbutton text-justify" dark @click.prevent="logout">Logout</v-btn>
          </div>
          <div v-if="user == ''">
            <router-link to="login">
              <v-btn class="lbutton text-justify" dark>login</v-btn>
            </router-link>

          </div>
  </div>
</template>

<script>
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";
import app from "../../firebase";
import router from "@/router";

export default {
  name: "app-header",
  data() {
    return {
      user: '',
      email: '',
      passwort: '',
    }
  },
  methods: {
    logout() {
      const auth = getAuth(app);
      const ref = this;
      signOut(auth).then(() => {
        ref.user = '';
      }).catch((error) => {
        console.log(error)
      }).finally(() => {
        router.push('login')
      });
    }
  },
  mounted() {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user.uid;
      } else {
          console.log('Nicht angemeldet')
      }
    });
  }
}
</script>

<style scoped>

.header {
    height: 110px;
    max-height: 110px;
    background-color: rgba(148, 148, 148, 0.44);
}

p {
  position: inherit;
  margin-left: auto;
  margin-right: auto;
  margin-top: 50px;
  color: black;

}
.lbutton {
  color: forestgreen;
  margin: 35px 10px 10px 0px;
}
.logo {
  margin: 10px 10px 10px 10px;
}
</style>
