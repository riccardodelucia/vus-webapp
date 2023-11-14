<template>
  <CellLinesDetailsLayout :details="details">
    <template #ul>
      <li>
        <b>Drug: </b> {{ drug?.drugName }}, GDSC {{ drug?.gdscVersion }} (is
        SAM: {{ Boolean(drug?.sam) }})
      </li>
    </template>
    <template #default>
      <ht-select
        :model-value="drug"
        class="ht-formgroup"
        :options="drugs"
        @update:model-value="onUpdate"
      ></ht-select>
    </template>
  </CellLinesDetailsLayout>
</template>

<script>
import CellLinesDetailsLayout from '@/layouts/CellLinesDetailsLayout.vue';

import { ref } from 'vue';

export default {
  name: 'CellLinesSensitivityDetails',
  components: { CellLinesDetailsLayout },
  props: {
    details: {
      type: Object,
      required: true,
    },
    drugs: {
      type: Array,
      required: true,
    },
  },
  emits: ['update:model-value'],
  setup(props, { emit }) {
    const drug = ref(props.drugs[0]);
    emit('update:model-value', drug.value); // this component is delegated to setup for the first time the selected drug for its parent
    const onUpdate = (value) => {
      drug.value = value;
      emit('update:model-value', value);
    };
    return { drug, onUpdate };
  },
};
</script>
