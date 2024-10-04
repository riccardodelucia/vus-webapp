<template>
  <ht-layout-app :sidenav-object="sidenavObject">
    <template #header>
      <ht-theme-switcher></ht-theme-switcher>
    </template>
    <template #sidenav-list>
      <li class="sidenav-link">
        <RouterLink active-class="active" to="/">
          <VueFeather type="home"></VueFeather><span>Home</span>
        </RouterLink>
      </li>
      <li class="sidenav-link">
        <RouterLink active-class="active" to="/app">
          <VueFeather type="bar-chart-2"></VueFeather><span>App</span>
        </RouterLink>
      </li>
    </template>
    <div class="app-content ht-container ht-card">
      <div class="ht-container">
        <h2>CRISPR VUS Portal</h2>
        <div class="controls">
          <ht-search-bar
            v-model="gene"
            label="Search by gene"
            :hints="geneList"
            @submit="onSubmit"
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
  </ht-layout-app>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import service from '@/services';

export default {
  name: 'ViewApp',
  setup() {
    const gene = ref('');
    const router = useRouter();
    const route = useRoute();
    const geneList = ref([]);

    const sidenavObject = {
      title: 'CRISPR VUS',
      links: [
        { id: 1, url: '/', label: 'Home', type: 'home' },
        { id: 2, url: '/app', label: 'App', type: 'bar-chart-2' },
      ],
    };

    function onSubmit() {
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

    return {
      gene,
      geneList,
      onSubmit,
      router,
      showBackButton,
      navigateBack,
      sidenavObject,
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
