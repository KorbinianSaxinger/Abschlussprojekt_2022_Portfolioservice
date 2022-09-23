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
                <v-btn
                    v-for="link in links"
                    :key="link"
                    color="black"
                    text
                    rounded
                    class="my-2"
                    @click="redirect(link)"
                >
                  {{ link }}
                </v-btn>
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
            'About Us',
            'Impressum'
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
</style>
