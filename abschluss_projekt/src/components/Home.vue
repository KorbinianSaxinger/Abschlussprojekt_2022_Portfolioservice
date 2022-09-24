<template>
  <div class="home">
    <div
      v-if="user !== ''"
    >
      <h1>Home</h1>
    </div>
    <div
        v-if="user === ''"
    >
    <p-login></p-login>
    </div>

  </div>
</template>

<script>
import {getAuth, onAuthStateChanged} from "firebase/auth";
import app from "../../firebase";
import PLogin from "@/components/auth/login";

export default {
  name: "PHome",
  components: {PLogin},
  data() {
    return {
      user: '',
      email: '',
      passwort: '',
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
.home {

}
h1 {
  /*color: deepskyblue;*/
}
</style>