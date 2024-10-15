<script setup>
import { useRoute } from "vue-router";

defineProps({
  msg: String,
});

const route = useRoute();
</script>

<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer expand-on-hover rail>
        <v-list>
          <v-list-item
            prepend-avatar="/src/assets/user-icon.png"
            subtitle="user@gmail.com"
            title="Username"
          ></v-list-item>
        </v-list>
        <v-list density="compact" nav>
          <RouterLink class="nav-item" to="/classes"
            ><v-list-item
              class="nav-item"
              title="Aulas"
              prepend-icon="mdi-google-classroom"
              :disabled="route.path === '/' || route.path === '/classes'"
            >
            </v-list-item
          ></RouterLink>
          <RouterLink class="nav-item" to="/students"
            ><v-list-item
              class="nav-item"
              title="Alunos"
              prepend-icon="mdi mdi-account"
              :disabled="route.path === '/students'"
            >
            </v-list-item
          ></RouterLink>
        </v-list>
      </v-navigation-drawer>
    </v-layout>
  </v-card>
</template>

<style scoped>
.nav-item:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}
.nav-item {
  text-decoration: none;
  color: inherit;
}
.v-list-item--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
