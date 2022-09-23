<template>
    <div>
        <app-header/>
        <app-footer/>
    </div>
</template>

<script>
  import AppHeader from "@/components/header";
  import AppFooter from "@/components/footer";
  export default {
    name: 'dash-board',
    components: {
      AppFooter,
      AppHeader,
    },

    data: () => ({

    }),
  }
</script>
