<template>
  <div class="container">
    <TheHeader></TheHeader>
    <main>
      <router-link :to="{ name: 'top-variants' }" class="ht-button"
        >Go to research page</router-link
      >
    </main>
    <ht-footer>
      <div class="footer-content">
        <h2>VUS Portal</h2>
      </div>
    </ht-footer>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue';

export default {
  components: { TheHeader },
  setup() {
    return {};
  },
};
</script>

<style lang="postcss" scoped>
.container {
  display: grid;
  min-height: 100vh;
  min-height: 100dvh;
  grid-template-rows: auto 1fr auto;
}

.footer-content {
  padding-block: var(--size-4);
  text-align: center;
  margin-bottom: var(--size-6);

  h2 {
    font-size: var(--font-size-6);
  }
}

.footer-link {
  text-decoration: none;
  color: white;

  &:hover {
    text-decoration: underline;
  }
}
</style>
