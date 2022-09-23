<template>
    <div class="footer">
        <v-footer
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
                  <router-link :to="link">
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
</template>

<script>
export default {
    name: 'app-footer',

    data: () => ({

        url: '',
        links: [
            'Home',
            'About',
            'Contact'
        ]
    }),
    methods: {
        redirect(link) {
          let url;
          url = 'http://localhost:8080/' + link
          window.location.href = url;
        }
    }
  }
</script>

<style scoped>
.links {
  margin-left: 42.4%;
  justify-content: end;
}
</style>
