<template>
  <v-container>
    <v-card
        class="card"
        rounded
        style="border-radius: 10px;"
    >
      <v-card-title>Menue</v-card-title>
      <v-chip
        class="chip d-flex"
        @click="getPrices"
      ><div class="p">Alle Preise</div>
      </v-chip>
      <v-chip
          class="chip d-flex"
          @click="getNames"
      ><div class="p">Alle Namen</div>
      </v-chip>
    </v-card>
  </v-container>
</template>

<script>
import {doc, getFirestore, setDoc} from "firebase/firestore";
import app from "../../../firebase";
// import axios from "axios";

export default {
  name: "getAllPrices",
  data() {
    return {

    }
  },
  methods: {
    getPrices() {
      let now = new Date().getSeconds()
      // console.log(now)
      const axios = require("axios");

      const options = {
        method: 'GET',
        url: 'https://latest-stock-price.p.rapidapi.com/any',
        headers: {
          'X-RapidAPI-Key': '58ce557142msh90b2532927f2240p16a65cjsnc9bdc393aff9',
          'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com'
        }
      };

      axios.request(options).then(async function (response) {

        let newPrices = response.data
        let prices = []
        for (let i = 0; i < newPrices.length; i++) {
          prices.push(newPrices[i])
        }

        const allPrices = {
          allPrices: prices
        };

        try {
          const db = getFirestore(app);
          await setDoc(doc(db, "allPrices", "allPrices"), allPrices);
          let now2 = new Date().getSeconds()
          console.log(now2 - now)
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }).catch(function (error) {
        console.error(error);
      });
    },

    getNames() {
      // let now = new Date().getSeconds()
      // console.log(now)
      const axios = require("axios");
      const options = {
        method: 'GET',
        url: 'https://alpha-vantage.p.rapidapi.com/query',
        params: {keywords: 'microsoft', function: 'SYMBOL_SEARCH', datatype: 'json'},
        headers: {
          'X-RapidAPI-Key': '58ce557142msh90b2532927f2240p16a65cjsnc9bdc393aff9',
          'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
        }
      };

      axios.request(options).then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.error(error);
      });
      // const options = {
      //   method: 'GET',
      //   url: 'https://latest-stock-price.p.rapidapi.com/any',
      //   headers: {
      //     'X-RapidAPI-Key': '58ce557142msh90b2532927f2240p16a65cjsnc9bdc393aff9',
      //     'X-RapidAPI-Host': 'latest-stock-price.p.rapidapi.com'
      //   }
      // };
      //
      // axios.request(options).then(async function (response) {
      //
      //   let newPrices = response.data
      //   let prices = []
      //   for (let i = 0; i < newPrices.length; i++) {
      //     prices.push(newPrices[i])
      //   }
      //
      //   const allPrices = {
      //     allPrices: prices
      //   };
      //
      //   try {
      //     const db = getFirestore(app);
      //     await setDoc(doc(db, "allPrices", "allPrices"), allPrices);
      //     let now2 = new Date().getSeconds()
      //     console.log(now2 - now)
      //   } catch (e) {
      //     console.error("Error adding document: ", e);
      //   }
      // }).catch(function (error) {
      //   console.error(error);
      // });
    }
  }
}
</script>

<style scoped>
.p{
  padding-left: 40%;
  padding-right: 50%;
}
.chip {
  justify-self: center;
  margin: 0px 0px 20px 25%;

  width: 50%
}
.card {
  /*margin-bottom: 20px;*/
  width: 300px;
}
</style>