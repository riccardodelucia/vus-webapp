<template>
  <svg
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
            font-size="10px"
            :transform="computeTextFlip(datum)"
          >
            {{ datum.variantId }}
          </text>
        </g>
        <path class="bar-orange" :d="drawOuterBarPlot(datum)"></path>
        <path class="bar-purple" :d="drawInnerBarPlot(datum)"></path>
      </g>
    </g>
  </svg>
</template>

<script>
import {
  getInnerChartSizes,
  useTooltip,
} from '@computational-biology-sw-web-dev-unit/ht-vue';

import { scaleBand, scaleRadial, arc, extent } from 'd3';

import { useRouter } from 'vue-router';

export default {
  name: 'CircularBarPlot',
  props: {
    data: { type: Array, required: true },
  },

  setup(props) {
    const router = useRouter();

    const { showTooltip, hideTooltip } = useTooltip({ allowHTML: true });

    const width = 1000;
    const height = 1000;

    const margins = {
      left: 50,
      right: 50,
      top: 50,
      bottom: 50,
    };

    const { innerWidth, innerHeight } = getInnerChartSizes(
      width,
      height,
      margins
    );

    const innerRadius = 200;
    const labelSpace = 60; // used to leave space for labels on the radial barplots
    const outerRadius = Math.min(innerWidth, innerHeight) / 2 - labelSpace;

    const xAxis = scaleBand()
      .range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .domain(props.data.map(({ variantId }) => variantId));

    //////////////////////////////////////////
    // Outer Bar Plot

    // Express nPatients in logScale. When nPatients = 1 -> log(nPatients) = 0
    const yDomainOuter = extent(
      props.data.map(({ nPatients }) => Math.log(nPatients))
    );

    // add 1 to compensate for next + 1 operation on outerRadius. This is needed to make sure bar with 1 patient have a non 0 height.
    // by adding 1 to yDoamin[1] we guarantee that log(max(nPatients)) + 1 still is comprised in the domain.
    const yAxisOuter = scaleRadial()
      .range([innerRadius, outerRadius])
      .domain([yDomainOuter[0], yDomainOuter[1] + 1]);

    const drawOuterBarPlot = (datum) => {
      return arc()({
        innerRadius,
        outerRadius: yAxisOuter(Math.log(datum.nPatients) + 1),
        startAngle: xAxis(datum.variantId),
        endAngle: xAxis(datum.variantId) + xAxis.bandwidth(),
        padAngle: 0.005,
      });
    };

    //////////////////////////////////////////
    // Inner Bar Plot

    const yDomainInner = extent(props.data.map(({ nTissues }) => nTissues));

    const yAxisInner = scaleRadial()
      .range([innerRadius, 5])
      .domain([0, yDomainInner[1]]);

    const drawInnerBarPlot = (datum) => {
      return arc()({
        innerRadius,
        outerRadius: yAxisInner(datum.nTissues),
        startAngle: xAxis(datum.variantId),
        endAngle: xAxis(datum.variantId) + xAxis.bandwidth(),
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
        (xAxis(datum.variantId) + xAxis.bandwidth() / 2 + Math.PI) %
          (2 * Math.PI) <
        Math.PI
          ? 'end'
          : 'start';
      return orientation;
    };

    // rotate and translate text according to the corresponding bar
    const computeTextTransform = (datum) => {
      const rotation =
        ((xAxis(datum.variantId) + xAxis.bandwidth() / 2) * 180) / Math.PI - 90;
      const translation = yAxisOuter(Math.log(datum.nPatients) + 1);

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
        (xAxis(datum.variantId) + xAxis.bandwidth() / 2 + Math.PI) %
          (2 * Math.PI) <
        Math.PI
          ? 'translate(5, 0) rotate(180)'
          : 'translate(5, 0) rotate(0)';

      return flip;
    };

    ///////////////////////////////////
    // listeners
    const onClick = ({ geneId }) => {
      router.push({
        name: 'variants',
        params: { geneId },
      });
    };

    const onMouseOver = function (event, { nPatients, nTissues }) {
      const htmlString = `<ul style="list-style: none; margin: 0"><li>Number of Patients: ${nPatients}</li><li>Number of Tissues: ${nTissues}</li></ul>`;

      showTooltip(event, htmlString);
    };

    const onMouseLeave = function () {
      hideTooltip();
    };

    return {
      margins,
      width,
      height,
      innerWidth,
      innerHeight,
      drawOuterBarPlot,
      drawInnerBarPlot,
      computeTextAnchor,
      computeTextTransform,
      computeTextFlip,
      onClick,
      onMouseOver,
      onMouseLeave,
    };
  },
};
</script>

<style lang="postcss" scoped>
.bar-orange {
  fill: orange;
  opacity: 0.5;
  cursor: pointer;
}

.bar-purple {
  fill: rebeccapurple;
  opacity: 0.5;
  cursor: pointer;
}

.combined-bar:hover > path {
  opacity: 1;
}
</style>
