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
      >Register</v-card-title>
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
            @click.prevent="register"
        >
          Register
        </v-btn>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import {getAuth, createUserWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import app from "../../../firebase";
import router from "@/router";

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
          })
          .finally(() => {
              router.push('home')
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
.card {
  margin-top: 10px;
  border-radius: 15px;
}
.title {
  justify-content: center;
}
</style>