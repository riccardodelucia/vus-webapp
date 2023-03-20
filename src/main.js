import { createApp } from "vue";
import router from "./router";

import { HTVue } from "@computational-biology-web-unit/ht-vue";
import "@computational-biology-web-unit/ht-design/style.css";

import VueFeather from "vue-feather";

import App from "./App.vue";

import GStore from "@/store";

const app = createApp(App).use(HTVue).use(router).provide("GStore", GStore);
app.component(VueFeather.name, VueFeather);

app.mount("#app");
