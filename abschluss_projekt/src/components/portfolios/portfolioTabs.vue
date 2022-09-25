<template>
  <v-container>
    <v-card>
      <v-tabs
          v-model="tab"
          background-color="red lighten-2"
      >
        <div>

        </div>
        <v-tab
            v-for="item in portfoliotabs"
            :key="item.portfolioId"
            @click="testFunction(item.portfolioId)"
        >
            {{ item.name }}
        </v-tab>
      </v-tabs>
    </v-card>

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
  </v-container>
</template>

<script>
import axios from "axios";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import app from "../../../firebase";

export default {
  name: "portfolioTabs",
  data: () => ({
    tab: null,
    pid: null,
    positions: [],
    user: '',
    portfoliotabs: [],
    headers: [
      {text: 'id', value: 'id'},
      {text: 'Portfolio', value: 'portfolioId'},
      {text: 'Name', value: 'name'},
      {text: 'ISIN', value: 'isin'},
      {text: 'Anzahl', value: 'qty'},
      {text: 'Kaufdatum', value: 'created'},
      {text: 'Aktion', value: '', sortable: false},

    ]
  }),
  methods: {
    testFunction(id) {
      const strid = id.toString()
      const url = 'http://localhost:3000/positions/?portfolioId=' + strid
      axios.get(url).then(response  => (
              this.positions = response.data
          )
      ).finally(() =>
          // console.log(this.positions[0].portfolioId)
          console.log('switched portfolio')
      );
    }
  },
  computed: {

  },
  beforeCreate() {


  },
  mounted() {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user.uid;
        const url = 'http://localhost:3000/portfolios/?userId=' + this.user

        axios.get(url).then(response  => (
                this.portfoliotabs = response.data
            )
        ).finally(() => {
          const strid = this.portfoliotabs[0].portfolioId
          const url = 'http://localhost:3000/positions/?portfolioId=' + strid

          axios.get(url).then(response  => (
                  this.positions = response.data
              )
          );
        });
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  },
  watch: {
    pid() {

      axios.get('http://localhost:3000/portfolios/').then(response  => (
              this.portfoliotabs = response.data
          )
      );
    },
    length (val) {
      this.tab = val - 1
    },
  },
}
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}

</style>