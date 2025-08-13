<template>
  <div id="app" class="flex flex-col min-h-screen">
    <HeaderBar/>
    <div class="flex-grow min-h-[80vh]">
      <router-view />
    </div>
    <FooterBar/>
  </div>
</template>

<script setup>
import FooterBar from './components/FooterBar.vue';
import HeaderBar from './components/HeaderBar.vue';
</script>
