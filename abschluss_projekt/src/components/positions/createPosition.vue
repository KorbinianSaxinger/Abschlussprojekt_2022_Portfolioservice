<template>
  <v-container
    class="flex-column"
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
      <v-text-field
        class="textField"
        v-model="isin"
        outlined
        placeholder="ISIN"
      ></v-text-field>
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

export default {
  name: "createPosition",
  data() {
    return {
      user: '',
      isin: '',
      name: '',
      qty: null,
      price: null,
      portfolioID: null,
      portfolios: [],
      positions: [],
    }
  },
  methods: {
    closeCard: function () {
      this.$emit('close-positions')
    },
    GetNewPositionID() {
      const lastPosition = this.positions.length
      if(lastPosition <= 0) return 0
      // console.log(this.positions)
      return this.positions[lastPosition-1].id + 1
    },
    async createPosition() {
        const newPositions = this.positions;

        const createdPosition = {
          isin: this.isin,
          name: this.name,
          quantity: parseFloat(this.qty),
          price: parseFloat(this.price),
          portfolioId: parseInt(this.portfolioID),
          id: this.GetNewPositionID()
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
        // this.$emit('close-positions')
      // } else {
      //   console.log("LAK DU CHUND")
      // }
    },

    async getPositions() {

      const db = getFirestore(app);
      // console.log(this.user)
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
  beforeDestroy() {
  },
  beforeCreate() {
  },
  mounted() {
    this.portfolioID = localStorage.portfolioID
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
.textField {
  color: green;
  margin-left: 10%;
  width: 80%;
}
.v-card {
  width: 400px;
}
.closeIcon {
  color: green;
  margin-left: 48%;
}
.cardTitle{
  justify-self: center;
}

</style>