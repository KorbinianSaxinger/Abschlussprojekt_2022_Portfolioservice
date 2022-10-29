<template>
  <v-container
    class="justify-center"
    style="margin-left: 33.7%"
  >
    <v-card
      class="card d-block"
      rounded
      width="350px"
      height="110%"
    >
      <v-card-title
        class="d-inline-flex"
      >
        Watcher löschen
      </v-card-title>
      <v-icon
        class="icon"
        @click.prevent="closeCard"
      >
        mdi-close
      </v-icon>
      <div>
        Watcher:  <span style="color: green">{{ watcherName }}</span> <br> <br>
        <span class="warning"> {{ alert }} </span>
      </div>
      <v-btn
        class="justify-start"
        type="submit"
        @click.prevent="deleteWatcher()"
      > Löschen </v-btn>
    </v-card>
  </v-container>
</template>

<script>
import {getAuth, onAuthStateChanged} from "firebase/auth";
import app from "../../../firebase";
import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";

export default {
  name: "deleteWatchers",
  data() {
    return {
      watcherSymbol: null,
      watcherName: null,
      portfolioID: null,
      user: null,
      watchers: [],
      newWatchers: [],
      alert: 'Achtung!, alle beobachteten Positionen mit dem selben Symbol werden gelöscht!'
    }
  },
  methods: {
    closeCard: function () {
      this.$emit('close-delete-watchers')
    },

    async deleteWatcher() {
      const db = getFirestore(app);
      const docRef = doc(db, "watch", this.user);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const JSONString = JSON.stringify(docSnap.data());
        const JSONObject = JSON.parse(JSONString);
        this.watchers = JSONObject.watch;
      }
      const newWatchers = this.watchers.filter(watch => watch.symbol !== this.watcherSymbol)

      const watchers = {
        watch: newWatchers
      }

      try {
        const db = getFirestore(app);
        await setDoc(doc(db, "watch", this.user), watchers);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      this.closeCard()
    },
  },
  mounted() {
    this.watcherSymbol = localStorage.watcherSymbol
    this.portfolioID = localStorage.portfolioID
    this.watcherName = localStorage.watcherName
    this.watchers = localStorage.watchers

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
.warning {
  color: red;
  /*padding: 0px 15px 0px 10px;*/
}
.card {
  border-radius: 10px;
  padding-bottom: 10px;
}

</style>