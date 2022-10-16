<template>
 <v-main>
   <div
    class="d-inline-flex"
   >
     <v-text-field
         v-model="searchValue"
     >
     </v-text-field>
       <v-icon
        @click.prevent="searchStock"
       >mdi-magnify</v-icon>
     <v-icon
        @click.prevent="closeSearch"
       >mdi-close</v-icon>
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
      currentSymbol: '',
      searchValue: '',
      searchResult: [],
      positions: [],
      stockValues: {},
      headers: [
        {text: 'Name', value: '2. name'},
        {text: 'add', value: 'add', sortable: false},
      ]
    }
  },
  methods: {
    async getPositions(id) {

      const db = getFirestore(app);
      const docRef = doc(db, "watch", this.user);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const JSONString = JSON.stringify(docSnap.data());
        const JSONObject = JSON.parse(JSONString);
        console.log(JSONObject)
        this.positions = JSONObject.watch.filter(position => position.portfolioId == id);
      }
    },

    GetNewPositionID() {
      const lastPosition = this.positions.length
      if(lastPosition <= 0) return 0
      // console.log(this.positions)
      return this.positions[lastPosition-1].id + 1
    },

    closeSearch() {
      this.searchResult = []
      this.$emit('close-search-bar')
    },
    getStockData(symbol) {
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
        console.log(response.data)
        that.changeStockValues(JSONObject.data)

      }).catch(function (error) {
        console.error(error);
      });
    },

    async add(item) {
      this.$emit('close-search-bar')
      let keys = Object.keys(item);
      let values = keys.map(function(key) {
        return item[key];
      });
      console.log(values[0]);
      this.stockValues = null
      this.getStockData(values[0])

      const newPositions = this.positions;
      let name = ''
      const portfolioID = localStorage.portfolioID
      const currency = this.stockValues.currency
      console.log(this.stockValues)

      if (this.stockValues.longName.length > 0) {
        name = this.stockValues.longName
      }
      else if (this.stockValues.shortName.length > 0) {
        name = this.stockValues.shortName
      }
      const createdWatch = {
        name: name,
        portfolioID: portfolioID,
        currency: currency,
        id: this.GetNewPositionID(),
      };

      newPositions.push(createdWatch);

      const addwatch = {
        watch: newPositions
      };

      try {
        const db = getFirestore(app);
        await setDoc(doc(db, "watch", this.user), addwatch);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      // await this.fetchPortfolios()
      // this.addPortfolio = false
      // this.closeCard()
      // this.$emit('close-positions')
      // } else {
      //   console.log("LAK DU CHUND")
      // }
      this.searchResult = []
      this.$emit('close-search-bar')
    },

    changeResult(object) {
      for (let i = 0; i < object.bestMatches.length; i++) {
        this.searchResult.push(object.bestMatches[i])
      }
    },

    changeStockValues(data) {
      this.stockValues = data
      if (this.stockValues.longName) {
        console.log(this.stockValues.longName)
      }
      else if (this.stockValues.shortName) {
        console.log(this.stockValues.shortName)
      } else {
        console.log('Kein Name')
      }
      console.log(this.stockValues.currentPrice)

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
    this.getPositions(localStorage.portfolioID)
  },

}
</script>

<style scoped>

</style>