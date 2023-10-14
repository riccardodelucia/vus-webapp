<template>
  <div class="legend">
    <p class="legend-title">Legend</p>
    <ul class="ht-reset">
      <li style="color: DeepPink">Driver variant</li>
      <li>Non-Driver variant</li>
      <li>
        <svg
          preserveAspectRatio="xMinYMin meet"
          viewBox="0, 0, 10, 10"
          width="10"
          height="10"
        >
          <circle cx="5" cy="5" r="4px" fill="DeepPink"></circle>
        </svg>
        <span>Deleterious SIFT</span>
      </li>
      <li>
        <svg
          preserveAspectRatio="xMinYMin meet"
          viewBox="0, 0, 10, 10"
          width="10"
          height="10"
        >
          <polygon points="5,0 0,8 10,8" fill="DeepPink"></polygon>
        </svg>
        <span>Deleterious Polyphen</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ChartDetails',
};
</script>

<style lang="postcss" scoped></style>
