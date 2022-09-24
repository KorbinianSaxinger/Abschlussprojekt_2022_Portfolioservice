<template>
  <div  class="addPortfolio">
    <v-card
      class="card d-inline-flex"
      rounded
      height="300px"
      width="300px"
    >
      <v-card-title
        class="title"
      >Add Portfolio</v-card-title>

      <div class="wrapText">
        <v-text-field
            class="text d-inline-flex"
            label="PortfolioName"
            v-model="portfolioName"
            outlined
        >
        </v-text-field>
        <v-text-field
            class="text d-inline-flex"
            label="PortfolioId"
            v-model="portfolioId"
            outlined
        >
        </v-text-field>
      </div>
      <div class="wrapBtn">
        <v-btn
            class="btn d-inline-flex"
            rounded
            outlined
            type="submit"
        >Erstellen</v-btn>
      </div>
    </v-card>

  </div>
</template>

<script>


export default {
  name: "addPortfolio",
  data() {
    return {
      portfolioName: '',
      portfolioId: '',
      userId: '606hVkIHlFRATnJ6GrlBpXO72IV2',
      created: null,
      inputRules: [
          v => v.length >= 3 || 'Minimum length is 3 characters'
      ]

    }
  },
  methods: {

  }
}
</script>

<style scoped>
.text {
  width: 200px;
}
.card {
  margin-top: 10px;
  border-radius: 15px;
}
.wrapText {
}
.wrapBtn {
  margin: 0px 0px 10px 0px;
}
.btn {
  border-color: dimgrey;
  width: 120px;
}
.title {
  justify-content: center;
}
</style>