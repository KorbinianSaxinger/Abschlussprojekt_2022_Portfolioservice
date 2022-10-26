<template>
  <v-container>
    <v-card
        class="addcard"
        rounded
    >
      <v-card-title>
        Portfolio erstellen
        <v-icon
            class="iconClose d-flex"
            @click.prevent="closeCard"
        >mdi-close
        </v-icon>
      </v-card-title>
      <v-text-field
          class="text-field d-flex"
          label="Portfolio Name"
          v-model="portfolioName"
          outlined
      >
      </v-text-field>
      <div
          class="error"
          v-if="error !== ''"
      > {{ error }} </div>
      <v-btn
          v-if="error === ''"
          type="submit"
          class="createButton d-inline-flex text-center"
          width="100"
          @click.prevent="createPortfolio"
      >
        Erstellen
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";
import app from "../../../firebase";
import {getAuth, onAuthStateChanged} from "firebase/auth";

export default {
  name: "addPortfolio",
  data() {
    return {
      portfolioName: '',
      user: '',
      portfolio: '',
      portfoliotabs: [],
      error: '',
    }
  },
  methods: {
    closeCard: function () {
      this.$emit('close-add-portfolio')
    },

    PortfolioExists(name) {
      if (!this.portfoliotabs) {
        return true
      }
      if (this.portfoliotabs.filter(portfolio => portfolio.name.toUpperCase() === name.toUpperCase()).length > 0) {
        return false
      }
      return true
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

    GetNewPortfolioID() {
      const portfolios = this.portfoliotabs.length
      if(portfolios < 1) return 0
      return this.portfoliotabs[portfolios-1].id + 1
    },

    async createPortfolio() {

      if (this.portfolioName === '') {
        this.error = 'Der name darf nicht leer sein'
      }

      else if(this.PortfolioExists(this.portfolioName) === true) {


        const userPortfolios = [];
        for (let i = 0; i < this.portfoliotabs.length; i++) {
          const portfolio =  this.portfoliotabs[i];
          userPortfolios.push(portfolio);
        }

        const createdPortfolio = {
          name: this.portfolioName,
          id: this.GetNewPortfolioID()
        };

        userPortfolios.push(createdPortfolio);

        const portfolio = {
          portfolios: userPortfolios
        };

        try {
          const db = getFirestore(app);
          await setDoc(doc(db, "portfolios", this.user), portfolio);
        } catch (e) {
          console.error("Error adding document: ", e);
        }

        await this.fetchPortfolios()
        this.closeCard()
      } else {
        this.error = 'Dieses Portfolio existiert bereits'
      }
    },
  },
  watch: {
    error() {
      setTimeout(() => {
        this.error = ''
      }, 3000)
    },
  },
  mounted() {
    const auth = getAuth(app);
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user.uid;
        await this.fetchPortfolios();
        await this.getPositions(this.portfoliotabs[0].id);
      }
    });
  },
}
</script>

<style scoped>
.error {
  padding-bottom: 40px;

  color: red;
}
.addcard {
  margin: 10px 0% 0px 35%;
  width: 300px;
  height: 200px;
  border-color: black;
  border-radius: 10px
}
.iconClose {
  margin-left: 80px;
  color: green;
}
.text-field {
  margin-left: 50px;
  width: 200px;
  justify-content: center;
}
</style>