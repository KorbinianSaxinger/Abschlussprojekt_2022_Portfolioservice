<template>
  <v-container
    class="justify-center"
    style="margin-left: 33.7%"
  >
    <v-card
      class="card d-block"
      rounded
      width="300px"
      height="200px"
    >
      <v-card-title
        class="d-inline-flex"
      >
        Portfolio löschen
      </v-card-title>
      <v-icon
        class="icon"
        @click.prevent="closeCard"
      >
        mdi-close
      </v-icon>
      <div>
        Portfolio:  <span style="color: green">{{ portfolioName }}</span>  <br><br>
      Wirklich löschen?</div>
      <v-btn
        class="justify-start"
        type="submit"
        @click.prevent="deletePortfolio(portfolioID)"
      > Löschen </v-btn>
    </v-card>
  </v-container>
</template>

<script>
import {getAuth, onAuthStateChanged} from "firebase/auth";
import app from "../../../firebase";
import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";

export default {
  name: "deletePortfolio",
  data() {
    return {
      portfolioName: null,
      portfolioID: null,
      user: null,
      portfolios: [],
      positions: [],
      watchers: [],
      newPortfolios: []

    }
  },
  methods: {
    closeCard: function () {
      this.$emit('close-delete-portfolio')
      this.$emit('update-portfolios')
    },

    async deletePortfolio(id) {
      const db = getFirestore(app);
      const docRef = doc(db, "portfolios", this.user);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const JSONString = JSON.stringify(docSnap.data());
        const JSONObject = JSON.parse(JSONString);
        this.portfolios = JSONObject.portfolios;
      }
      const newPortfolios = this.portfolios.filter(portfolio => portfolio.id != id)

      const portfolios = {
        portfolios: newPortfolios
      }

      try {
        const db = getFirestore(app);
        await setDoc(doc(db, "portfolios", this.user), portfolios);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      const docRef2 = doc(db, "positions", this.user);
      const docSnap2 = await getDoc(docRef2);

      if (docSnap2.exists()) {
        const JSONString = JSON.stringify(docSnap2.data());
        const JSONObject = JSON.parse(JSONString);
        this.positions = JSONObject.positions;
      }
      const newPositions = this.positions.filter(positions => positions.portfolioId != id)

      const positions = {
        positions: newPositions
      }

      try {
        const db = getFirestore(app);
        await setDoc(doc(db, "positions", this.user), positions);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      const docRef3 = doc(db, "watch", this.user);
      const docSnap3 = await getDoc(docRef3);

      if (docSnap3.exists()) {
        const JSONString = JSON.stringify(docSnap3.data());
        const JSONObject = JSON.parse(JSONString);
        this.watchers = JSONObject.watch;
      }
      const newWatcher = this.watchers.filter(watcher => watcher.portfolioID != id)

      const watcher = {
        watch: newWatcher
      }

      try {
        const db = getFirestore(app);
        await setDoc(doc(db, "watch", this.user), watcher);
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      this.closeCard()
    },
  },
  mounted() {
    this.positionID = localStorage.positionID
    this.portfolioID = localStorage.portfolioID
    this.portfolioName = localStorage.portfolioName
    this.portfolios = localStorage.portfolios

    const auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user.uid;
      }
    });
  }
}
</script>

<style scoped>
.card {
  border-radius: 10px;
}

</style>