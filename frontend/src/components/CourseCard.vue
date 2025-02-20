<template>
    <Card class="course-card">
      <template #header>
        <img :src="course.image" alt="Course Image" class="course-image" />
      </template>
      <template #title>{{ course.title }}</template>
      <template #content>
        <p>{{ course.description }}</p>
        <div class="course-tags">
          <Tag v-for="major in course.majors" :key="major" :value="major" />
          <Tag v-for="company in course.companies" :key="company" :value="company" class="p-mr-2" />
        </div>
      </template>
    </Card>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  import Card from 'primevue/card';
  import Tag from 'primevue/tag';
  
  defineProps({
    course: Object,
  });
  </script>
  
  <style scoped>
  .course-card {
    width: 300px;
  }
  .course-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }
  .course-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  </style>
  