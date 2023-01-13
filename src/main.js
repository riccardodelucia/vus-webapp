import { createApp } from "vue";
import router from "./router";

import HTComponents from "ht-vue/components";
import "ht-design/dist/style.css";

import VueFeather from "vue-feather";

import App from "./App.vue";

const app = createApp(App).use(HTComponents).use(router);
app.component(VueFeather.name, VueFeather);

app.mount("#app");
