<template>
<!--  <v-app id="inspire" style="height: 0px">-->
    <div>
        <v-footer
            class="footer"
            padless
            fixed
        >
            <v-row
                justify="center"
                no-gutters
            >
              <div class="links d-flex">
                <v-btn
                    v-for="link in links"
                    :key="link"
                    color="black"
                    text
                    rounded
                    class="my-2"
                >
                  <router-link :to="link" style="color: black">
                    {{ link }}
                  </router-link>
                </v-btn>
              </div>
                <v-col
                    class="py-4 text-center black--text"
                    cols="12"
                >
                  {{ new Date().getFullYear() }} - <strong> Korbinian Saxinger </strong>
                </v-col>
            </v-row>
        </v-footer>
    </div>
<!--  </v-app>-->
</template>

<script>
export default {
    name: 'app-footer',

    data: () => ({

        url: '',
        links: [
            'Home',
            'About',
            'Contact',
            'chart',
        ]
    }),
    methods: {
    }
  }
</script>

<style scoped>
.footer {
  height: 100px;
  background-color: rgba(148, 148, 148, 0.44);
}
.links {
  margin-left: auto;
  margin-right: auto;
  justify-content: center;
  color: forestgreen;
}
</style>
