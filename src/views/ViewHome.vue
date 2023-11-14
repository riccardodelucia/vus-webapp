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
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim officia,
        quisquam quod recusandae amet sed natus cupiditate dolore, magni sequi
        quas voluptate ducimus suscipit numquam, aperiam excepturi incidunt
        voluptates placeat! <br />

        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim officia,
        quisquam quod recusandae amet sed natus cupiditate dolore, magni sequi
        quas voluptate ducimus suscipit numquam, aperiam excepturi incidunt
        voluptates placeat! <br />

        <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim officia,
        quisquam quod recusandae amet sed natus cupiditate dolore, magni sequi
        quas voluptate ducimus suscipit numquam, aperiam excepturi incidunt
        voluptates placeat!
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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi
              odit modi ut consequatur corrupti eligendi quidem quam
              consequuntur voluptate minima quaerat doloremque provident vitae
              nostrum totam ipsum, pariatur praesentium aliquid?
            </p>
          </div>

          <img src="@/assets/img/section-1.png" alt="login form" />
        </section>
        <section class="section-grid-2">
          <div class="ht-layout-stack">
            <h2>Step 2: Click on any squares of the heat-map</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem inventore amet, quibusdam quod impedit distinctio sit
              aliquid incidunt eos laboriosam odit nostrum, perspiciatis maxime,
              nemo at commodi cum sunt facilis!
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
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque
              mollitia minima cupiditate harum consectetur nesciunt laboriosam
              nulla fugiat vitae culpa. Dolor, totam! Eligendi consequuntur iste
              commodi quo. Minima, sint sed.
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
