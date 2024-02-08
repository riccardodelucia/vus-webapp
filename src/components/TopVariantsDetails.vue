<template>
  <div class="legend">
    <p class="legend-title">Legend</p>
    <ul class="ht-reset">
      <li style="color: DeepPink">Established Driver variant</li>
      <li>Variant of Unknown Significance</li>
      <li>
        <span class="legend-symbol square-symbol orange"></span>
        <span>Number of Patients</span>
      </li>
      <li>
        <span class="legend-symbol square-symbol purple"></span>
        <span>Number of Tissues</span>
      </li>
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
        <span>Damaging Polyphen</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TopVariantsDetails',
};
</script>

<style lang="postcss" scoped></style>
