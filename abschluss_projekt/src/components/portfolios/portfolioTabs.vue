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
            @click="getTableData(item.id)"
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
          class="tableCard"
          v-if="addPosition !== true && addPortfolio !== true && deletePosition != true"
      >

          <v-icon
            class="plusIcon d-flex"
            style="color: forestgreen"
            @click.prevent="openAddPortfolio"

          >
            mdi-plus
          </v-icon>

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
        <v-btn
          @click="getPrice"
        >Preise laden</v-btn>
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
          sort-by="name"
          must-sort
          sort-asc
        >
          <template v-slot:[`item.buyValue`]="{ item }">
            {{ formatNumber(item.price * item.quantity, item.currency).replace('-','') }} <span class="currency"> {{ currency }}</span>
          </template>

          <template v-slot:[`item.value`]="{ item }">
            <div
              v-if="parseFloat(currentPrice(item.symbol, item.price, item.currency, item.quantity).replace('-','')) > replaceMinus(item.price * item.quantity)"
              class="upValue"
            >
                {{ currentPrice(item.symbol, item.price, item.currency, item.quantity).replace('-','') }} <span class="currency"> {{ currency }}</span>
            </div>
            <div
                v-if="parseFloat(currentPrice(item.symbol, item.price, item.currency, item.quantity).replace('-','')) < replaceMinus(item.price * item.quantity)"
                class="downValue"
            >
              {{ currentPrice(item.symbol, item.price, item.currency, item.quantity).replace('-','') }} <span class="currency"> {{ currency }}</span>
            </div>
            <div
                v-if="parseFloat(currentPrice(item.symbol, item.price, item.currency, item.quantity).replace('-','')) === replaceMinus(item.price * item.quantity)"
            >
              {{ currentPrice(item.symbol, item.price, item.currency, item.quantity).replace('-','') }} <span class="currency"> {{ currency }}</span>
            </div>
          </template>

          <template v-slot:[`item.price`]="{ item }">
            {{ formatNumber(item.price, item.currency, item.conversion)  }} <span class="currency"> {{ currency }}</span>
          </template>

          <template v-slot:[`item.currentPrice`]="{ item }">
            <div v-if="currentPrice(item.symbol) > item.price"
              class="upValue"
            >
              {{ currentPrice(item.symbol, item.price, item.currency) }} <span class="currency"> {{ currency }}</span>
            </div>
            <div v-if="currentPrice(item.symbol) < item.price"
              class="downValue"
            >
              {{ currentPrice(item.symbol, item.price, item.currency) }} <span class="currency"> {{ currency }}</span>
            </div>
            <div v-if="currentPrice(item.symbol) == item.price"
            >
              {{ currentPrice(item.symbol, item.price, item.currency) }} <span class="currency"> {{ currency }}</span>
            </div>
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
          v-if="addPosition !== true && addPortfolio !== true && deletePosition !== true && search !== true && this.transactionTable !== true && this.watchTable === true && this.watchers.length > 0"
          class="v-data-table elevation-1"
          :headers="watchHeaders"
          :items="watchers"
          must-sort
          sort-asc
          sort-by="name"
          :items-per-page="10"
          v-on:watchlist="getWatchers(localStorage.portfolioID)"

        >
          <template v-slot:[`item.action`]="{ item }">
            <v-icon
              @click.prevent="createPosition(item.symbol, item.name, item.currency, item.currentPrice)"
            >
              mdi-cart-outline
            </v-icon>
          </template>

          <template v-slot:[`item.currentPrice`]="{ item }">
            {{ formatNumber(item.currentPrice, item.currency) }} <span class="currency"> {{ currency }}</span>

          </template>

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
import {doc, getDoc, setDoc} from "firebase/firestore";
import app from "../../../firebase";
import { getFirestore } from "firebase/firestore";
import CreatePosition from "@/components/positions/createPosition";
import deletePosition from "@/components/positions/deletePosition";
import AddPortfolio from "@/components/portfolios/addPortfolio";
import RealTimeTable from "@/components/realtimedata/realTimeTable";
import axios from "axios";
// import finnhub from "finnhub";

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
    addedWatcher: false,
    portfolioName: '',
    positions: [],
    watchers: [],
    allWatchers: [],
    newWatchers: [],
    conversion: 1.0141,
    currency: '€',
    user: '',
    portfoliotabs: [],
    menueTabs: [
      {text: 'Transaktionen', value: 'transactions'},
      {text: 'Beobachten', value: 'watch'},
    ],
    headers: [
      {text: 'Buy/Sell', value: 'bns', align: 'end'},
      {text: 'Name', value: 'name', align: 'left'},
      // {text: 'Symbol', value: 'symbol', align: 'left'},
      {text: 'Anzahl', value: 'quantity', align: 'left'},
      {text: 'Einkaufskurs', value: 'price', align: 'left'},
      {text: 'Kurs', value: 'currentPrice', align: 'left'},
      {text: 'EK / VK Wert', value: 'buyValue', align: 'left'},
      {text: 'Wert', value: 'value', align: 'left'},
      {text: 'Kaufdatum', value: 'created', align: 'left'},
      {text: 'Aktion', value: 'action', sortable: false, align: 'center'},

    ],
    watchHeaders: [
      {text: 'Name', value: 'name', align: 'left'},
      {text: 'Währung', value: 'currency', align: 'left'},
      {text: 'Symbol', value: 'symbol', align: 'left'},
      {text: 'Price', value: 'currentPrice', align: 'left'},
      {text: 'Aktion', value: 'action', sortable: false, align: 'center'},

    ]
  }),
  methods: {
    formatNumber(number, currency, conv) {
      let conversion = this.conversion
      if (number && conv) {
        let value = number * conv
        return parseFloat(value).toFixed(3).replace('.', ',')
      }
      if (number && currency != null){
        let value = number * conversion
        return parseFloat(value).toFixed(3).replace('.',',')
      }else {
        return parseFloat(number)
      }
    },
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
        // this.getPrice()
      }
    },
    createPosition(symbol, name, currency, currentPrice) {
      localStorage.symbol = symbol
      localStorage.transactionName = name
      localStorage.currency = currency
      localStorage.currentPrice = currentPrice
      this.addPosition = true
    },
    currentPrice(symbol, wert, currency, quantity) {
      let price = this.watchers.filter(watch => watch.symbol === symbol)
      if (!quantity && price.length > 0) {
        let values = Object.values(price);
        return this.formatNumber(values[0].currentPrice, currency)
      }
      if (!quantity && price.length <= 0){
        return this.formatNumber(wert, currency)
      }
      if (quantity && price.length > 0) {
        let values = Object.values(price);
        return this.formatNumber(quantity * values[0].currentPrice, currency)
      } else {
        return this.formatNumber(wert, currency)
      }

    },
    getConversion(from, to) {
      const options = {
        method: 'GET',
        url: 'https://currency-converter18.p.rapidapi.com/api/v1/convert',
        params: {from: from, to: to, amount: '1'},
        headers: {
          'X-RapidAPI-Key': '58ce557142msh90b2532927f2240p16a65cjsnc9bdc393aff9',
          'X-RapidAPI-Host': 'currency-converter18.p.rapidapi.com'
        }
      };

      axios.request(options).then(function (response) {
        localStorage.conversionRate = response.data.result.convertedAmount
      }).catch(function (error) {
        console.error(error);
      });
    },
    getPrice()
    {
      this.newWatchers = []
      let id = localStorage.portfolioID
      const finnhub = require('finnhub');
      const api_key = finnhub.ApiClient.instance.authentications['api_key'];
      api_key.apiKey = "cdc2m32ad3i6ap45idvgcdc2m32ad3i6ap45ie00"
      const finnhubClient = new finnhub.DefaultApi()

      for (let i = 0; i < this.allWatchers.length; i++) {
        if (this.allWatchers[i].portfolioID === id) {
          let symbol = this.allWatchers[i].symbol

          finnhubClient.quote(symbol, (error, data, response) => {
            if (error) {
              // console.log(error)
              console.log(response)
            }

            let update = {
              currency: this.allWatchers[i].currency,
              currentPrice: data.c,
              name: this.allWatchers[i].name,
              portfolioID: this.allWatchers[i].portfolioID,
              symbol: this.allWatchers[i].symbol,
            }

            this.newWatchers.push(update)

            const newPrice = {
              watch: this.newWatchers
            }

            try {
              const db = getFirestore(app);
              setDoc(doc(db, "watch", this.user), newPrice);
            } catch (e) {
              console.error("Error add ing document: ", e);
            }
          });
        } else {
          let update = {
            currency: this.allWatchers[i].currency,
            currentPrice: this.allWatchers[i].currentPrice,
            name: this.allWatchers[i].name,
            portfolioID: this.allWatchers[i].portfolioID,
            symbol: this.allWatchers[i].symbol,
          }

          this.newWatchers.push(update)

          const newPrice = {
            watch: this.newWatchers
          }

          try {
            const db = getFirestore(app);
            setDoc(doc(db, "watch", this.user), newPrice);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }
      }
      setTimeout(() => {
        this.getWatchers(localStorage.portfolioID)
      }, 500)
    },


    isSearch() {
      this.search = true
    },
    isNotSearch() {
      this.search = false

      setTimeout(() => {
        this.getWatchers(localStorage.portfolioID)
      }, 500)

      if (this.addedWatcher === false) {
        this.addedWatcher = true
      } else {
        this.addedWatcher = false
      }

    },
    openAddPosition() {
      this.addPosition = true
    },
    closeAddPosition() {
      this.getPositions(localStorage.portfolioID)
      this.transactionTable = true
      this.watchTable = false
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
    getTableData(id) {
      this.safePortfolioID(id)
      this.getPositions(id)
      this.getWatchers(id)
    },
    replaceMinus(value) {
      return parseFloat(value.toString().replace('-',''))
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
        this.allWatchers = JSONObject.watch
        this.watchers = JSONObject.watch.filter(watch => watch.portfolioID == id);
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
    addedWatcher() {
      setTimeout(() => {
        this.getPrice()
      }, 1000)
    },
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
    this.getConversion('USD', 'EUR')
    const auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user.uid;
        await this.fetchPortfolios();
        await this.getPositions(localStorage.portfolioID);
        await this.getWatchers(localStorage.portfolioID)
      }
    });
  },
}
</script>

<style scoped>
.currency {
  color: black;
}
.plusIcon {
  padding-top: 5px;
  margin: 0px 0px 0px 5px;
}
.upValue {
  color: forestgreen;
}
.downValue {
  color: red
}
.sellIcon {
  color: red;
}
.buyIcon {
  color: forestgreen;
}
.tableCard {
  margin-top: 10px;
}

.loading {
  margin-top: 80px;
  color: red;
}

.tabs {
  color: forestgreen;
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