<template>
 <v-main>
   <div
    class="d-inline-flex"
   >
     <v-text-field
         v-model="searchValue"
         label="Suche"
         @focus="getWatchers()"
     >
     </v-text-field>
       <v-icon
        @click.prevent="searchStock"
        class="searchIcon"
        size="20"
       >mdi-magnify</v-icon>
     <v-icon
        @click.prevent="closeSearch"
        class="searchIcon"
       >mdi-close</v-icon>
   </div>
   <div
       v-if="alert !== ''"
       class="alert"
   >
     <br>
     {{ alert }}
   </div>
   <v-data-table
     v-if="searchResult.length > 0"
     :headers="headers"
     :items="searchResult"
     class="v-data-table"
   >

     <template v-slot:[`item.add`]="{ item }">
       <v-icon
        @click="add(item)"
       >mdi-plus</v-icon>
     </template>
   </v-data-table>
 </v-main>
</template>

<script>
import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";
import app from "../../../firebase";
import {getAuth, onAuthStateChanged} from "firebase/auth";

export default {
  name: "realTimeTable",

  data() {
    return {
      user: '',
      positionName: '',
      positionCurrency: '',
      positionSymbol: '',
      currenPrice: null,
      alert: '',
      searchValue: '',
      searchResult: [],
      positions: [],
      watchers: [],
      stockValues: {},
      break: false,
      headers: [
        {text: 'Name', value: '2. name'},
        {text: 'Symbol', value: '1. symbol'},
        {text: 'add', value: 'add', sortable: false},
      ]
    }
  },
  methods: {
    safePortfolioID(portfolioID) {
      localStorage.portfolioID = portfolioID
    },
    async getWatchers() {
      let id = localStorage.portfolioID

      this.safePortfolioID(id)

      const db = getFirestore(app);
      const docRef = doc(db, "watch", this.user);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const JSONString = JSON.stringify(docSnap.data());
        const JSONObject = JSON.parse(JSONString);
        // console.log(JSONObject.watch)

        this.watchers = JSONObject.watch;
        // console.log(this.watchers)

      } else {
        // this.alert = 'Keine Beobachteten Positionen'
      }
    },

    // async getPositions() {
    //   const id = localStorage.portfolioID
    //   console.log(id)
    //   const db = getFirestore(app);
    //   const docRef = doc(db, "watch", this.user);
    //   const docSnap = await getDoc(docRef);
    //
    //   if (docSnap.exists()) {
    //     const JSONString = JSON.stringify(docSnap.data());
    //     const JSONObject = JSON.parse(JSONString);
    //     this.positions = JSONObject.watch.filter(position => position.portfolioId == id);
    //   }
    // },

    GetNewPositionID() {
      const lastPosition = this.watchers.length
      if(lastPosition <= 0) return 0
      // console.log(this.positions)
      return this.watchers[lastPosition-1].id + 1
    },

    closeSearch() {
      this.searchResult = []
      this.$emit('close-search-bar')
    },
    getStockData(symbol) {
      let date = new Date()
      console.log(date)
      // this.stockValues = {}
      const axios = require("axios");
      const that = this

      const encodedParams = new URLSearchParams();
      encodedParams.append("symbol", symbol);
      // encodedParams.append("longName", "");

      const options = {
        method: 'POST',
        url: 'https://yahoo-finance97.p.rapidapi.com/stock-info',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'X-RapidAPI-Key': 'a14022da84mshd39087a3bdc041ep1624c9jsn1ef31b2c1017',
          'X-RapidAPI-Host': 'yahoo-finance97.p.rapidapi.com'
        },
        data: encodedParams
      };

      axios.request(options).then(function (response) {
        const JSONString = JSON.stringify(response.data);
        const JSONObject = JSON.parse(JSONString);
        // console.log("Response",response.data)
        that.changeStockValues(JSONObject.data)

      }).catch(function (error) {
        console.error(error);
      });

    },

    async add(item) {

      let keys = Object.keys(item);
      let values = keys.map(function(key) {
        return item[key];
      });

      console.log(values[0]);
      this.getStockData(values[0])
      const newPositions = this.watchers;
      console.log(newPositions)

      setTimeout(() => {
        console.log(this.positionName)
        console.log(this.positionSymbol)
        // console.log(this.positionCurrency)
        // console.log(this.currenPrice)

        const name = this.positionName
        const portfolioID = localStorage.portfolioID
        const currency = this.positionCurrency
        const symbol = this.positionSymbol
        const price = this.currenPrice

        this.positionName = ''
        this.positionSymbol = ''
        this.positionCurrency = ''
        this.currenPrice = null

        if (name === '') {
          this.closeSearch()
          return this.alert = 'Zur zeit leider nicht supported'
        }

        const createdWatch = {
          name: name,
          portfolioID: portfolioID,
          currency: currency,
          symbol: symbol,
          currentPrice: price,
          id: this.GetNewPositionID(),
        };

        newPositions.push(createdWatch);

        const addwatch = {
          watch: newPositions
        };

        try {
          const db = getFirestore(app);
          setDoc(doc(db, "watch", this.user), addwatch);
        } catch (e) {
          console.error("Error adding document: ", e);
        }

        // this.searchValue = ''
        // this.searchResult = []
        this.getWatchers()
        this.closeSearch()
      }, 4000)


      // await this.fetchPortfolios()
      // this.addPortfolio = false
      // this.closeCard()
      // this.$emit('close-positions')
      // } else {
      //   console.log("LAK DU CHUND")
      // }

      // this.$emit('get-new-watchers')
    },

    changeResult(object) {
      for (let i = 0; i < object.bestMatches.length; i++) {
        console.log(object.bestMatches[i])
        this.searchResult.push(object.bestMatches[i])
      }
    },

    changeStockValues(data) {

      if (data.longName) {
        // console.log(data.longName)
        this.positionName = data.longName
      }
      else if (data.shortName) {
        // console.log(data.shortName)
        this.positionName = data.shortName
      }
      if (data.currency) {
        this.positionCurrency = data.currency
      }
      if (data.currentPrice) {
        this.currenPrice = data.currentPrice
      }
      if (data.symbol) {
        this.positionSymbol = data.symbol
      }

      let date2 = new Date()
      console.log(date2)
    },

    searchStock(){
      this.$emit('open-search-bar')
      const search = this.searchValue
      const axios = require("axios");
      const that = this;

      const options = {
        method: 'GET',
        url: 'https://alpha-vantage.p.rapidapi.com/query',
        params: {keywords: search, function: 'SYMBOL_SEARCH', datatype: 'json'},
        headers: {
          'X-RapidAPI-Key': 'a14022da84mshd39087a3bdc041ep1624c9jsn1ef31b2c1017',
          'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
        }
      };

      axios.request(options).then(function (response) {
        const JSONString = JSON.stringify(response.data);
        const JSONObject = JSON.parse(JSONString);

        that.changeResult(JSONObject)

      }).catch(function (error) {
        console.error(error);
      });
    }
  },
  mounted() {
    const auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user.uid;
      }
    });
    this.getWatchers()
  },
  watch: {
    alert() {
      setTimeout(() => {
        this.alert = ''
      }, 3000)
    },
  },

}
</script>

<style scoped>
.alert {
  /*margin-left: 50px;*/
  color: red;
}
.searchIcon {
  margin-top: 25px;
  margin-left: 5px;
  height: 20px;
  width: 20px;
}
</style>