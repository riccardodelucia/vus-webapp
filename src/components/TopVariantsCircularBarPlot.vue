<template>
  <svg
    v-if="data"
    class="ht-chart"
    preserveAspectRatio="xMinYMin meet"
    :viewBox="[0, 0, width, height].join(' ')"
    :width="width"
    :height="height"
  >
    <g :transform="`translate(${width / 2}, ${height / 2})`">
      <g
        v-for="datum in data"
        :key="datum.variantId"
        class="combined-bar"
        @click="onClick(datum)"
        @mouseover="onMouseOver($event, datum)"
        @mouseleave="onMouseLeave"
      >
        <g
          :text-anchor="computeTextAnchor(datum)"
          :transform="computeTextTransform(datum)"
        >
          <text
            alignment-baseline="middle"
            font-size="12px"
            :transform="computeTextFlip(datum)"
            :fill="datum.isDriver ? 'DeepPink' : 'black'"
          >
            {{ datum.variantId }}
          </text>
          <circle
            v-if="datum.polyphenDeleterious"
            cx="25"
            cy="0"
            r="4px"
            fill="DeepPink"
          ></circle>

          <polygon
            v-if="datum.siftDeleterious"
            points="0,8 5,0 -5,0"
            fill="DeepPink"
            transform="rotate(180) translate(-10, -4) "
          ></polygon>
        </g>
        <path class="bar orange" :d="drawOuterBarPlot(datum)"></path>
        <path class="bar purple" :d="drawInnerBarPlot(datum)"></path>
      </g>
    </g>
  </svg>
</template>

<script setup>
import { useTooltip } from '@nf-data-iu3/ht-vue';

import { scaleBand, scaleRadial, arc, extent } from 'd3';

import { useRouter } from 'vue-router';

import { onBeforeMount, ref } from 'vue';

import service from '@/services';

import { sendErrorNotification } from '@nf-data-iu3/ht-vue';

import { AxiosError } from 'axios';

const processErrorMessage = (error) => {
  let message = 'Unknown Error';
  if (error instanceof AxiosError) {
    message = error.message;
  }
  return message;
};

const router = useRouter();

const { showTooltip, hideTooltip } = useTooltip({ allowHTML: true });

const width = 850;
const height = 1000;

const innerRadius = 220;
const labelSpace = 110; // used to leave space for labels on the radial barplots
const outerRadius = Math.min(width, height) / 2 - labelSpace;

const data = ref(null);
const xAxis = ref(null);
const yAxisOuter = ref(null);
const yAxisInner = ref(null);

onBeforeMount(async () => {
  try {
    const { data: variantsData } = await service.getMostImportantVariants();
    data.value = variantsData;

    xAxis.value = scaleBand()
      .range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .domain(data.value.map(({ variantId }) => variantId));

    //////////////////////////////////////////
    // Outer Bar Plot

    // Express nPatients in logScale. When nPatients = 1 -> log(nPatients) = 0
    const yDomainOuter = extent(
      data.value.map(({ nPatients }) => Math.log(nPatients))
    );

    // add 1 to compensate for next + 1 operation on outerRadius. This is needed to make sure bar with 1 patient have a non 0 height.
    // by adding 1 to yDoamin[1] we guarantee that log(max(nPatients)) + 1 still is comprised in the domain.
    yAxisOuter.value = scaleRadial()
      .range([innerRadius, outerRadius])
      .domain([yDomainOuter[0], yDomainOuter[1] + 1]);

    //////////////////////////////////////////
    // Inner Bar Plot

    const yDomainInner = extent(data.value.map(({ nTissues }) => nTissues));

    yAxisInner.value = scaleRadial()
      .range([innerRadius, 70])
      .domain([0, yDomainInner[1]]);
  } catch (error) {
    const message = processErrorMessage(error);
    sendErrorNotification({
      title: 'Cannot retrieve data',
      message,
    });
    return false;
  }
});

const drawOuterBarPlot = (datum) => {
  return arc()({
    innerRadius,
    outerRadius: yAxisOuter.value(Math.log(datum.nPatients) + 1),
    startAngle: xAxis.value(datum.variantId),
    endAngle: xAxis.value(datum.variantId) + xAxis.value.bandwidth(),
    padAngle: 0.005,
  });
};

const drawInnerBarPlot = (datum) => {
  return arc()({
    innerRadius,
    outerRadius: yAxisInner.value(datum.nTissues),
    startAngle: xAxis.value(datum.variantId),
    endAngle: xAxis.value(datum.variantId) + xAxis.value.bandwidth(),
    padAngle: 0.005,
  });
};

//////////////////////////////////////////
// Labels

/*
       This function allows to anchor text according to its start or end, depending on its corresponding bar.
       If the text is in the 'left half' of the circlo, it should be anchored to its end, such taht the end of text attaches smoothly to the corresponding outer bar.
       Viceversa, if the text is in the 'right part' of the circle, it should be anchored such that it start attaches to the corresponding outer bar.
    */
const computeTextAnchor = (datum) => {
  const orientation =
    (xAxis.value(datum.variantId) + xAxis.value.bandwidth() / 2 + Math.PI) %
      (2 * Math.PI) <
    Math.PI
      ? 'end'
      : 'start';
  return orientation;
};

// rotate and translate text according to the corresponding bar
const computeTextTransform = (datum) => {
  const rotation =
    ((xAxis.value(datum.variantId) + xAxis.value.bandwidth() / 2) * 180) /
      Math.PI -
    90;
  const translation = yAxisOuter.value(Math.log(datum.nPatients) + 1);

  const transform = `rotate(${rotation}) translate(${translation}, 0)`;

  return transform;
};

/*
        According to the functions above, text can be moved to the correct position and anchored such that it aligns and attaches correctly
        to the corresponding bar. Nevertheless, the rotation is continuous, and this will flip text upside down on the 'right part' of the circle.
        In order to make it better readable, we compensate the flip by reflipping the text.
    */
const computeTextFlip = (datum) => {
  const flip =
    (xAxis.value(datum.variantId) + xAxis.value.bandwidth() / 2 + Math.PI) %
      (2 * Math.PI) <
    Math.PI
      ? 'translate(35, 0) rotate(180)'
      : 'translate(35, 0) rotate(0)';

  return flip;
};

///////////////////////////////////
// listeners
const onClick = ({ variantId, geneId }) => {
  router.push({
    name: 'gene-variants',
    params: { geneId, variantId },
  });
};

const onMouseOver = function (
  event,
  { variantId, nPatients, nTissues, geneId, isDriver }
) {
  const htmlString = `
      <ul style="list-style: none; margin: 0">
        <li>Variant: ${variantId}</li>
        <li>Gene: ${geneId}</li>
        <li>Driver: ${Boolean(isDriver)}</li>
        <li># Patients (orange bar): ${nPatients}</li>
        <li># Tissues (purple bar): ${nTissues}</li>
      </ul>`;

  showTooltip(event, htmlString);
};

const onMouseLeave = function () {
  hideTooltip();
};
</script>

<style lang="postcss" scoped>
.bar {
  cursor: pointer;
  opacity: 0.5;
}

.combined-bar:hover > path {
  opacity: 1;
}
</style>
