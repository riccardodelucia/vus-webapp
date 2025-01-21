<template>
  <LayoutApp>
    <div class="app-content ht-container ht-card">
      <div class="ht-container">
        <h2>CRISPR VUS Portal</h2>
        <div class="controls">
          <ht-search-bar
            v-model="gene"
            label="Search by gene"
            :hints="geneList"
            @search="onSearch"
          ></ht-search-bar>
          <router-link
            class="ht-button"
            :to="{ name: 'top-variants' }"
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
    </div>
  </LayoutApp>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import service from '@/services';

import LayoutApp from '@/layouts/LayoutApp.vue';

const gene = ref('');
const router = useRouter();
const route = useRoute();
const geneList = ref([]);

function onSearch() {
  router.push({
    name: 'gene-variants',
    params: { geneId: gene.value },
  });
  gene.value = '';
}
const showBackButton = computed(() => {
  return route.fullPath !== '/app';
});

const navigateBack = () => {
  if (route.name === 'gene-variants') router.push({ name: 'top-variants' });
  if (route.name.startsWith('cell-lines'))
    router.push({ name: 'gene-variants' });
};

onMounted(async () => {
  const { data } = await service.getGeneList();

  if (!data) {
    throw new Error(`Unable to retrieve data`);
  }

  geneList.value = data.map(({ geneId }) => geneId);
});
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

.sidenav-link {
  margin-bottom: var(--size-1);
}

.sidenav-link > a {
  display: flex;
  align-items: center;
  padding: var(--size-2);
  gap: var(--size-3);
  cursor: pointer;
  color: white;
  text-decoration: none;

  &.active {
    background-color: var(--ht-color-secondary);
  }

  &:not(.active):hover {
    background-color: var(--ht-color-secondary);
  }

  &:not(.active):hover span {
    transform: translateX(0.5em);
  }

  & > span {
    transition: transform 0.3s ease-in-out;
  }
}
</style>
