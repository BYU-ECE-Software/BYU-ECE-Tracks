<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-12 py-8">
    <!-- Track Title -->
    <h1 class="text-5xl font-bold text-center mb-6 py-12">{{ track.name }}</h1>

    <!-- Track Image -->
    <div class="flex justify-center mb-6">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="track.name"
        class="rounded shadow-md object-cover max-h-96"
      />
    </div>
    <br>

    <!-- Track Description -->
    <h3 class="text-2xl font-semibold text-center mb-6">
      {{ track.description }}
    </h3>
    <br>

    <!-- Primary Courses -->
    <!-- <h2 class="text-4xl font-bold text-center mb-6">Primary Courses</h2>
    <div class="place-items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <Card v-for="courseId in track.primaryCourses" :key="courseId" class="track-card w-full h-full cursor-pointer transition hover:shadow-lg">
        <template #content>
          <div class="flex flex-col items-center text-center">
            <h3 class="text-xl font-bold">{{ getCourseName(courseId) }}</h3>
          </div>
        </template>
      </Card>
    </div> -->

    <br>

    <!-- Optional Courses -->
    <!-- <h2 class="text-4xl font-bold text-center mb-6">Optional Courses</h2>
    <div class="place-items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <Card v-for="courseId in track.optionalCourses" :key="courseId" class="track-card w-full h-full cursor-pointer transition hover:shadow-lg">
        <template #content>
          <div class="flex flex-col items-center text-center">
            <h3 class="text-xl font-bold">{{ getCourseName(courseId) }}</h3>
          </div>
        </template>
      </Card>
    </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Card from 'primevue/card';
import { useRoute } from 'vue-router';
// import { useImageFromMinio } from '@/composables/useImageFromMinio';

const route = useRoute();
const track = ref({
  name: '',
  description: '',
  imageKey: '',
  primaryCourses: [],
  optionalCourses: [],
});

const courseCache = ref({});
// const { loadImageUrl, imageUrl } = useImageFromMinio();

console.log(route.params);

// const fetchTrackDetails = async () => {
//   try {
//     const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URI}/tracks/name/${route.params.track}`);
//     track.value = data;

//     // Load track image from MinIO
//     if (data.imageKey) {
//       await loadImageUrl(data.imageKey);
//       // imageUrl.value = url;
//     }
//   } catch (error) {
//     console.error('Error fetching track details:', error);
//   }
// };

const fetchTrackDetails = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_BASE_URI}/tracks/name/${route.params.track}`
    )

    // Normalize: ensure we always have an `imageUrl` field
    track.value = {
      ...data,
      imageUrl: data.imageUrl || data.image || data.url || data.image_path || ''
    }

  } catch (error) {
    console.error('Error fetching track details:', error)
  }
}


const getCourseName = (courseId) => {
  if (!courseId) return 'Unknown';

  // Return cached name if available
  if (courseCache.value[courseId]) return courseCache.value[courseId];

  // Start async fetch if not in cache
  getCourseNameById(courseId);
  return 'Loading...';
};

const getCourseNameById = async (courseId) => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URI}/courses/${courseId}`);
    courseCache.value[courseId] = data.name;
  } catch (error) {
    console.error('Error fetching course name:', error);
    courseCache.value[courseId] = 'Unknown';
  }
};

onMounted(fetchTrackDetails);
</script>



<style scoped>
@import "tailwindcss";

.track-card {
  width: 100%;
  max-width: 450px;
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


