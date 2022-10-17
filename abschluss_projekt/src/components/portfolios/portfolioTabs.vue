<template>
  <v-container>
    <v-card
        v-if="loading === false"
        class="d-flex justify-end" width="1205"
       >
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

    <add-portfolio
      v-if="addPortfolio === true"
      v-on:close-add-portfolio="closeCreatePortfolio  "
    ></add-portfolio>

    <div>
      <create-position
        class="addPosition"
        v-if="addPosition === true"
        v-on:close-positions="closeAddPosition"
      >
      </create-position>
      <delete-position
        class="deletePosition"
        v-if="deletePosition === true"
        v-on:close-delete-positions="closeDeletePosition"
        v-on:update-positions="updatePositions"
      >
      </delete-position>
      <v-card
          class="tableCard d-flex-row"
          v-if="addPosition !== true && addPortfolio !== true && deletePosition != true"
      >
        <v-btn
            type="submit"
            class="button"
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
            dark
            @click.prevent="openAddPosition"
        >
          <v-icon
              style="color: red"
          >mdi-plus</v-icon>
        </v-btn>
        <v-tabs
            class="tabs"
        >
          <v-tab
              class="menueTabs"
              v-for="item in menueTabs"
              :key="item.value"
              @click="changePositions(item.value)"
          >
            {{ item.text }}
          </v-tab>
        </v-tabs>
        <real-time-table
          class="justify-start"
          v-on:open-search-bar="isSearch"
          v-on:close-search-bar="isNotSearch"
        />
        <v-data-table
          v-if="addPosition !== true && addPortfolio !== true && deletePosition !== true && search !== true && this.watchTable !== true && positions.length > 0"
          class="v-data-table"
          :headers="headers"
          :items="positions"
          must-sort
          sort-desc
        >

          <template v-slot:[`item.value`]="{ item }">
            {{ item.price * item.quantity.toString().replace('-','') + ' €'}}
          </template>

          <template v-slot:[`item.price`]="{ item }">
            {{ item.price + ' €'}}
          </template>

          <template v-slot:[`item.action`]="{ item }">
            <v-icon
              @click="openDeletePosition(item.id, item.name)"
            >mdi-delete</v-icon>
          </template>

          <template v-slot:[`item.bns`]="{ item }">
            <v-icon
                v-if="item.quantity < 0"
                class="sellIcon"
            >mdi-arrow-down-bold</v-icon>
            <v-icon
                v-if="item.quantity > 0"
                class="buyIcon"
            >mdi-arrow-up-bold</v-icon>
          </template>

        </v-data-table>

        <v-data-table
          v-if="addPosition !== true && addPortfolio !== true && deletePosition !== true && search !== true && this.transactionTable !== true && this.watchers.length > 0"
          class="v-data-table"
          :headers="watchHeaders"
          :items="watchers"
          must-sort
          sort-desc
        >

        </v-data-table>
      </v-card>
      <div
          v-if="loading === true"
      >
        <v-progress-circular
            class="loading"
            :size="50"
            indeterminate
        ></v-progress-circular>
      </div>
    </div>
  </v-container>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import app from "../../../firebase";
import { getFirestore } from "firebase/firestore";
import CreatePosition from "@/components/positions/createPosition";
import deletePosition from "@/components/positions/deletePosition";
import AddPortfolio from "@/components/portfolios/addPortfolio";
import RealTimeTable from "@/components/realtimedata/realTimeTable";

export default {
  name: "portfolioTabs",
  components: {RealTimeTable, AddPortfolio, CreatePosition, deletePosition},
  data: () => ({
    loading: true,
    search: false,
    addPortfolio: false,
    addPosition: false,
    deletePosition: false,
    transactionTable: false,
    watchTable: false,
    portfolioName: '',
    positions: [],
    watchers: [],
    user: '',
    portfoliotabs: [],
    menueTabs: [
      {text: 'Transaktionen', value: 'transactions'},
      {text: 'Beobachten', value: 'watch'},
    ],
    headers: [
      {text: 'Buy/Sell', value: 'bns', align: 'end'},
      {text: 'Name', value: 'name', align: 'left'},
      {text: 'ISIN', value: 'isin', align: 'left'},
      {text: 'Anzahl', value: 'quantity', align: 'left'},
      {text: 'Kaufdatum', value: 'created', align: 'left'},
      {text: 'Stückpreis', value: 'price', align: 'left'},
      {text: 'Gesamtpreis', value: 'value', align: 'left'},
      {text: 'Aktion', value: 'action', sortable: false, align: 'left'},

    ],
    watchHeaders: [
      {text: 'Name', value: 'name', align: 'left'},
      {text: 'Währung', value: 'currency', align: 'left'},
      {text: 'Symbol', value: 'symbol', align: 'left'},
      {text: 'Price', value: 'currentPrice', align: 'left'},
      {text: 'Aktion', value: 'action', sortable: false, align: 'left'},

    ]
  }),
  methods: {
    changePositions(position) {
      if (position === 'transactions') {
        this.transactionTable = true
        this.watchTable = false
        this.getPositions(localStorage.portfolioID)
      }
      if (position === 'watch') {
        this.watchTable = true
        this.transactionTable = false
        this.getWatchers(localStorage.portfolioID)
      }
    },
    isSearch() {
      this.search = true
    },
    isNotSearch() {
      this.getWatchers(localStorage.portfolioID)   
      this.search = false

    },
    openAddPosition() {
      this.addPosition = true
    },
    closeAddPosition() {
      this.addPosition = false
    },
    openDeletePosition(id, name) {
      this.deletePosition = true
      localStorage.positionID = id
      localStorage.positionName = name
      localStorage.positions = this.positions
    },
    closeDeletePosition() {
      this.deletePosition = false
    },
    openAddPortfolio() {
      this.addPortfolio = true
    },

    closeCreatePortfolio() {
      this.addPortfolio = false
      this.fetchPortfolios()
    },

    safePortfolioID(portfolioID) {
      localStorage.portfolioID = portfolioID
    },

    updatePositions() {
      const portfolioID = localStorage.portfolioID
      this.getPositions(portfolioID)
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

    async getWatchers(id) {

      this.safePortfolioID(id)

      const db = getFirestore(app);
      const docRef = doc(db, "watch", this.user);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const JSONString = JSON.stringify(docSnap.data());
        const JSONObject = JSON.parse(JSONString);
        // console.log(JSONObject.watch)

        this.watchers = JSONObject.watch.filter(watch => watch.portfolioID == id);
        // console.log(this.watchers)

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
      else {
        this.portfoliotabs = ''
      }
    },
  },
  watch: {
    portfoliotabs() {
      this.loading = false
    },

    addPosition() {
      if(this.addPosition === false) {
        this.getPositions(localStorage.portfolioID)
      }
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
.sellIcon {
  color: red;
}
.buyIcon {
  color: green;
}
.tableCard {
  margin-top: 10px;
}

.loading {
  margin-top: 80px;
  color: red;
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
</style>