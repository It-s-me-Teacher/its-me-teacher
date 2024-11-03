<script setup>
import Navbar from "./components/Navbar.vue";
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <main>
    <div class="application">
      <div class="navbar" v-if="!['signup', 'login'].includes(route.path.slice(1))" style="z-index: 2;">
        <Navbar />
      </div>
      <div class="content" :class="{ 'no-margin': ['signup', 'login'].includes(route.path.slice(1)) }">
        <RouterView />
      </div>
    </div>
  </main>
</template>

<style scoped>
.application {
  display: flex;
  height: 100vh;
}
.content {
  margin-left: 50px;
  width: 100%;
  height: 100%;
}
.content.no-margin {
  margin-left: 0;
}
</style>
