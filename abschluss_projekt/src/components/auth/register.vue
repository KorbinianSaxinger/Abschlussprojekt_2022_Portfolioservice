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
      <input type="submit" value="Registrierung" @click.prevent="register"/>
    </form>
    <p>{{ user }}</p>
  </div>
</template>

<script>
import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import app from "../../../firebase";

export default {
  name: "P-Register",
  data() {
    return {
      user: '',
      email: '',
      passwort: '',
    }
  },
  methods: {
    register() {
      const auth = getAuth(app);
      createUserWithEmailAndPassword(auth, this.email, this.passwort)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user)
            // ...
          })
          .catch((error) => {
            console.log(error)
            // const errorCode = error.code;
            // const errorMessage = error.message;
            // ..
          });
    },
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