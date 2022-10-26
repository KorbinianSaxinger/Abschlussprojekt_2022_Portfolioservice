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
          @click.prevent="backToLogin"
        >
          Zurück zum login
        </v-btn>
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
    backToLogin() {
        router.push('login')
    },
    register() {
      const auth = getAuth(app);
      createUserWithEmailAndPassword(auth, this.email, this.passwort)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            this.user = user
            // ...
          })
          .catch((error) => {
            console.log(error)
            console.log(error.code)
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
        const uid = user.uid;
        this.user = uid;
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
}
</style>