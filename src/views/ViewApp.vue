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
        <button v-if="showBackButton" @click="router.go(-1)">
          &#8592; Back
        </button>
      </div>

      <router-view></router-view>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppLayout from '@/layouts/AppLayout.vue';

export default {
  name: 'ViewApp',
  components: { AppLayout },
  setup() {
    const gene = ref('');
    const router = useRouter();
    const route = useRoute();

    function onSubmit() {
      router.push({
        name: 'variants',
        params: { geneId: gene.value },
      });
      gene.value = '';
    }
    const showBackButton = computed(() => {
      return route.fullPath !== '/app';
    });

    return {
      gene,
      onSubmit,
      router,
      showBackButton,
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
