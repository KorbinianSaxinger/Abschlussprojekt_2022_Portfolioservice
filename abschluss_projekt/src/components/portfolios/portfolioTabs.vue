<template>
  <v-container>
    <v-card
      v-if="loading === false"
      class="mainCard d-flex justify-end"
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
      <delete-portfolio
        v-if="deletePortfolio === true"
        v-on:close-delete-portfolio="closeDeletePortfolio"
        v-on:update-portfolios="updatePortfolios"
      />

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
      <delete-watchers
        class="deleteWatchers"
        v-if="deleteWatchers === true"
        v-on:close-delete-watchers="closeDeleteWatchers"
      >
      </delete-watchers>

      <v-card
        class="tableCard"
        v-if="addPosition !== true && addPortfolio !== true && deletePosition != true && deleteWatchers !== true && deletePortfolio !== true"
      >
        <v-app id="inspire">
          <div class="iconWrapper">
            <div class="menuIcons d-flex">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    style="color: forestgreen;"
                    @click.prevent="openAddPortfolio"
                    v-on="on"
                    dark
                  >
                    mdi-plus
                  </v-icon>
                </template>
                <span>Portfolio erstellen</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    style="color: forestgreen;"
                    @click.prevent="openDeletePortfolio(portfolioID)"
                    v-on="on"
                    dark
                  >
                    mdi-minus
                  </v-icon>
                </template>
                <span>Portfolio löschen</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon
                    style="color: forestgreen;"
                    @click.prevent="getPrice"
                    v-on="on"
                    dark
                  >
                    mdi-replay
                  </v-icon>
                </template>
                <span>Preise neu laden</span>
              </v-tooltip>
            </div>
          </div>
        </v-app>

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
        <v-app id="transactionTable">
          <v-alert class="alert v-alert" v-if="this.alert !== '' && this.transactionTable === true || this.alert !== '' && this.watchTable === true">
            {{ alert }}
          </v-alert>
        <v-data-table
          v-if="positions.length != 0 && addPosition !== true && addPortfolio !== true && deletePosition !== true && search !== true && this.watchTable !== true && this.deleteWatchers != true && positions.length > 0"
          class="v-data-table"
          :headers="headers"
          :items="positions"
          sort-by="name"
          must-sort
          sort-asc
        >
          <template v-slot:[`item.name`]="{ item }">
            <div v-if="item.name.length < 25">
              {{ item.name }}
            </div>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <span
                    v-if="item.name.length > 25"
                  v-bind="attrs"
                  v-on="on"
                > {{ item.name.substr(0,20) + '...'}}</span>
              </template>
              <span> {{ item.name }}</span>
            </v-tooltip>
          </template>
            <template v-slot:[`item.buyValue`]="{ item }">
              {{ formatNumber(item.price * item.quantity, item.currency, item.conversion).replace('-','') }} <span class="currency"> {{ currency }}</span>
            </template>

            <template v-slot:[`item.value`]="{ item }">
              <div
                v-if="currentPrice(item.symbol, item.price, item.currency, item.quantity).replace('-','') === formatNumber(item.price * item.quantity, item.currency, item.conversion).replace('-','')"
                class="normalValue"
              >
                {{ currentPrice(item.symbol, item.price, item.currency, item.quantity).replace('-','').replace('.',',') }} <span class="currency"> {{ currency }}</span>
              </div>
                <div
                  v-if="currentPrice(item.symbol, item.price, item.currency, item.quantity).replace('-','') > formatNumber(item.price * item.quantity, item.currency, item.conversion).replace('-','')"
                  class="upValue"
                >
                  {{ currentPrice(item.symbol, item.price, item.currency, item.quantity).replace('-','') }} <span class="currency"> {{ currency }}</span>
                </div>
                  <div
                    v-if="currentPrice(item.symbol, item.price, item.currency, item.quantity).replace('-','') < formatNumber(item.price * item.quantity, item.currency, item.conversion).replace('-','')"
                    class="downValue"
                  >
                    {{ currentPrice(item.symbol, item.price, item.currency, item.quantity).replace('-','') }} <span class="currency"> {{ currency }}</span>
                  </div>
            </template>
              <template v-slot:[`item.price`]="{ item }">
                {{ formatNumber(item.price, item.currency, item.conversion)  }} <span class="currency"> {{ currency }}</span>
              </template>
              <template v-slot:[`item.currentPrice`]="{ item }">
                <div v-if="(item.price * item.conversion).toFixed(3) < (currentPrice(item.symbol) * conversion).toFixed(3)"
                  class="upValue"
                >
                  {{ currentPrice(item.symbol, item.price, item.currency) }} <span class="currency"> {{ currency }}</span>
                </div>
                  <div v-if="(item.price * item.conversion).toFixed(3) > (currentPrice(item.symbol) * conversion).toFixed(3)"
                    class="downValue"
                  >
                    {{ currentPrice(item.symbol, item.price, item.currency) }} <span class="currency"> {{ currency }}</span>
                  </div>
                <div v-if="(item.price * item.conversion).toFixed(3) === (currentPrice(item.symbol) * conversion).toFixed(3)"
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
          <v-card
            class="watchTable"
          >
            <search-bar
              v-if="watchTable === true"
              class="search justify-start"
              v-on:open-search-bar="isSearch"
              v-on:close-search-bar="isNotSearch"
            />
            <v-data-table
              v-if="watchers.length != 0 && addPosition !== true && addPortfolio !== true && deletePosition !== true && search !== true && this.transactionTable !== true && this.watchTable === true && this.deleteWatchers != true && this.watchers.length > 0"
              class="v-data-table"
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
                  v-if="item.currentPrice > 0"
                  @click.prevent="createPosition(item.symbol, item.name, item.currency, item.currentPrice)"
                >
                  mdi-cart-outline
                </v-icon>
                <v-icon
                    v-if="item.currentPrice <= 0"
                >
                  mdi-cart-off
                </v-icon>
                <v-icon
                  @click.prevent="openDeleteWatcher(item.symbol, item.name)"
                >
                  mdi-delete
                </v-icon>
              </template>
              <template v-slot:[`item.currentPrice`]="{ item }">
                {{ formatNumber(item.currentPrice, item.currency) }} <span class="currency"> {{ currency }}</span>
              </template>
            </v-data-table>
          </v-card>
        </v-app>
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
import axios from "axios";
import SearchBar from "@/components/realtimedata/searchBar";
import DeletePortfolio from "@/components/portfolios/deletePortfolio";
import DeleteWatchers from "@/components/watchers/deleteWatchers";
// import finnhub from "finnhub";

