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
        @click.prevent="searchStock()"
       >mdi-magnify</v-icon>
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
export default {
  name: "realTimeTable",

  data() {
    return {
      currentSymbol: '',
      searchValue: '',
      searchResult: [],
      stockValues: {},
      headers: [
        {text: 'Name', value: '2. name'},
        {text: 'add', value: 'add', sortable: false},
      ]
    }
  },
  methods: {

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

    add(item) {
      let keys = Object.keys(item);
      let values = keys.map(function(key) {
        return item[key];
      });
      console.log(values[0]);
      this.getStockData(values[0])
      this.searchResult = []
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

  },

}
</script>

<style scoped>

</style>