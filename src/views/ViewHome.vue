<template>
  <WebLayout>
    <div class="ht-wrapper">
      <div class="parent-grid">
        <div class="center-container">
          <img class="logo" src="@/assets/img/VUS-logo.png" />
        </div>
        <nav>
          <router-link :to="{ name: 'search' }" class="ht-button"
            >Start Application</router-link
          >
        </nav>
      </div>
      <div class="break"></div>

      <p>
        <b>CRISPR-VUS</b> is a cutting-edge, interactive web-based application
        designed to facilitate the <b>visualization </b> of
        <b>CRISPR enhanced identification</b> of
        <b>Unknown Significance</b> obtained by <b>CRISPR</b>-enhanced
        assessments across a <b>wide range</b> of cancer <b>tissues</b> and
        <b>cell</b> lineages. <br />
        <br />
        This sophisticated tool integrates <b>mutation</b>,
        <b>dependency</b> and <b>drug sensitivity</b> data in cell line models
        bearing VUS identified from large patients’ cohorts
        <b>(COSMIC and IntOGen)</b>, thus providing a
        <b>multiscale</b> characterization of <b>genomic variations</b> to act
        as dependency associated <b>(DAMs)</b> or sensitivity associated
        mutations <b>(SAMs)</b> . <br />
        <br />
        Ultimately, <b>CRISPR-VUS </b> presents as a functional portal for
        bridging the <b>unknown clinical significance</b> of underestimated
        genetic features in the oncological domain with concrete established
        <b>experimental proof</b> of essentiality and pharmacological
        vulnerability towards indications for <b>therapeutic targets</b> and
        <b>drug repositioning</b> opportunities. <br />
      </p>

      <div class="break"></div>

      <div class="section-wrapper">
        <section class="section-grid-1">
          <div class="ht-layout-stack">
            <h1>Step 1: Start by typing in a gene or selecting a variant</h1>
            <ul>
              <li>Inputting the targeted <b>gene</b></li>
              <li>Selecting a <b>variant</b> from the chart</li>
            </ul>
            <p>
              DAMs found in at least one patient of the corresponding cancer
              type where they were identified as dependency associated. Labels
              indicating gene name and aminoacidic variation are coloured
              according to previous indication of a gene being a driver.
              <br />
              <br />
              Orange bars represent the number of patients of the corresponding
              cancer type carrying the specific DAM: light and dark orange
              indicate different clinical databases.
              <br />
              <br />
              Purple bars represent the number of cancer types where the DAM was
              both identified as dependency-associated (according to our
              pipeline) and found in at least one patient. Red dots and
              triangles label variants predicted as strongly impacting the gene
              function according to two algorithms (SIFT or PolyPhen).
            </p>
          </div>

          <img src="@/assets/img/section-1.png" alt="login form" />
        </section>
        <section class="section-grid-2">
          <div class="ht-layout-stack">
            <h2>Step 2: Click on any squares of the heat-map</h2>
            <p>
              Summary of variants for a given gene with DAM characterization,
              deleterious effect prediction, representation across cancer types
              and frequency in patient carrying the alteration, with the
              possibility for direct insight on its essentiality across the
              underlying cell lines.
            </p>
          </div>

          <img src="@/assets/img/section-2.png" alt="login form" />
        </section>
        <section class="section-grid-1">
          <div class="ht-layout-stack">
            <h2>Step 3: LFC graph</h2>
            <ul>
              <li>Use drop down to access other <b>drugs</b></li>
              <li>
                Selecting between <b>essentiallity</b> or <b>sensitivity</b>
              </li>
            </ul>
            <p>
              Projection of the sorted fitness of all cell lines within a given
              cancer type known for their presence and absence of a studied VUS,
              obtained by essentiality assessment using CRISPR and
              pharmacological inhibition by drugs targeting this variation.
            </p>
          </div>

          <img src="@/assets/img/section-3.png" alt="login form" />
        </section>
      </div>
    </div>
  </WebLayout>
</template>

<script>
import WebLayout from '../layouts/WebLayout.vue';

export default {
  components: { WebLayout },
  setup() {
    return {};
  },
};
</script>

<style lang="postcss">
@import '@computational-biology-sw-web-dev-unit/ht-design/style.css';

.break {
  border-top: 1px solid var(--ht-color-gray-1);
  margin-top: 5%;
  margin-bottom: 5%;
}

.parent-grid {
  display: grid;

  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(2, auto);

  grid-template-areas:
    'a1 a2 a3 a4 a5'
    'b1 logo logo logo b5'
    'c1 c2 button c4 c5';

  .center-container {
    width: 100%;
    grid-area: logo;

    align-self: center;
    justify-self: center;

    margin-top: 10%;
  }

  nav {
    margin-top: 10%;
    margin-bottom: 10%;
    grid-area: button;
    align-self: start;
    justify-self: center;
  }
}

section {
  margin-bottom: var(--size-10);
}

.section-wrapper {
  width: min(var(--width, 80rem), 100% - 2em);
  margin-inline: auto;
  margin-top: 10%;
}

.section-grid-1 {
  display: grid;

  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 20px;

  gap: var(--size-8);

  place-items: center;

  grid-template-areas: 'image info';
  grid-template-columns: 1fr 1fr;

  img {
    box-shadow: var(--shadow-3);
    grid-area: image;
  }

  p {
    max-width: 70ch;
    grid-area: info;
  }
}

.section-grid-2 {
  display: grid;

  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 20px;

  gap: var(--size-8);

  place-items: center;

  grid-template-areas: 'info image';
  grid-template-columns: 1fr 1fr;

  img {
    box-shadow: var(--shadow-3);
    grid-area: image;
  }

  p {
    max-width: 70ch;
    grid-area: info;
  }
}
</style>
