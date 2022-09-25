<template>
  <v-container>
    <div
    >

      <v-data-table
        class="v-data-table"
        :headers="headers"
        :items="positions"
        must-sort
        sort-desc
      >
        
      </v-data-table>
    </div>
    <div
        v-if="user === ''"
    >
      <PLogin></PLogin>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import app from "../../../firebase";
import PLogin from "@/components/auth/login";

export default {
  name: "portfolioPositions",
  components: {PLogin},
  data() {
    return {
      todo_neu: "",
      positions: [],
      user: '',
      headers: [
        {text: 'Position', value: 'positionId'},
        {text: 'Portfolio', value: 'portfolioId'},
        {text: 'Name', value: 'Name'},
        {text: 'ISIN', value: 'ISIN'},
        {text: 'Anzahl', value: 'qty'},
        {text: 'Kaufdatum', value: 'addDate'},
        {text: 'Aktion', value: '', sortable: false},

      ]
    }
  },
  beforeCreate() {
    axios.get('http://localhost/api/getPositions.php').then(response  => (
        this.positions = response.data
        )
    ).finally(() =>
        console.log(this.positions[0].userId)
    );
  },
  mounted() {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user)
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        this.user = user.uid;
        console.log(user)
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