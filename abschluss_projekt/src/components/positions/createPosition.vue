<template>
  <v-container
    class="px-0"
    fluid
  >
    <v-card
      class="v-card"
      rounded
    >
      <v-card-title
        class="cardTitle flex-row"
      >
        Position erstellen
        <v-icon
          class="closeIcon justify-end"
          @click.prevent="closeCard"
        >mdi-close</v-icon>
      </v-card-title>
      <v-date-picker
          class="picker"
          v-if="datePicker === true"
          v-model="date"
          @change="changeDate"
      >
      </v-date-picker>
      <v-radio-group
        class="radio"
        v-model="row"
        row
      >
        <v-radio
          v-for="radio in radioItems"
          :key="radio.value"
          :label="radio.text"
          :value="radio.value"
          @change="changeTransactionType(radio.value)"
        >
        </v-radio>
      </v-radio-group>
      <v-text-field
          class="textField"
          v-model="name"
          outlined
          placeholder="Name"
      ></v-text-field>
      <v-text-field
          class="textField"
          v-model="qty"
          outlined
          placeholder="Menge"
      ></v-text-field>
      <v-text-field
          class="textField"
          v-model="price"
          outlined
          placeholder="Preis"
      ></v-text-field>
      <v-text-field
          class="textField"
          v-model="date"
          outlined
          placeholder="Datum"
      ></v-text-field>
      <v-icon
        @click.prevent="datePicker = true"
      >mdi-calendar</v-icon><br>
      <v-btn
        @click="createPosition"
        class="okBtn"
      ><span style="color: green">OK</span>
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";
import app from "../../../firebase";
import moment from "moment";

export default {
  name: "createPosition",
  data() {
    return {
      datePicker: false,
      date: null,
      symbol: '',
      user: '',
      name: '',
      currency: '',
      conversionUSDEUR: 1.0141,
      qty: null,
      price: 0,
      portfolioID: null,
      portfolios: [],
      positions: [],
      radioGroup: 1,
      row: null,
      type: 'buy',
      radioItems: [
        { text: 'Kauf', value: 'buy', key: '1' },
        { text: 'Verkauf', value: 'sell', key: '2' },
      ],
    }
  },
  methods: {
    changeDate() {
      this.datePicker = false
    },
    changeTransactionType(type) {
      this.type = type
    },
    closeCard: function () {
      this.$emit('close-positions')
    },
    GetNewPositionID() {
      const lastPosition = this.positions.length
      if(lastPosition === 0) {
        return 0
      }
      return this.positions[lastPosition-1].id + 1
    },
    async createPosition() {
      let modifier = 1.0

      if (this.type === 'sell') {
          modifier = -1.0
      }

      let qty = parseFloat(this.qty) * modifier

      const newPositions = this.positions;

      const createdPosition = {
        symbol: this.symbol,
        name: this.name,
        quantity: qty,
        currency: this.currency,
        price: parseFloat(this.price),
        conversion: parseFloat(this.conversionUSDEUR),
        portfolioId: parseInt(this.portfolioID),
        created: this.date,
        id: this.GetNewPositionID(),

      };

      newPositions.push(createdPosition);

      const addPositions = {
        positions: newPositions
      };

      try {
        const db = getFirestore(app);
        await setDoc(doc(db, "positions", this.user), addPositions);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      await this.fetchPortfolios()
      this.addPortfolio = false
      this.closeCard()
      // } else {
      // }
    },

    async getPositions() {

      const db = getFirestore(app);
      const docRef = doc(db, "positions", this.user);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const JSONString = JSON.stringify(docSnap.data());
        const JSONObject = JSON.parse(JSONString);
        this.positions = JSONObject.positions;
      }
    },

    async fetchPortfolios() {
      const db = getFirestore(app);
      const docRef = doc(db, "portfolios", this.user);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const JSONString = JSON.stringify(docSnap.data());
        const JSONObject = JSON.parse(JSONString);
        this.portfolios = JSONObject.portfolios;
      }
    },
  },
  mounted() {
    this.portfolioID = localStorage.portfolioID
    this.name = localStorage.transactionName
    this.symbol = localStorage.symbol
    this.currency = localStorage.currency
    this.price = localStorage.currentPrice
    this.conversionUSDEUR = localStorage.conversionRate
    let now = new Date();
    this.date = moment(now).format('YYYY-MM-DD');

    const auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user.uid;
        await this.fetchPortfolios();
        await this.getPositions();
      }
    });
  },
}
</script>

<style scoped>
.radio {
  padding-left: 40px;
}
.picker {
  position: absolute;
  margin-left: 250px;
  margin-bottom: 1250px;
}
.textField {
  color: forestgreen;
  margin-left: 10%;
  width: 80%;
}
.v-card {
  width: 400px;
}
.closeIcon {
  color: forestgreen;
  margin-left: 48%;
}
.cardTitle{
  justify-self: center;
}

</style>