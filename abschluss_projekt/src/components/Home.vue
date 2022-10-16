<template>
  <v-main>
    <div
      class="leftSideBar"
    >
      <left-sidebar/>
    </div>
    <div class="home">
      <div v-if="user != ''"
      >
        <portfolio-tabs/>
      </div>
    </div>
  </v-main>
</template>

<script>
import {getAuth, onAuthStateChanged} from "firebase/auth";
import app from "../../firebase";
import PortfolioTabs from "@/components/portfolios/portfolioTabs";
import LeftSidebar from "@/components/leftSidebar";

export default {
  name: "PHome",
  components: {LeftSidebar, PortfolioTabs},
  data() {
    return {
      user: '',
      email: '',
      passwort: '',
    }
  },
  methods: {
    // fetchData() {
    //   axios.get('http://localhost/get.php').then(response  => (
    //       this.todo_list = response.data)
    //   ).finally(() =>
    //       this.text = ''
    //   );
    // }
  },
  mounted() {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        this.user = user.uid;
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
.leftSideBar {
  position: absolute;
}
.home {
    background: url("../assets/backgroundMD.jpg") no-repeat fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    height: 1080px;
    /*width: 1900px;*/
}
h1 {
  color: deepskyblue;
}
</style>