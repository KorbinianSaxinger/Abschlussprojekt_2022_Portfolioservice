<template>
  <v-app>
    <v-main>
      <SideBar/>
    </v-main>
  </v-app>
</template>

<script>
import SideBar from "@/components/sidebar/sidebar";
export default {
  name: 'App',

  components: {
    SideBar,
  },

  data: () => ({
    //
  }),
};
</script>
