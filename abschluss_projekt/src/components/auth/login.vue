<template>
  <div>
    <v-card
      class="card d-inline-flex"
      rounded
      width="400px"
      height="400px"
    >
      <v-card-title
        class="title"
      >Login</v-card-title>
      <v-form>
        <v-text-field
            label="E-Mail"
            outlined
            type="text"
            id="iEmail"
            placeholder=" Email"
            v-model="email"
        />
        <v-text-field
            label="Passwort"
            outlined
            type="text"
            id="iPasswort"
            placeholder=" Passwort"
            v-model="passwort"
        />
        <v-btn
            type="submit"
            @click.prevent="login"
        >
          Anmelden
        </v-btn>
        <v-btn
            style="
            margin-left: 30px; background-color: dimgrey;
            "
            type="submit"
            @click.prevent="openRegister"
        >
          Oder Registrieren
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { getAuth, setPersistence, browserLocalPersistence, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import app from "../../../firebase";
import router from "@/router";

export default {
  name: "P-Login",
  data() {
    return {
      msg: '',
      user: '',
      email: '',
      passwort: '',
      uid: ''
    }
  },
  methods: {
    openRegister() {
      router.push('register')
    },
    login() {
      const auth = getAuth(app);
      const ref = this;
      setPersistence(auth, browserLocalPersistence)
          .then(() => {
            // Existing and future Auth states are now persisted in the current
            // session only. Closing the window would clear any existing state even
            // if a user forgets to sign out.
            // ...
            // New sign-in will be persisted with session persistence.
            return signInWithEmailAndPassword(auth, ref.email, ref.passwort);

          })
          .catch((error) => {
            // Handle Errors here.
            console.log(error)
            // const errorCode = error.code;
            // const errorMessage = error.message;
          })
          .finally(() => {
            if (ref.user !== '') {
              router.push('Home');
            }
      });
    },
  },
  mounted() {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user)
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        this.user = user.email;
        this.uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }
}
</script>

<style scoped>
.card {
  border-radius: 15px;
  margin-top: 10px;
}
.title {
  justify-content: center;
}

</style>