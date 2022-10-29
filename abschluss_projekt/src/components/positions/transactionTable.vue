<template>
 <v-app class="app">
   <v-data-table
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
 </v-app>
</template>

<script>
import {getAuth, onAuthStateChanged} from "firebase/auth";
import app from "../../../firebase";
import axios from "axios";
import {doc, getDoc, getFirestore} from "firebase/firestore";

export default {
  name: "transactionTable",
  data() {
    return {
      positions: [],
      portfoliotabs: [],
      watchers: [],
      currency: '€',
      conversion: 1.0,
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

    }
  },
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
    safePortfolioID(portfolioID) {
      localStorage.portfolioID = portfolioID
      this.portfolioID = portfolioID
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
      const docRef = doc(db, 'watch', this.user);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const JSONString = JSON.stringify(docSnap.data());
        const JSONObject = JSON.parse(JSONString);
        this.allWatchers = JSONObject.watch
        this.watchers = JSONObject.watch.filter(watch => watch.portfolioID == id);
      }
    },
    log() {
      console.log('GetTransaction data')
    }
  },
  watch: {
    conv() {
      this.conversion = localStorage.conversionRate
    }
  },
  mounted() {
    console.log('TRansaction component mounted')
    this.getConversion('USD', 'EUR')
    const auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user.uid;
        await this.fetchPortfolios();
        this.portfolioID = localStorage.portfolioID
        this.safePortfolioID(this.portfolioID)
        await this.getPositions(this.portfolioID)
        await this.getWatchers(this.portfolioID)
      }
    });
  },
}
</script>

<style scoped>
.app {
  height: 0;
  margin-top: 15px;
  margin-bottom: 100px;
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
.v-data-table {
  border-radius: 10px;
}

</style>