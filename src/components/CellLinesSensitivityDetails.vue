<template>
  <div class="ht-layout-stack">
    <div>
      <ul class="ht-reset">
        <li><b>Cancer Type:</b> {{ details.tissueName }}</li>
        <li><b>Rank Ratio:</b> {{ Number(details.rankRatio.toFixed(2)) }}</li>
        <li><b>All DAMs</b></li>
        <li>
          <b>Drug: </b> {{ drug?.drugName }}, GDSC {{ drug?.gdscVersion }} (is
          SAM: {{ Boolean(drug?.sam) }})
        </li>
      </ul>

      <ht-select
        :model-value="drug"
        class="ht-formgroup"
        :options="drugs"
        @update:model-value="onUpdate"
      ></ht-select>
    </div>
    <div>
      <p class="legend-title">Variants</p>
      <ul class="ht-reset">
        <li>
          <span class="mutation-symbol mutation-symbol-present"></span>
          <span>Present</span>
        </li>
        <li>
          <span class="mutation-symbol mutation-symbol-absent"></span>
          <span>Absent</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'CellLinesSensitivityDetails',
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
