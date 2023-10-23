<template>
  <AppLayout>
    <div class="ht-container">
      <h2>VUS Portal</h2>
      <div class="controls">
        <ht-search-bar
          v-model="gene"
          label="Search by gene"
          @submit="onSubmit"
        ></ht-search-bar>
        <router-link
          class="ht-button"
          :to="{ name: 'search' }"
          data-type="secondary"
        >
          Show Top Variants
        </router-link>
      </div>

      <router-view></router-view>
    </div>
  </AppLayout>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '@/layouts/AppLayout.vue';

export default {
  name: 'ViewApp',
  components: { AppLayout },
  setup() {
    const gene = ref('');
    const router = useRouter();

    function onSubmit() {
      router.push({
        name: 'variants',
        params: { geneId: gene.value },
      });
    }
    return {
      gene,
      onSubmit,
    };
  },
};
</script>

<style lang="postcss" scoped>
.controls {
  display: flex;
  align-items: center;
  gap: var(--size-3);
  margin-bottom: var(--size-5);
}

h2 {
  font-size: var(--font-size-5);
}
</style>
