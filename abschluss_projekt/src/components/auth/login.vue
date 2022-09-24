<template>
  <div>
    <form>
      <label for="iEmail">Email</label>
      <input
          type="text"
          id="iEmail"
          placeholder=" Email"
          v-model="email"
      />
      <label for="iPasswort">Passwort</label>
      <input
          type="text"
          id="iPasswort"
          placeholder=" Passwort"
          v-model="passwort"
      />
      <input type="submit" value="Login" @click.prevent="login"/>
    </form>
    <button @click.prevent="logout">Logout</button>
    <p>{{ user }}</p>
  </div>
</template>

<script>
import { getAuth, setPersistence, browserLocalPersistence, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import app from "../../../firebase";
import router from "@/router";

export default {
  name: "P-Login",
  data() {
    return {
      user: '',
      email: '',
      passwort: '',
    }
  },
  methods: {
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
              router.push('home');
            }
      });
    },
    logout() {
      const auth = getAuth(app);
      const ref = this;
      signOut(auth).then(() => {
        ref.user = '';
        // Sign-out successful.
      }).catch((error) => {
        console.log(error)
        // An error happened.
      });
    }
  },
  mounted() {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user)
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        this.user = user.email;
        const uid = user.uid;
        console.log(uid)
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

</style>