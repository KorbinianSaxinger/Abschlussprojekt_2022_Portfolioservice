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
            class="v-text-field"
            outlined
            type="email"
            id="iEmail"
            placeholder=" E-Mail"
            v-model="email"
        />
        <v-text-field
            class="v-text-field"
            outlined
            type="password"
            id="iPasswort"
            placeholder=" Passwort"
            v-model="passwort"
        />
        <v-btn
            class="v-btn login"
            type="submit"
            @click.prevent="login"
        >
          Login
        </v-btn>
        <v-btn
            class="v-btn register"
            type="submit"
            @click.prevent="openRegister"
        >
          Registrieren
        </v-btn>
        <div
            v-if="errorMessage !== ''"
            class="errorMessage row--dense"> {{ errorMessage }} </div>
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
      errorMessage: '',
      user: '',
      email: '',
      passwort: ''
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
            if (error.code === 'auth/user-not-found') {
              this.errorMessage = 'E-Mail oder Passwort falsch'
            }
            if (error.code === 'auth/wrong-password') {
              this.errorMessage = 'E-Mail oder Passwort falsch'
            }

            // const errorCode = error.code;
          })
          .finally(() => {
            if (ref.user !== '') {
              router.push('home');
            }
      });
    },
  },
  watch: {
    errorMessage() {
      setTimeout(() => {
        this.errorMessage = ''
      }, 5000)
    }
  },
  mounted() {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
       this.user = user.uid;
      } else {
        // User is signed out
        // ...
      }
    });
  }
}
</script>

<style scoped>
.login {
  color: forestgreen;
}
.v-btn {
  margin-left: 10px;
}
.errorMessage {
  margin-top: 20px;
  color: red;
}
.v-text-field {
  color: forestgreen;
  width: 80%;
  margin-left: 10%;
}
.card {
  margin-top: 10px;
  border-radius: 15px;
}
.title {
  justify-content: center;
}

</style>