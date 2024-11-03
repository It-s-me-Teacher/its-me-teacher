import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createMemoryHistory, createRouter } from "vue-router";
import ClassesTable from "./components/ClassesTable.vue";
import StudentsTable from "./components/StudentsTable.vue";
import SignUp from "./components/SignUp.vue";

const routes = [
  { path: "/classes", component: ClassesTable,
    meta: { requiresAuth: true } },
  { path: "/", component: ClassesTable,
    meta: { requiresAuth: true } },
  { path: "/students", component: StudentsTable,
    meta: { requiresAuth: true } },
  { path:"/signup", component: SignUp},
];

import { createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/signup')
  } else {
    next()
  }
})

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

createApp(App).use(vuetify).use(router).mount("#app");
