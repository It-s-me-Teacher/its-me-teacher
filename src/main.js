import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createMemoryHistory, createRouter } from "vue-router";
import ClassesTable from "./components/ClassesTable.vue";
import StudentsTable from "./components/StudentsTable.vue";

const routes = [
  { path: "/classes", component: ClassesTable },
  { path: "/", component: ClassesTable },
  { path: "/students", component: StudentsTable },
];

import { createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

createApp(App).use(vuetify).use(router).mount("#app");
