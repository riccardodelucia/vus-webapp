<template>
  <CellLinesDetailsLayout :details="details">
    <template #ul>
      <li v-if="details.variantId">
        <b>Variant:</b> {{ details.variantId }} (is DAM: {{ details.dam }})
      </li>
      <li v-else><b>All variants</b></li>
    </template>
  </CellLinesDetailsLayout>
</template>

<script>
import CellLinesDetailsLayout from '@/layouts/CellLinesDetailsLayout.vue';

export default {
  name: 'EssentialityDetails',
  components: { CellLinesDetailsLayout },
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {};
  },
};
</script>
