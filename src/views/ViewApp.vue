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
        <button v-if="showBackButton" @click="navigateBack">
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

    const navigateBack = () => {
      if (route.name === 'variants') router.push({ name: 'search' });
      if (route.name.startsWith('cell-lines'))
        router.push({ name: 'variants' });
    };

    return {
      gene,
      onSubmit,
      router,
      showBackButton,
      navigateBack,
    };
  },
};
</script>

<style lang="postcss" scoped>
.controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--size-3);
  margin-bottom: var(--size-5);
  overflow-x: scroll;
}

h2 {
  font-size: var(--font-size-5);
}
</style>
