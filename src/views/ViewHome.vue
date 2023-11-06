<template>
  <WebLayout>
    <section class="hero-section">
      <div class="hero ht-wrapper">
        <img src="@/assets/img/VUS-logo.png" />
        <article>
          <h1>Welcome to VUS Web App</h1>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus,
            ex, et pariatur quibusdam molestiae unde exercitationem ut sit
            consequuntur optio labore doloribus quod. Sunt eos voluptate aliquid
            est nesciunt eveniet?
          </p>
        </article>
        <nav>
          <router-link :to="{ name: 'search' }" class="ht-button"
            >Go to the Application</router-link
          >
        </nav>
      </div>
    </section>
    <div class="section-wrapper">
      <section class="section-grid-1">
        <div class="ht-layout-stack">
          <h1>Step 1: Start by typing in a gene or selecting a variant</h1>
          <ul>
            <li>Inputting the targeted <b>gene</b></li>
            <li>Selecting a <b>variant</b> from the chart</li>
          </ul>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi odit
            modi ut consequatur corrupti eligendi quidem quam consequuntur
            voluptate minima quaerat doloremque provident vitae nostrum totam
            ipsum, pariatur praesentium aliquid?
          </p>
        </div>

        <img src="@/assets/img/section-1.png" alt="login form" />
      </section>
      <section class="section-grid-2">
        <div class="ht-layout-stack">
          <h2>Step 2: Click on any squares of the heat-map</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            inventore amet, quibusdam quod impedit distinctio sit aliquid
            incidunt eos laboriosam odit nostrum, perspiciatis maxime, nemo at
            commodi cum sunt facilis!
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

<style lang="postcss" scoped>
@import '@computational-biology-sw-web-dev-unit/ht-design/style.css';

section {
  margin-bottom: var(--size-10);
}

.section-wrapper {
  width: min(var(--width, 80rem), 100% - 2em);
  margin-inline: auto;
}
.hero-section {
  color: #fff;
  background-image: linear-gradient(
      to right bottom,
      rgba(20, 58, 105, 0.6),
      rgba(31, 89, 160, 0.9)
    ),
    url('../assets/img/dna-representation-collage.jpg');
  background-position: center;

  .hero {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 5fr 1fr;
    grid-template-areas:
      'logo summary'
      'logo link';
    grid-column-gap: 20px;
    grid-row-gap: 20px;

    gap: 2rem;
    color: #fff;

    padding-block: 2em;
    text-align: center;

    justify-items: center;
    align-items: center;

    img {
      width: 100%;
      grid-area: logo;
    }

    article {
      grid-area: summary;
      text-align: left;
      font-size: var(--font-size-3);
      line-height: var(--font-lineheight-4);

      h1 {
        padding: 2%;
        font-size: var(--font-size-7);
        font-weight: var(--font-weight-4);
      }
    }

    nav {
      grid-area: link;
      .ht-button {
        background-color: var(--ht-color-secondary);
        border: 2px solid var(--ht-color-secondary);
      }
    }
  }
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
    grid-area: image; /* Specify the grid area for the image */
  }

  p {
    max-width: 70ch;
    grid-area: info; /* Specify the grid area for the text */
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
    grid-area: image; /* Specify the grid area for the image */
  }

  p {
    max-width: 70ch;
    grid-area: info; /* Specify the grid area for the text */
  }
}
</style>
