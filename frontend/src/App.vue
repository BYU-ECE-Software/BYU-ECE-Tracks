<template>
  <div class="container">
    <router-view />
  </div>
</template>

<script setup>
import CourseList from './views/CourseList.vue';
</script>

<style>
.container {
  padding: 20px;
}
</style>
