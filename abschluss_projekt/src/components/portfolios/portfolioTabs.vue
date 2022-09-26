<template>
  <v-container>

    <v-card class="d-flex justify-end" width="1045">
      <v-btn
          type="submit"
          class="button"
          color="green"
          @click.prevent="openPortfolioCard"
      >
        <v-icon
            style="color: green"
        >mdi-plus</v-icon>
      </v-btn>
      <v-tabs
          class="tabs"
      >
        <v-tab
            class="testCard"
            v-for="item in portfoliotabs"
            :key="item.id"
            @click="getPositions(item.id)"
        >
            {{ item.name }}
        </v-tab>
      </v-tabs>

    </v-card>

    <v-card
        v-if="addPortfolio === true"
        class="addcard"
        rounded
    >
      <v-card-title>
        Portfolio erstellen
        <v-icon
            class="iconClose d-flex"
            @click.prevent="closeCreatePortfolio"
        >mdi-close
        </v-icon>
      </v-card-title>
      <v-text-field
        class="text-field d-flex"
        label="Portfolio Name"
        v-model="portfolioName"
        outlined
      >
      </v-text-field>
      <v-btn
          type="submit"
          class="button d-inline-flex text-center"
          width="100"
          @click.prevent="createPortfolio"
      >
        Erstellen
      </v-btn>
    </v-card>

    <div>
      <v-data-table
          v-if="addPortfolio !== true"
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
    addPortfolio: false,
    portfolioName: '',
    positions: [],
    user: '',
    portfolio: '',
    portfoliotabs: [],
    headers: [
      {text: 'id', value: 'id'},
      {text: 'Portfolio', value: 'id'},
      {text: 'Name', value: 'name'},
      {text: 'ISIN', value: 'isin'},
      {text: 'Anzahl', value: 'qty'},
      {text: 'Kaufdatum', value: 'created'},
      {text: 'Preis', value: 'price'},
      {text: 'Aktion', value: '', sortable: false},

    ]
  }),
  methods: {
    openPortfolioCard() {
      this.addPortfolio = true
    },

    createPortfolio() {
      // Simple POST request with a JSON body using axios
      const portfolio = {
        id: null,
        userId: this.user,
        name: this.portfolioName
      };
      axios.post("http://localhost:3000/portfolios/", portfolio)
          .then(response => this.portfolio = response.data.id)
          .finally(() => {

          });
      // console.log(this.portfolioName)
      this.fetchPortfolios()
      this.addPortfolio = false
    },

    closeCreatePortfolio() {
      this.addPortfolio = false
    },
    getPositions(id) {
      const strid = id.toString()
      const url = 'http://localhost:3000/positions/?portfolioId=' + strid
      axios.get(url).then(response  => (
              this.positions = response.data
          )
      ).finally(() =>
          // console.log(this.positions[0].id)
          console.log('switched portfolio')
      );
    },
    fetchPortfolios() {
      const auth = getAuth(app);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user = user.uid;
          const url = 'http://localhost:3000/portfolios/?userId=' + this.user

          axios.get(url).then(response  => (
                  this.portfoliotabs = response.data
              )
          ).finally(() => {

          });
          // ...
        } else {
          // User is signed out
          // ...
        }
      });
    },
    fetchPositions() {
      const auth = getAuth(app);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const strid = this.portfoliotabs[0].id
          //
          const url = 'http://localhost:3000/positions/?portfolioId=' + strid

          axios.get(url).then(response  => (
                  this.positions = response.data
              )
          );
        } else {
          // User is signed out
          // ...
        }
      });
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
          const strid = this.portfoliotabs[0].id
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
}
</script>

<style scoped>
.button {
  /*position: relative;*/
  margin: 6px 0px 0px 0px;
}
.tabs {
  color: green;
  background-color: green;
}
.v-data-table {
  margin-top: 20px;
  border-radius: 10px;
}
.addcard {
  margin: 10px 0% 0px 35%;
  width: 300px;
  height: 200px;
  border-color: black;
  border-radius: 0px 10px 0px 10px;
}
.iconClose {
  margin-left: 80px;
  color: green;
}
.text-field {
  margin-left: 50px;
  width: 200px;
  justify-content: center;
}
</style>