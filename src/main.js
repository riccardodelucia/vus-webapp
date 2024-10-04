import { createApp } from 'vue';
import router from './router';

import { HTVue } from '@nf-data-iu3/ht-vue';
import '@nf-data-iu3/ht-vue/style.css';

import VueFeather from 'vue-feather';

import App from './App.vue';

import GStore from '@/store';

import '@/assets/global.css';

const app = createApp(App).use(HTVue).use(router).provide('GStore', GStore);
app.component(VueFeather.name, VueFeather);

app.mount('#app');
