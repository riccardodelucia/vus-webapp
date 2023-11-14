<template>
  <WebLayout>
    <router-link :to="{ name: 'top-variants' }" class="ht-button"
      >Go to research page</router-link
    >
  </WebLayout>
</template>

<script>
import WebLayout from '../layouts/WebLayout.vue';
export default {
  components: { WebLayout },
  setup() {
    return {};
  },
};
</script>

<style lang="postcss" scoped></style>
