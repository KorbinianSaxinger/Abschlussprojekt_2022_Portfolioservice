<template>
  <v-container>
    <v-card
        v-if="portfoliotabs != ''"
        class="d-flex justify-end" width="1205">
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
        dark
        @click.prevent="openAddPortfolio"
      >
        <v-icon
          style="color: green"
        >mdi-plus</v-icon>
      </v-btn>
      <v-btn
          type="submit"
          class="addPositionBtn"
          color="green"
          dark
          @click.prevent="openAddPosition"
      >
        <v-icon
            style="color: red"
        >mdi-plus</v-icon>
      </v-btn>
    </v-card>
    <div
      v-if="portfoliotabs == ''"
    >
      <v-progress-circular
          class="loading"
          :size="50"
          indeterminate
      ></v-progress-circular>
    </div>
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
      <create-position
        class="addPosition"
        v-if="addPosition === true"
        v-on:close-positions="closeAddPosition"
      >
      </create-position>
      <v-data-table
        v-if="addPosition !== true && addPortfolio !== true && positions.length > 0"
        class="v-data-table"
        :headers="headers"
        :items="positions"
        must-sort
        sort-desc
      >

        <template v-slot:[`item.value`]="{ item }">
          {{ item.price * item.quantity + ' €'}}
        </template>

        <template v-slot:[`item.price`]="{ item }">
          {{ item.price + ' €'}}
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <v-icon
            @click="deletePosition(item.id)"
          >mdi-delete</v-icon>
        </template>

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
import CreatePosition from "@/components/positions/createPosition";

export default {
  name: "portfolioTabs",
  components: {CreatePosition},
  data: () => ({
    addPortfolio: false,
    addPosition: false,
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
      {text: 'Gesamtpreis', value: 'value', align: 'left'},
      {text: 'Aktion', value: 'action', sortable: false, align: 'left'},

    ]
  }),
  methods: {
    openAddPosition() {
      this.addPosition = true
    },
    closeAddPosition() {
      this.addPosition = false
    },
    openAddPortfolio() {
      this.addPortfolio = true
    },

    deletePosition(id) {
      console.log(id)
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
        // console.log("LAK DU CHUND")
      }
    },

    closeCreatePortfolio() {
      this.addPortfolio = false
    },

    safePortfolioID(portfolioID) {
      localStorage.portfolioID = portfolioID
    },

    async getPositions(id) {

      this.safePortfolioID(id)

      const db = getFirestore(app);
      const docRef = doc(db, "positions", this.user);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const JSONString = JSON.stringify(docSnap.data());
        const JSONObject = JSON.parse(JSONString);
        this.positions = JSONObject.positions.filter(position => position.portfolioId == id);
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
  watch: {
    addPosition() {
      if(this.addPosition === false) {
        // console.log(localStorage.portfolioID)
        this.getPositions(localStorage.portfolioID)
      }
      console.log('positionChanged')
    }
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
.loading {
  margin-top: 80px;
  color: red;
}
.button {
  position: absolute;
  margin: 6px 0px 0px 1120px;
}
.addPositionBtn {
  position: absolute;
  margin: 6px 0px 0px 1200px;
}
.tabs {
  color: green;
  background-color: green;
}
.v-data-table {
  margin-top: 20px;
  border-radius: 10px;
}
.addPosition {
  margin: 10px 0% 0px 30%;
  width: 600px;
  height: 200px;
  border-color: black;
  border-radius: 10px
}
.addcard {
  margin: 10px 0% 0px 35%;
  width: 300px;
  height: 200px;
  border-color: black;
  border-radius: 10px
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