export default {
  name: "portfolioTabs",
  components: {DeleteWatchers, DeletePortfolio, SearchBar, AddPortfolio, CreatePosition, deletePosition},
  data: () => ({
    loading: true,
    search: false,
    addPortfolio: false,
    addPosition: false,
    deletePosition: false,
    deleteWatchers: false,
    deletePortfolio: false,
    transactionTable: false,
    watchTable: false,
    addedWatcher: false,
    portfolioID: null,
    positions: [],
    watchers: [],
    allWatchers: [],
    newWatchers: [],
    portfolioName: '',
    alert: '',
    conversion: 1.0,
    conf: 0,
    currency: '€',
    price: 0,
    user: '',
    portfoliotabs: [],
    menueTabs: [
      {text: 'Transaktionen', value: 'transactions'},
      {text: 'Beobachten', value: 'watch'},
    ],
    headers: [
      {text: 'Buy/Sell', value: 'bns', align: 'center', },
      {text: 'Name', value: 'name', align: 'left', width: '200px'},
      // {text: 'Symbol', value: 'symbol', align: 'left'},
      {text: 'Anzahl', value: 'quantity', align: 'center'},
      {text: 'EK / VK Kurs', value: 'price', align: 'left'},
      {text: 'Kurs', value: 'currentPrice', align: 'left', sortable: false},
      {text: 'EK / VK Wert', value: 'buyValue', align: 'left', sortable: false},
      {text: 'Wert', value: 'value', align: 'left', sortable: false},
      {text: 'Kaufdatum', value: 'created', align: 'left'},
      {text: 'Aktion', value: 'action', sortable: false, align: 'center'},

    ],
    watchHeaders: [
      {text: 'Name', value: 'name', align: 'left', width: '350px'},
      {text: 'Währung', value: 'currency', align: 'center'},
      {text: 'Symbol', value: 'symbol', align: 'center'},
      {text: 'Preis', value: 'currentPrice', align: 'center'},
      {text: 'Aktion', value: 'action', sortable: false, align: 'center'},

    ]
  }),
  methods: {
    updatePortfolios() {
      this.fetchPortfolios()
      setTimeout(() => {
        const id = this.portfoliotabs[this.portfoliotabs.length-1].id
        this.getPositions(id)
      }, 500)

    },
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
      const apiKey1 = 'a14022da84mshd39087a3bdc041ep1624c9jsn1ef31b2c1017'
      // const apiKey2 = 'b0dd61db1bmsh8ae2c8259016a03p143951jsn942adff6fa38'
      const options = {
        method: 'GET',
        url: 'https://currency-converter18.p.rapidapi.com/api/v1/convert',
        params: {from: from, to: to, amount: '1'},
        headers: {
          'X-RapidAPI-Key': apiKey1,
          'X-RapidAPI-Host': 'currency-converter18.p.rapidapi.com'
        }
      };

      axios.request(options).then(function (response) {
        localStorage.conversionRate = response.data.result.convertedAmount
      }).catch(function (error) {
        console.error(error);
      });
      this.conf += 1
    },
    getPrice()
    {
      this.price = 0
      let id = parseFloat(localStorage.portfolioID)
      const apiKey = 'cdc2m32ad3i6ap45idvgcdc2m32ad3i6ap45ie00'  // K.S
      // const apiKey = 'cdeh2pqad3ifdqf13890cdeh2pqad3ifdqf1389g'     //ko

      this.getWatchers(id)
      this.getConversion('USD', 'EUR')

      setTimeout(() => {

      this.newWatchers = []
      const finnhub = require('finnhub');
      const api_key = finnhub.ApiClient.instance.authentications['api_key'];
      api_key.apiKey = apiKey
      const finnhubClient = new finnhub.DefaultApi()

      for (let i = 0; i < this.allWatchers.length; i++) {
        if (this.allWatchers[i].portfolioID === id) {
          let symbol = this.allWatchers[i].symbol

          finnhubClient.quote(symbol, (error, data) => {
            if (error) {

              let keys = Object.keys(error);
              let values = keys.map(function(key) {
                return error[key];
              });

              console.log(values[1].statusCode, +' '+ values[1].text.replace('{"error":', '').replace('}', ''))

              if (values[1].statusCode === 403) {
                this.alert = symbol + ' wird noch nicht supported!'
              }
              if (values[1].statusCode === 429) {
                this.alert = 'Zu viele API calls'
              }

              let update = {
                currency: this.allWatchers[i].currency,
                currentPrice: this.allWatchers[i].currentPrice,
                name: this.allWatchers[i].name,
                portfolioID: parseFloat(this.allWatchers[i].portfolioID),
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
            } else {
              if (data) {
                this.price = data.c
              }
              let update = {
                currency: this.allWatchers[i].currency,
                currentPrice: this.price,
                name: this.allWatchers[i].name,
                portfolioID: parseFloat(this.allWatchers[i].portfolioID),
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
            }
          });
        } else {
          let update = {
            currency: this.allWatchers[i].currency,
            currentPrice: this.allWatchers[i].currentPrice,
            name: this.allWatchers[i].name,
            portfolioID: parseFloat(this.allWatchers[i].portfolioID),
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
      }, 700)

      }, 700)
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
    openDeleteWatcher(symbol, name) {
      this.watchTable = false
      // this.transactionTable = false
      this.deleteWatchers  = true
      localStorage.watcherSymbol = symbol
      localStorage.watcherName = name
      localStorage.watchers = this.watchers
    },
    openDeletePortfolio(id) {
      this.safePortfolioID(id)
      this.deletePortfolio = true
      const portfolio = this.portfoliotabs.filter(portfolio => portfolio.id == id)
      console.log(portfolio[0].name)
      localStorage.portfolioName = portfolio[0].name
    },
    closeDeletePosition() {
      this.deletePosition = false
    },
    closeDeleteWatchers() {
      this.deleteWatchers = false
    },
    closeDeletePortfolio() {
      this.deletePortfolio = false
      this.watchTable = false
      this.transactionTable = true
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
      this.portfolioID = portfolioID
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
      if (this.positions.length === 0 && this.transactionTable === true) {
        this.alert = 'Keine Einträge!'
      }
    },

    async getWatchers(id) {
      this.safePortfolioID(id)

      const db = getFirestore(app);
      const docRef = doc(db, 'watch', this.user);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const JSONString = JSON.stringify(docSnap.data());
        const JSONObject = JSON.parse(JSONString);
        this.allWatchers = JSONObject.watch
        this.watchers = JSONObject.watch.filter(watch => watch.portfolioID == id);
      }
      if (this.watchers.length === 0 && this.watchTable === true) {
        this.alert = 'Keine Einträge!'
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
    alert() {
      setTimeout(() => {
        this.alert = ''
      }, 3000)
    },
    conf() {
      this.conversion = localStorage.conversionRate
      console.log('conv ' + this.conversion)
    },
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
    this.transactionTable = true
    this.getConversion('USD', 'EUR')
    const auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user.uid;
        await this.fetchPortfolios();
        this.portfolioID = this.portfoliotabs[0].id
        await this.getPositions(this.portfolioID)
        await this.getWatchers(this.portfolioID)
      }
    });
  },
}
</script>

<style scoped>
/*@import '~vuetify/src/styles/styles.sass';*/

.name {
  
}
.alert {
  color: red;
  margin-top: 20px;
  border-radius: 10px;
}
.watchTable {
  margin-top: 20px;
  border-radius: 10px;
}
.currency {
  color: black;
}
#transactionTable {
  max-height: 0px;
}
#inspire {
  height: 40px;
}
.iconWrapper {
  height: 40px;
}
.menuIcons {
  margin: 10px 10px 10px 5px;
}
.normalValue {
  color: black;
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
  margin-top: 0px;
  border-radius: 0px;
}

.loading {
  margin-top: 80px;
  color: red;
}
.mainCard {
  border-radius: 10px 10px 0px 0px;
}
.tabs {
  color: forestgreen;
}
.v-data-table {
  margin-top: 20px;
  border-radius: 10px 10px 10px 10px;
}
.addPosition {
  margin: 10px 0% 0px 30%;
  width: 600px;
  height: 200px;
  border-color: black;
  border-radius: 10px
}
</style>