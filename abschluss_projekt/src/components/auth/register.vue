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
      >Registrieren</v-card-title>
      <v-form>
        <v-text-field
            class="v-text-field"
            outlined
            type="text"
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
        <v-text-field
            class="v-text-field"
            outlined
            type="password"
            id="iPasswort"
            placeholder=" Passwort widerholen"
            v-model="confirmPasswort"
        />
        <v-btn
          type="submit"
          class="v-btn"
          @click.prevent="backToLogin"
        >
          zum login
        </v-btn>
        <v-btn
          type="submit"
          class="v-btn register"
          @click.prevent="register"
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
      confirmPasswort: '',
      errorMessage: '',
    }
  },
  methods: {
    backToLogin() {
        router.push('login')
    },
    register() {
      const auth = getAuth(app);
      if (this.passwort !== this.confirmPasswort) {
        this.errorMessage = 'Die Passwörter stimmen nicht überein'
      }
      else {
        createUserWithEmailAndPassword(auth, this.email, this.passwort)
            .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              this.user = user
              // ...
            })
            .catch((error) => {
              if (error.code == 'auth/email-already-in-use') {
                this.errorMessage = 'Die email existiert bereits'
              }
              if (error.code == 'auth/weak-password') {
                this.errorMessage = 'Das Passwort ist zu kurz'
              }
            })
            .finally(() => {
              if (this.errorMessage === '') {
                router.push('home')
              }
            });
      }
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
.errorMessage {
  margin-top: 20px;
  color: red;
}
.register {
  color: forestgreen;
}
.v-btn {
  margin-left: 10px;
}
.v-text-field {
  margin-left: 10%;
  width: 80%;
  color: forestgreen;
}
.card {
  border-radius: 15px;
  margin-top: 10px;
}
.title {
  justify-content: center;
}
</style>