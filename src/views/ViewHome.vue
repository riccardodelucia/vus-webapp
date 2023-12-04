<template>
  <div class="container">
    <TheHeader></TheHeader>
    <main>
      <div class="ht-wrapper">
        <section class="hero">
          <img
            class="logo"
            src="@/assets/img/VUS-logo.png"
            alt="Logo of the CRISPR-VUS application"
          />
          <nav>
            <router-link :to="{ name: 'top-variants' }" class="ht-button"
              >Start Application</router-link
            >
          </nav>
        </section>
        <section class="intro ht-layout-stack">
          <p>
            <b>CRISPR-VUS</b> is a cutting-edge, interactive web-based
            application designed to facilitate the <b>visualization </b> of
            <b>CRISPR enhanced identification</b> of
            <b>Unknown Significance</b> obtained by <b>CRISPR</b>-enhanced
            assessments across a <b>wide range</b> of cancer <b>tissues</b> and
            <b>cell</b> lineages.
          </p>
          <p>
            This sophisticated tool integrates <b>mutation</b>,
            <b>dependency</b> and <b>drug sensitivity</b> data in cell line
            models bearing VUS identified from large patients’ cohorts
            <b>(COSMIC and IntOGen)</b>, thus providing a
            <b>multiscale</b> characterization of <b>genomic variations</b> to
            act as dependency associated <b>(DAMs)</b> or sensitivity associated
            mutations <b>(SAMs)</b> .
          </p>
          <p>
            Ultimately, <b>CRISPR-VUS </b> presents as a functional portal for
            bridging the <b>unknown clinical significance</b> of underestimated
            genetic features in the oncological domain with concrete established
            <b>experimental proof</b> of essentiality and pharmacological
            vulnerability towards indications for <b>therapeutic targets</b> and
            <b>drug repositioning</b> opportunities.
          </p>
        </section>

        <div class="section-wrapper">
          <section class="section-grid section-grid-1">
            <div class="ht-layout-stack">
              <h2>Step 1: Start by typing in a gene or selecting a variant</h2>
              <ul>
                <li>Inputting the targeted <b>gene</b></li>
                <li>Selecting a <b>variant</b> from the chart</li>
              </ul>
              <p>
                DAMs found in at least one patient of the corresponding cancer
                type where they were identified as dependency associated. Labels
                indicating gene name and aminoacidic variation are coloured
                according to previous indication of a gene being a driver.
              </p>
              <p>
                Orange bars represent the number of patients of the
                corresponding cancer type carrying the specific DAM: light and
                dark orange indicate different clinical databases.
              </p>
              <p>
                Purple bars represent the number of cancer types where the DAM
                was both identified as dependency-associated (according to our
                pipeline) and found in at least one patient. Red dots and
                triangles label variants predicted as strongly impacting the
                gene function according to two algorithms (SIFT or PolyPhen).
              </p>
            </div>
            <img
              src="@/assets/img/section-1.png"
              alt="Image of the first page of the application showing the search bar and the interactive circle chart"
            />
          </section>
          <section class="section-grid section-grid-2">
            <div class="ht-layout-stack">
              <h2>Step 2: Click on any squares of the heat-map</h2>
              <p>
                Summary of variants for a given gene with DAM characterization,
                deleterious effect prediction, representation across cancer
                types and frequency in patient carrying the alteration, with the
                possibility for direct insight on its essentiality across the
                underlying cell lines.
              </p>
            </div>
            <img
              src="@/assets/img/section-2.png"
              alt="Image showing a heat map of patients data and gene variants"
            />
          </section>
          <section class="section-grid section-grid-1">
            <div class="ht-layout-stack">
              <h2>Step 3: LFC graph</h2>
              <ul>
                <li>Use drop down to access other <b>drugs</b></li>
                <li>
                  Selecting between <b>essentiallity</b> or <b>sensitivity</b>
                </li>
              </ul>
              <p>
                Projection of the sorted fitness of all cell lines within a
                given cancer type known for their presence and absence of a
                studied VUS, obtained by essentiality assessment using CRISPR
                and pharmacological inhibition by drugs targeting this
                variation.
              </p>
            </div>

            <img
              src="@/assets/img/section-3.png"
              alt="Image showing sensitivity and essentiality charts on cell lines"
            />
          </section>
        </div>
      </div>
    </main>
    <ht-footer>
      <div class="footer-content">
        <h2>VUS Portal</h2>
      </div>
    </ht-footer>
  </div>
</template>

<script>
import TheHeader from '@/components/TheHeader.vue';

export default {
  components: { TheHeader },
};
</script>

<style lang="postcss">
.hero {
  display: grid;
  justify-items: center;
  padding: var(--size-8);
  grid-row-gap: var(--size-6);

  img {
    max-width: 40rem;
  }

  @media (max-width: 55em) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
    }
  }
}

.intro {
  padding: var(--size-6);
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
}

section {
  margin-bottom: var(--size-10);
}

.section-wrapper {
  width: min(var(--width, 80rem), 100% - 2em);
  margin-inline: auto;
  margin-top: 10%;
}

.section-grid {
  display: grid;

  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 20px;

  gap: var(--size-8);

  place-items: center;

  img {
    box-shadow: var(--shadow-3);
    grid-area: image;
  }

  p,
  ul {
    max-width: 70ch;
    grid-area: info;
  }

  &.section-grid-1 {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'image info';

    @media (max-width: 55em) {
      box-shadow: var(--shadow-3);
      padding: 2rem;

      grid-template-columns: 1fr;
      grid-template-rows: 1fr;

      grid-template-areas:
        'info'
        'image';
    }
  }

  &.section-grid-2 {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'info image';

    @media (max-width: 55em) {
      box-shadow: var(--shadow-3);
      padding: 2rem;

      grid-template-columns: 1fr;
      grid-template-rows: 1fr;

      grid-template-areas:
        'info'
        'image';
    }
  }
}

.container {
  display: grid;
  min-height: 100vh;
  min-height: 100dvh;
  grid-template-rows: auto 1fr auto;
}

.footer-content {
  padding-block: var(--size-4);
  text-align: center;
  margin-bottom: var(--size-6);

  h2 {
    font-size: var(--font-size-6);
  }
}
</style>
