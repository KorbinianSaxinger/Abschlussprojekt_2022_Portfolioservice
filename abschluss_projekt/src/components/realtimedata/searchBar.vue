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
  name: "searchBar",

  data() {
    return {
      user: '',
      // positionName: '',
      alert: '',
      searchValue: '',
      searchResult: [],
      positions: [],
      watchers: [],
      stockValues: {},
      break: false,
      headers: [
        {text: 'Name', value: '2. name', align: 'center'},
        {text: 'Symbol', value: '1. symbol', align: 'center'},
        {text: 'Hinzufügen', value: 'add', sortable: false, align: 'center'},
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

        this.watchers = JSONObject.watch;

      } else {
        this.alert = 'Keine Beobachteten Positionen'
      }
    },


    GetNewPositionID() {
      if (!this.watchers) {
        return 0
      } else {
        if (this.watchers.length === 0) {
          return 0
        }else {
          const watchers = this.watchers.length
          return this.watchers[watchers-1].id + 1
        }

      }
    },

    closeSearch() {
      this.searchResult = []
      this.$emit('close-search-bar')
    },

    async add(item) {

      let keys = Object.keys(item);
      let values = keys.map(function(key) {
        return item[key];
      });

        let newPositions = this.watchers;

        const name = values[1]
        const portfolioID = localStorage.portfolioID
        const currency = values[7]
        const symbol = values[0]
        const price = 0


        if (name === '') {
          this.closeSearch()
          return this.alert = 'Kein Eintrag'
        }

        const createdWatch = {
          name: name,
          portfolioID: portfolioID,
          currency: currency,
          symbol: symbol,
          currentPrice: price,
          id: this.GetNewPositionID(),
        };
        if(this.watchers) {
          newPositions.push(createdWatch);
        } else {
          newPositions = []
          newPositions.push(createdWatch);

        }

        const addwatch = {
          watch: newPositions
        };

        try {
          const db = getFirestore(app);
          setDoc(doc(db, "watch", this.user), addwatch);
        } catch (e) {
          // console.error("Error adding document: ", e);
        }

        this.closeSearch()

    },

    changeResult(object) {
      for (let i = 0; i < object.bestMatches.length; i++) {
        this.searchResult.push(object.bestMatches[i])
      }
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
        if (error) {
          // console.error(error);
        }
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