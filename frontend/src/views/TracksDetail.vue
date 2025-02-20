<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
  <div class="p-8 max-w-7xl mx-auto">
    <!-- Centered Title -->
    <h1 class="text-5xl font-bold text-center mb-10">{{ track.name }}</h1>
    <br>

    <!-- Grid Layout for Companies -->
    <h2 class="text-5xl font-bold text-center mb-10">Companies</h2>
    <div v-if="track.companies.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <Card v-for="companyId in track.companies" :key="companyId" class="track-card">
        <template #content>
          <div class="flex flex-col items-center">
            <div class="p-4 text-center">
              <!-- Track Name -->
              <h3 class="text-xl font-bold text-gray-800">{{ getCompanyName(companyId) }}</h3>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Centered Title -->
    <h2 class="text-5xl font-bold text-center mb-10">Primary Courses</h2>

    <!-- Grid Layout for Companies -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
      <Card v-for="courseId in track.primaryCourses" :key="courseId" class="track-card">
        <template #content>
          <div class="flex flex-col items-center">
            <div class="p-4 text-center">
              <!-- Track Name -->
              <h3 class="text-xl font-bold text-gray-800">{{ getCourseName(courseId) }}</h3>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Centered Title -->
    <h2 class="text-5xl font-bold text-center mb-10">Optional Courses</h2>

    <!-- Grid Layout for Companies -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <Card v-for="courseId in track.optionalCourses" :key="courseId" class="track-card">
        <template #content>
          <div class="flex flex-col items-center">
            <div class="p-4 text-center">
              <!-- Track Name -->
              <h3 class="text-xl font-bold text-gray-800">{{ getCourseName(courseId) }}</h3>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>


<style scoped>
@import "tailwindcss";

.track-card {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.track-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.track-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
</style>


<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Card from 'primevue/card';

import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const track = ref({ companies: [], primaryCourses: [], optionalCourses: [] });

// Fetch Course Details
const fetchTrackDetails = async () => {
  try {
    console.log(route.params.id);
    const response = await axios.get(`http://localhost:5000/tracks/${route.params.id}`);
    track.value = response.data;
  } catch (error) {
    console.error("Error fetching track details:", error);
  }
};

const courseCache = ref({}); // Cache to store fetched course names
const companyCache = ref({}); // Cache to store fetched major names


const getCompanyNameById = async (companyId) => {
  if (!companyId) return "Unknown";

  // Check if the company is already in the cache
  if (companyCache.value[companyId]) {
    return companyCache.value[companyId];
  }

  try {
    // Fetch company details from API
    const response = await axios.get(`http://localhost:5000/companies/${companyId}`);
    const companyName = response.data.name;

    // Store result in cache
    companyCache.value[companyId] = companyName;
    return companyName;
  } catch (error) {
    console.error("Error fetching company:", error);
    return "Unknown";
  }
};

const getCourseNameById = async (courseId) => {
  if (!courseId) return "Unknown";

  // Check if the course is already in the cache
  if (courseCache.value[courseId]) {
    return courseCache.value[courseId];
  }

  try {
    // Fetch course details from API
    const response = await axios.get(`http://localhost:5000/courses/${courseId}`);
    const courseName = response.data.name;

    // Store result in cache
    courseCache.value[courseId] = courseName;
    return courseName;
  } catch (error) {
    console.error("Error fetching course:", error);
    return "Unknown";
  }
};

const getCompanyName = (companyId) => {
  if (!companyCache.value[companyId]) {
    getCompanyNameById(companyId); // Fetch name if not cached
    return "Loading..."; // Placeholder while fetching
  }
  return companyCache.value[companyId];
};

const getTrackName = (trackId) => {
  if (!trackCache.value[trackId]) {
    getTrackNameById(trackId); // Fetch name if not cached
    return "Loading..."; // Placeholder while fetching
  }
  return trackCache.value[trackId];
};

const getCourseName = (courseId) => {
  if (!courseCache.value[courseId]) {
    getCourseNameById(courseId); // Fetch name if not cached
    return "Loading..."; // Placeholder while fetching
  }
  return courseCache.value[courseId];
};

onMounted(fetchTrackDetails);
console.log("Made it here");

</script>