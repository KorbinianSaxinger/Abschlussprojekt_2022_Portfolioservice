<template>
  <div class="home">
    <div
      v-if="user !== ''"
    >
      <h1>Home</h1>
      <v-textarea
          v-model="text"
      ></v-textarea>
      <v-btn class="btn" @click.prevent="fetchData">Lade Daten</v-btn>
      <v-list v-for="item in todo_list" :key="item.id">
          <v-list-item> {{ item }}</v-list-item>
      </v-list>
    </div>
    <div
        v-if="user === ''"
    >
    <p-login></p-login>
    </div>

  </div>
</template>

<script>
import {getAuth, onAuthStateChanged} from "firebase/auth";
import app from "../../firebase";
import PLogin from "@/components/auth/login";
import axios from "vue-axios";

export default {
  name: "PHome",
  components: {PLogin},
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
  methods: {
    fetchData() {
      axios.get('http://127.0.0.1/get.php').then(response => (this.todo_list = response.data));
    }
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