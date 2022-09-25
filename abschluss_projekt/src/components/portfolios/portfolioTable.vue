<template>
  <v-container>
    <div
        v-if="user !== ''"
    >

      <v-data-table
        :headers="headers"
        :items="todo_list"
      >
        
      </v-data-table>
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
      headers: [
        {text: 'PortfolioID', value: 'portfolioId'},
        {text: 'PortfolioName', value: 'portfolioName'},
        {text: 'created', value: 'created'},
      ]
    }
  },
  beforeCreate() {
    axios.get('http://localhost/api/getPortfolios.php').then(response  => (
        this.todo_list = response.data
        )
    ).finally(() =>
        console.log(this.todo_list[0].userId)
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