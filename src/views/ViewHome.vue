<template>
  <LayoutWebpage>
    <div class="container">
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
              <b>CRISPR VUS</b> is a cutting-edge, interactive web-based
              application designed to facilitate the <b>visualization</b> of
              <b
                >cancer-dependent mutational Variants of Unknown Significance
                (VUS)</b
              >
              obtained by <b>CRISPR-enhanced assessments</b> across a wide range
              of cancer tissues and cell lineages.
            </p>
            <p>
              This tool integrates <b>mutation</b>, <b>dependency</b> and
              <b>drug sensitivity</b> data in cell line models bearing VUS, many
              of which represented in large patients’ cohorts
              <b>(COSMIC and IntOGen)</b>, thus providing a
              <b>multiscale characterization of cancer genomic variations</b>,
              such as mutations, to act as dependency associated
              <b>(DAMs)</b> or sensitivity associated mutations <b>(SAMs)</b>.
            </p>
            <p>
              Ultimately, <b>CRISPR VUS</b> presents as a functional portal for
              bridging the <b>unknown clinical significance</b> of genetic
              features currently underestimated in the oncological domain, with
              established <b>experimental proof</b> of essentiality and
              pharmacological vulnerability towards indications for
              <b>therapeutic targeting</b> and
              <b>drug repositioning</b> opportunities.
            </p>
          </section>

          <section class="section-grid">
            <div class="ht-layout-stack">
              <h2>Step 1</h2>
              <p>
                Click on the <b>Start Application</b> button here above, which
                leads you to the first application page. The page visualizes a
                circular bar plot interactive chart, which aims at showing the
                most frequently DAMs observed in patient, sorted by potential
                clinical impact. Labels describing gene name and aminoacidic
                variation are coloured according to previous knowledge of a gene
                being a driver, while dots and triangles mark variants predicted
                as strongly impacting the gene function according to two
                algorithms (SIFT or PolyPhen).
              </p>
              <p>
                Orange bars represent the number of patients of the
                corresponding cancer type carrying the specific DAM, as found in
                <i>COSMIC</i> and <i>IntOGen</i>, and are sorted by patients
                frequency. Purple bars represent the number of cancer types
                where the DAM was identified in cell lines, according to out
                pipeline, and found in at least one patient. Hovering on a bar,
                it turns full color, and a related tooltip appears, completing
                the information obtained from the chart.
              </p>
              <p>
                From this chart, you can access gene-specific variants
                information on a dedicated chart (Step 2). This can be
                accomplished by, either:
              </p>
              <ul>
                <li>
                  Inputting the desired gene in the <b>search bar</b> and
                  pressing the associated <em>magnifying glass icon</em>, or
                  pressing <em>Enter</em>. Take advantage of the gene hints
                  appaearing as you type-in.
                </li>
                <li>
                  Clicking on any bar from the chart, which triggers the related
                  gene variants information chart
                </li>
              </ul>
            </div>
            <img
              src="@/assets/img/section-1.png"
              alt="Image of the first page of the application showing the search bar and the interactive circle chart"
            />
          </section>
          <section class="section-grid section-grid-alt">
            <div class="ht-layout-stack">
              <h2>Step 2</h2>
              <p>
                This chart shows a summary of variants for a given gene with DAM
                characterization, gene mutation functional effect
                prediction,representation across cancer types and frequency in
                patients carrying the alteration. Variant specific information
                about SIFT and Polyphen values can be observed from the
                companion heatmap chart on the left. A bottom
                <b>Aggregated DAM</b> row combines info for all DAMs observed
                for a specific tissue, summing up the total number of patients
                per each variant.
              </p>
              <p>
                Blue-dotted tiles are associated to identified DAMs and can be
                clicked, accessing a third graph showing cell-lines related
                information (Step 3).
              </p>
              <p>
                Use the <b>Back button</b> or the
                <b>Show Top Variants Button</b> to get back to the circular
                barplot chart.
              </p>
              <small>
                Note: when this chart is navigated from a variant of the
                previous described circular barplot, the corresponding source
                variant is highlighted in red on the chart
              </small>
            </div>
            <img
              src="@/assets/img/section-2.png"
              alt="Image showing a heat map of patients data and gene variants"
            />
          </section>
          <section class="section-grid">
            <div class="ht-layout-stack">
              <h2>Step 3</h2>
              <p>
                This section provides gene-related cell-lines information. Two
                types of visualizations are shown.
                <i>Essentiality</i> information is always provided, projecting
                the sorted fitness of all cell lines within a given cancer type
                known for their presence or absence of a studied VUS, as
                obtained by essentiality assessment using CRISPR.
                <i>Sensitivity</i> data is optionally added when the chart is
                accessed from a specific combination of tissue and variant from
                step 2 if related information is available from the study. When
                both essentiality and sensitivity charts are present, you'll be
                shown with a tabbed chart, where you can click to switch between
                them.
              </p>
              <ul>
                <li>
                  <b>All tabs: </b> hover on red dots to show the name of the
                  variant observed in the corresponding cell-line.
                </li>
                <li>
                  <b>Sensitivity chart: </b> a selector is provided on the
                  details section to enable visualization of any available drug
                  tested against the corresponding cancer type cell lines,
                  showing the drug concentration range experimentally validated
                  as a light-grey area on the chart.
                </li>
              </ul>
              <p>
                Use the <b>Back button</b> to get back to the variants heatmap
                chart. Use the <b>Show Top Variants Button</b> to get back to
                the circular barplot chart.
              </p>
            </div>

            <img
              src="@/assets/img/section-3.png"
              alt="Image showing sensitivity and essentiality charts on cell lines"
            />
          </section>
        </div>
      </main>
    </div>
  </LayoutWebpage>
</template>

<script setup>
import LayoutWebpage from '@/layouts/LayoutWebpage.vue';
</script>

<style lang="postcss">
.hero {
  display: grid;
  justify-items: center;
  padding: var(--size-8);
  grid-row-gap: var(--size-6);

  img {
    max-width: 40rem;
    width: 100%;
  }
}

.intro {
  padding: var(--size-6);
  border-top: 1px solid var(--ht-color-gray-1);
  border-bottom: 1px solid var(--ht-color-gray-1);
}

section {
  margin-bottom: var(--size-10);
}

.section-grid {
  display: grid;

  grid-template-columns: repeat(2, 1fr);
  gap: var(--size-10);

  place-items: center;

  grid-template-areas: 'image info';

  img {
    box-shadow: var(--shadow-3);
    width: 100%;
    max-width: 40rem;
  }

  & > *:first-child {
    grid-area: info;
  }

  & > *:last-child {
    grid-area: image;
  }

  @media (max-width: 65em) {
    grid-template-columns: 1fr;

    grid-template-areas:
      'info'
      'image';
  }
}

.section-grid-alt {
  grid-template-areas: 'info image';
  @media (max-width: 65em) {
    grid-template-columns: 1fr;

    grid-template-areas:
      'info'
      'image';
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
