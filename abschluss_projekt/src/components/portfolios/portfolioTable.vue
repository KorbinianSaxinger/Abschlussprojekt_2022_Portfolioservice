<template>
  <v-container>
    <div
    >

      <v-data-table
        :headers="headers"
        :items="portfolios"
        must-sort
      >
        
      </v-data-table>
    </div>
    <div
        v-if="user === ''"
    >
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
      user: '',
      todo_neu: "",
      portfolios: [],
      text: 'test',
      headers: [
        {text: 'PortfolioID', value: 'id'},
        {text: 'PortfolioName', value: 'portfolioName'},
        {text: 'created', value: 'created'},
        {text: 'Aktion', value: '', sortable: false},
      ]
    }
  },
  beforeCreate() {
    axios.get('http://localhost/api/getPortfolios.php').then(response  => (
        this.portfolios = response.data
        )
    ).finally(() =>
        console.log(this.portfolios[0].userId)
    );
  },
  mounted() {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user)
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

</style>