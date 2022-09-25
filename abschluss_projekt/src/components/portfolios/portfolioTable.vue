<template>
  <v-container>
    <div
        v-if="user !== ''"
    >
      <h1>Home</h1>
      <v-list v-for="item in todo_list" :key="item.portfolioId">
        <v-list-item> {{ item }}</v-list-item>
      </v-list>
    </div>
    <div
        v-if="user === ''"
    >
      <p-login></p-login>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import app from "../../../firebase";

export default {
  name: "portfolioTable",
  data() {
    return {
      todo_neu: "",
      todo_list: [],
      text: 'test',
      user: '',
      email: '',
      passwort: '',
    }
  },
  beforeCreate() {
    axios.get('http://localhost/api/getPortfolios.php').then(response  => (
        this.todo_list = response.data)
    ).finally(() =>
        this.text = ''
    );
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

</style>