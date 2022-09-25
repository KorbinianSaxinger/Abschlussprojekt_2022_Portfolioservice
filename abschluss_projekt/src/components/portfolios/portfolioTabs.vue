<template>
  <v-container>
    <v-card>
      <v-tabs
          v-model="tab"
          background-color="red lighten-2"
      >
        <div>

        </div>
        <v-tab
            v-for="item in portfoliotabs"
            :key="item.portfolioId"
            @click="testFunction(item.portfolioId)"
        >
            {{ item.portfolioName }}
        </v-tab>
      </v-tabs>
    </v-card>
    <portfolio-positions/>
  </v-container>
</template>

<script>
import axios from "axios";
import PortfolioPositions from "@/components/portfolios/portfolioPositions";

export default {
  name: "portfolioTabs",
  components: {PortfolioPositions },
  data: () => ({
    tab: null,
    pid: null,
    portfoliotabs: []
  }),
  methods: {
    testFunction(id) {
        console.log(id)
    }
  },
  computed: {

  },
  beforeCreate() {
    axios.get('http://localhost/api/getPortfolios.php').then(response  => (
            this.portfoliotabs = response.data
        )
    );
  },
  watch: {
    length (val) {
      this.tab = val - 1
    },
  },
}
</script>

<style scoped>

</style>