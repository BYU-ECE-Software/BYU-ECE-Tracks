<template>
  <HeaderBar/>
  <div class="container">
    <router-view />
  </div>
  <FooterBar/>
</template>

<script setup>
import FooterBar from './components/FooterBar.vue';
import HeaderBar from './components/HeaderBar.vue';
import CourseList from './views/CourseList.vue';
</script>

