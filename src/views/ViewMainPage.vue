<template>
  <ht-app-layout>
    <template #header><the-header></the-header></template>
    <template #sidenav>
      <the-sidenav></the-sidenav>
    </template>
    <template #default></template>
  </ht-app-layout>
</template>

<script>
import TheHeader from "@/components/TheHeader.vue";
import TheSidenav from "@/components/TheSidenav.vue";

export default {
  name: "ViewMainPage",
  components: { TheHeader, TheSidenav },
};
</script>
