import { createApp } from "vue";
import { createPinia } from "pinia";

import "./assets/styles/variables.scss";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";


// eslint-disable-next-line
const app = createApp(App).use(createPinia()).use(router).use(vuetify).mount("#app");
