<template>
  <div class="chart-details">
    <div class="ht-layout-stack">
      <div class="legend">
        <p class="legend-title">DAM Status</p>
        <ul class="ht-reset">
          <li>
            <span
              class="legend-symbol round-symbol"
              style="background-color: dodgerblue"
            ></span>
            <span>is DAM</span>
          </li>
        </ul>
      </div>
      <div class="legend">
        <p class="legend-title">Polyphen</p>
        <ul class="ht-reset">
          <li>
            <span
              class="legend-symbol square-symbol"
              :style="{
                backgroundColor: polyphenColor('probably_damaging'),
              }"
            ></span>
            <span>Probably Damaging</span>
          </li>
          <li>
            <span
              class="legend-symbol square-symbol"
              :style="{
                backgroundColor: polyphenColor('possibly_damaging'),
              }"
            ></span>
            <span>Possibly Damaging</span>
          </li>
          <li>
            <span
              class="legend-symbol square-symbol"
              :style="{
                backgroundColor: polyphenColor('benign'),
              }"
            ></span>
            <span>Benign</span>
          </li>
          <li>
            <span
              class="legend-symbol square-symbol"
              style="background-color: #eee"
            ></span>
            <span>Not Annotated</span>
          </li>
        </ul>
      </div>
      <div class="legend">
        <p class="legend-title">SIFT</p>
        <ul class="ht-reset">
          <li>
            <span
              class="legend-symbol square-symbol"
              :style="{
                backgroundColor: siftColor('deleterious'),
              }"
            ></span>
            <span>deleterious</span>
          </li>
          <li>
            <span
              class="legend-symbol square-symbol"
              :style="{
                backgroundColor: siftColor('deleterious_low_confidence'),
              }"
            ></span>
            <span>deleterious low confidence</span>
          </li>
          <li>
            <span
              class="legend-symbol square-symbol"
              :style="{
                backgroundColor: siftColor('tolerated_low_confidence'),
              }"
            ></span>
            <span>tolerated low confidence</span>
          </li>
          <li>
            <span
              class="legend-symbol square-symbol"
              :style="{
                backgroundColor: siftColor('tolerated'),
              }"
            ></span>
            <span>tolerated</span>
          </li>
          <li>
            <span
              class="legend-symbol square-symbol"
              style="background-color: #eee"
            ></span>
            <span>Not Annotated</span>
          </li>
        </ul>
      </div>
    </div>
    <ht-chart-legend-color
      :margins="legendSizes.margins"
      :width="legendSizes.width"
      :height="legendSizes.height"
      :color="heatmapColor"
      title="#patients"
    ></ht-chart-legend-color>
  </div>
</template>

<script setup>
defineProps({
  legendSizes: { type: Object, required: true },
  polyphenColor: { type: Function, required: true },
  siftColor: { type: Function, required: true },
  heatmapColor: { type: Function, required: true },
});
</script>

<style lang="postcss" scoped>
.chart-details {
  display: flex;
  gap: var(--size-4);
}
</style>
