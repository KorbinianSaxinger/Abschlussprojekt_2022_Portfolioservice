<template>
  <v-container>

    <v-card class="d-flex justify-end" width="1045">

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
          class="createButton d-inline-flex text-center"
          width="100"
          @click.prevent="createPortfolio"
      >
        Erstellen
      </v-btn>
    </v-card>

    <div>
      <v-data-table
          v-if="addPortfolio !== true && positions.length > 0"
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
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setDoc  } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import app from "../../../firebase";
import { getFirestore } from "firebase/firestore";


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
      {text: 'Name', value: 'name', align: 'left'},
      {text: 'ISIN', value: 'isin', align: 'left'},
      {text: 'Anzahl', value: 'quantity', align: 'left'},
      {text: 'Kaufdatum', value: 'created', align: 'left'},
      {text: 'Preis', value: 'price', align: 'left'},
      {text: 'Aktion', value: '', sortable: false, align: 'left'},

    ]
  }),
  methods: {
    openPortfolioCard() {
      this.addPortfolio = true
    },

    idExists(id) {
      return this.portfoliotabs.filter(portfolio => portfolio.id === id).length > 0;
    },

    PortfolioExists(name) {
      return this.portfoliotabs.filter(portfolio => portfolio.name.toUpperCase() === name.toUpperCase()).length > 0;
    },

    GetNewPortfolioID() {
      const portfolios = this.portfoliotabs.length
      if(portfolios < 1) return 0
      return this.portfoliotabs[portfolios-1].id + 1
    },

    async createPortfolio() {
      if(!this.PortfolioExists(this.portfolioName)) {
        const userPortfolios = [];
        for (let i = 0; i < this.portfoliotabs.length; i++) {
          const portfolio =  this.portfoliotabs[i];
          userPortfolios.push(portfolio);
        }

        const createdPortfolio = {
          name: this.portfolioName,
          id: this.GetNewPortfolioID()
        };
        userPortfolios.push(createdPortfolio);

        const portfolio = {
          portfolios: userPortfolios
        };

        try {
          const db = getFirestore(app);
          await setDoc(doc(db, "portfolios", this.user), portfolio);
        } catch (e) {
          console.error("Error adding document: ", e);
        }

        await this.fetchPortfolios()
        this.addPortfolio = false
      } else {
        console.log("LAK DU CHUND")
      }
    },

    closeCreatePortfolio() {
      this.addPortfolio = false
    },

    async getPositions(id) {
      const db = getFirestore(app);
      const docRef = doc(db, "positions", this.user);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const JSONString = JSON.stringify(docSnap.data());
        const JSONObject = JSON.parse(JSONString);
        this.positions = JSONObject.positions.filter(position => position.portfolioId === id);
      }
    },

    async fetchPortfolios() {
      const db = getFirestore(app);
      const docRef = doc(db, "portfolios", this.user);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const JSONString = JSON.stringify(docSnap.data());
        const JSONObject = JSON.parse(JSONString);
        this.portfoliotabs = JSONObject.portfolios;
      }
    },
  },
  computed: {


  },
  beforeCreate() {

  },
  mounted() {
    const auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user.uid;
        await this.fetchPortfolios();
        await this.getPositions(this.portfoliotabs[0].id);
      }
    });
  },
}
</script>

<style scoped>
.button {
  position: fixed;
  margin: 6px 0px 0px 1050px;
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