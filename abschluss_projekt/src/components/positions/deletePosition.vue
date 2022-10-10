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
        Position löschen
      </v-card-title>
      <v-icon
        class="icon"
        @click.prevent="closeCard"
      >
        mdi-close
      </v-icon>
      <div>
        Position:  <span style="color: green">{{ positionName }}</span>  <br><br>
      Wirklich löschen?</div>
      <v-btn
        class="justify-start"
        type="submit"
        @click.prevent="deletePosition(portfolioID)"
      > Löschen </v-btn>
    </v-card>
  </v-container>
</template>

<script>
import {getAuth, onAuthStateChanged} from "firebase/auth";
import app from "../../../firebase";
import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";

export default {
  name: "deletePosition",
  data() {
    return {
      positionID: null,
      positionName: null,
      portfolioID: null,
      user: null,
      positions: [],
      newPositions: []

    }
  },
  methods: {
    closeCard: function () {
      this.$emit('close-delete-positions')
      this.$emit('update-positions')
    },

    async deletePosition() {
      const db = getFirestore(app);
      const docRef = doc(db, "positions", this.user);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const JSONString = JSON.stringify(docSnap.data());
        const JSONObject = JSON.parse(JSONString);
        this.positions = JSONObject.positions;
      }
      const newPositions = this.positions.filter(position => position.id != this.positionID)

      const positions = {
        positions: newPositions
      }

      try {
        const db = getFirestore(app);
        await setDoc(doc(db, "positions", this.user), positions);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      this.closeCard()
    },
  },
  mounted() {
    this.positionID = localStorage.positionID
    this.portfolioID = localStorage.portfolioID
    this.positionName = localStorage.positionName
    this.positions = localStorage.positions

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