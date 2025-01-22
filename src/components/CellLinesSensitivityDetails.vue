<template>
  <div class="ht-layout-stack">
    <div>
      <ul class="ht-reset">
        <li><b>Cancer Type:</b> {{ details.tissueName }}</li>
        <li><b>Rank Ratio:</b> {{ rankRatio }}</li>
        <li><b>All DAMs</b></li>
        <li><b>Drug: </b>{{ selectedDrug?.drugName }}</li>
        <li><b>GDSC version: </b>{{ selectedDrug?.gdscVersion }}</li>
        <li><b>is SAM: </b>{{ Boolean(selectedDrug?.sam) }}</li>
      </ul>
      <ht-select
        v-model="selectedDrug"
        class="ht-formgroup"
        label="Select drug: "
        :options="drugs"
        :option-labels="drugLabels"
        :show-disabled-option="false"
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
import { computed } from 'vue';

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

const selectedDrug = defineModel({ type: Object });
const drugLabels = computed(() => props.drugs.map(({ drugName }) => drugName));

const rankRatio = computed(() => {
  const ratio = Number(props.details.rankRatio.toFixed(2));
  if (ratio === 0) return 'undefined';
  return ratio;
});

const concMin = computed(() => props.details.concMin);

const concMax = computed(() => props.details.concMax);
</script>
