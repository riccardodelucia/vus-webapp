<template>
  <AppLayout>
    <div class="ht-card ht-container ht-layout-stack app-content">
      <h2>Gene: {{ geneId.toUpperCase() }}</h2>
      <router-link
        class="ht-button"
        :to="{ name: 'search' }"
        data-type="secondary"
      >
        <span class="back-link"
          ><vue-feather type="arrow-left"></vue-feather>Search</span
        >
      </router-link>
      <div class="variants-multichart-container">
        <div class="details ht-layout-stack">
          <div class="legend">
            <p class="legend-title">DAM Status</p>
            <ul class="ht-reset">
              <li>
                <span
                  class="legend-symbol round-symbol"
                  style="background-color: dodgerblue"
                ></span>
                <span>mutated</span>
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
            </ul>
          </div>

          <ht-chart-legend-color
            :margins="legendChart.margins"
            :width="legendChart.width"
            :height="legendChart.height"
            :color="heatmapColor"
            title="log(#patients)"
          ></ht-chart-legend-color>
        </div>
        <div class="variants">
          <VariantsHeatmap
            :data="data"
            :aggregated-data="aggregatedData"
            :annotations="annotations"
            :gene-id="geneId"
            :color="heatmapColor"
            :sift-color="siftColor"
            :polyphen-color="polyphenColor"
          ></VariantsHeatmap>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from '@/layouts/AppLayout.vue';
import VariantsHeatmap from '@/components/VariantsHeatmap.vue';

import {
  scaleOrdinal,
  scaleSequentialLog,
  schemeSpectral,
  schemeRdBu,
  interpolateOranges,
  color,
  extent,
} from 'd3';

export default {
  name: 'ViewVariants',
  components: { AppLayout, VariantsHeatmap },
  props: {
    geneId: { type: String, required: true },
    data: { type: Array, required: true },
    aggregatedData: { type: Array, required: true },
    annotations: { type: Array, required: true },
  },
  setup(props) {
    const legendChart = {
      width: 150,
      height: 300,
      margins: {
        left: 10,
        right: 120,
        top: 30,
        bottom: 10,
      },
    };

    // sift and polyphen labels are hardcoded to avoid cases where the current variant doesn't have info for all of the possible sift and polyphen values
    const polyphen = ['probably_damaging', 'possibly_damaging', 'benign'];
    const polyphenColor = scaleOrdinal()
      .domain(polyphen)
      .range(schemeSpectral[3])
      .unknown('transparent');

    const sift = [
      'deleterious',
      'deleterious_low_confidence',
      'tolerated_low_confidence',
      'tolerated',
    ];
    const siftColor = scaleOrdinal()
      .domain(sift)
      .range(schemeRdBu[4])
      .unknown('transparent');

    const damColor = scaleOrdinal()
      .domain(['is DAM'])
      .range(['dodgerblue'])
      .unknown('transparent');

    const interpolator = (t) => {
      if (t === -Infinity) {
        return color('#eee');
      } else {
        return interpolateOranges(t);
      }
    };

    const heatmapColor = scaleSequentialLog(interpolator).domain(
      extent(props.data.map(({ nPatients }) => nPatients + 1))
    );

    return { legendChart, polyphenColor, siftColor, damColor, heatmapColor };
  },
};
</script>

<style lang="postcss" scoped>
.variants-multichart-container {
  display: grid;
  grid-template-areas: 'details heatmap';
  grid-template-columns: repeat(2, auto);
  grid-column-gap: var(--size-6);
}

.details {
  grid-area: details;
}

.variants {
  grid-area: heatmap;
}

.round-symbol {
  border-radius: var(--radius-round);
}
</style>
