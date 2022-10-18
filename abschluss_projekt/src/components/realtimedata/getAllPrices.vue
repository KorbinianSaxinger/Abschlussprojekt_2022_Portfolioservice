<template>
  <v-container>
    <v-card>
      <v-btn
        type="submit"
        @click="getPrices"
      ></v-btn>
    </v-card>
  </v-container>
</template>

<script>
import {doc, getFirestore, setDoc} from "firebase/firestore";
import app from "../../../firebase";

export default {
  name: "getAllPrices",
  data() {
    return {

    }
  },
  methods: {
    getPrices() {
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
          await setDoc(doc(db, "allPrices", "kjsnckansxaÖ123"), allPrices);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }).catch(function (error) {
        console.error(error);
      });
    }
  }
}
</script>

<style scoped>

</style>