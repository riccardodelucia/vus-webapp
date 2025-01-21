<template>
  <div class="ht-layout-stack">
    <div>
      <ul class="ht-reset">
        <li><b>Cancer Type:</b> {{ details.tissueName }}</li>
        <li><b>Rank Ratio:</b> {{ rankRatio }}</li>
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
    <div>
      <p class="legend-title">Screening Concentration</p>
      <ul class="ht-reset">
        <li><b>Min: </b>{{ concMin }} uM</li>
        <li><b>Max: </b>{{ concMax }} uM</li>
        <li>* shown within the light-grey area</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  details: {
    type: Object,
    required: true,
  },
  drugs: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:model-value']);

const drug = ref(props.drugs[0]);
emit('update:model-value', drug.value); // this component is delegated to setup for the first time the selected drug for its parent
const onUpdate = (value) => {
  drug.value = value;
  emit('update:model-value', value);
};

const rankRatio = computed(() => {
  const ratio = Number(props.details.rankRatio.toFixed(2));
  if (ratio === 0) return 'undefined';
  return ratio;
});

const concMin = computed(() => props.details.concMin);

const concMax = computed(() => props.details.concMax);
</script>
