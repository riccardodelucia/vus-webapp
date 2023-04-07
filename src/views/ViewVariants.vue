<template>
  <AppLayout>
    <div class="container card">
      <form class="controls margin-bottom" @submit.prevent="onSubmit">
        <ht-search-bar v-model="gene" placeholder="Search gene"></ht-search-bar>
        <button class="btn btn--primary">Search</button>
      </form>
      <router-view></router-view>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from "../layouts/AppLayout.vue";

import { ref } from "vue";

import { useRouter } from "vue-router";

export default {
  name: "ViewVariants",
  components: { AppLayout },
  setup() {
    const gene = ref("");
    const router = useRouter();

    async function onSubmit() {
      gene.value &&
        router.push({
          name: "gene",
          params: { id: gene.value },
        });
    }

    return {
      onSubmit,
      gene,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: fit-content;
  margin: var(--space-md);
}

.controls {
  display: flex;
  gap: var(--space-md);
}
</style>
