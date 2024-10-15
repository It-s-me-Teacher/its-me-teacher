<script setup>
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <main>
    <div class="application">
      <div class="navbar" style="z-index: 2;">
        <Navbar />
      </div>
      <div class="content">
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
</style>
