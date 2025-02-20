<template>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
    <div class="p-8 max-w-7xl mx-auto">
        <!-- Centered Title -->
        <h1 class="text-5xl font-bold text-center mb-10">Tracks</h1>

        <!-- Filters Section -->
    <div class="row mb-4 flex flex-col items-center space-y-4 md:flex-row md:justify-center md:space-x-4 md:space-y-0 mb-8">
      <InputText v-model="searchQuery" placeholder="Search courses..." class="p-inputtext-lg w-64" />
      <Select v-model="selectedFavoriteCourse" :options="courses" optionLabel="name" optionValue="_id"
        placeholder="Filter by Favorite Course" class="p-dropdown w-64" />
      <Select v-model="selectedCompany" :options="companies" optionLabel="name" optionValue="_id"
        placeholder="Filter by Company" class="p-dropdown w-64" />
      <Button label="Reset" icon="pi pi-refresh" class="p-button-danger w-32" @click="resetFilters" />
    </div>

        <!-- Grid Layout for Tracks -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Card v-for="track in paginatedTracks" :key="track._id" class="track-card" @click="viewTrack(track)">
                <template #content>
                    <div class="flex flex-col items-center">
                        <!-- Track Image -->
                        <img v-if="track.imageUrl" :src="track.imageUrl" :alt="track.name" class="track-image" />
                        <div class="p-4 text-center">
                            <!-- Track Name -->
                            <h3 class="text-xl font-bold text-gray-800">{{ track.name }}</h3>
                            <!-- Track Description -->
                            <p class="text-sm text-gray-600 mt-2">{{ track.description }}</p>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
        <!-- Pagination -->
    <Paginator :rows="rowsPerPage" :totalRecords="filteredTracks.length" @page="onPageChange" class="mt-8" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import Card from 'primevue/card';
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Paginator from "primevue/paginator";
import Select from "primevue/select"
import {Button} from "primevue";

const router = useRouter();
const courses = ref([]);
const companies = ref([]);
const tracks = ref([]);
const searchQuery = ref("");
const selectedFavoriteCourse = ref(null);
const selectedCompany = ref(null);

const rowsPerPage = ref(12);
const currentPage = ref(0);

const fetchTracks = async () => {
  try {
    const [coursesRes, companiesRes, tracksRes] = await Promise.all([
      axios.get("http://localhost:5000/courses"),
      axios.get("http://localhost:5000/companies"),
      axios.get("http://localhost:5000/tracks"),
    ]);

    courses.value = coursesRes.data;
    companies.value = companiesRes.data;
    tracks.value = tracksRes.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const filteredTracks = computed(() => {
  return tracks.value.filter((track) => {
    return (
      track.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      (!selectedFavoriteCourse.value || track.primaryCourse.includes(selectedFavoriteCourse.value) || track.optionalCourse.includes(selectedFavoriteCourse.value)) &&
      (!selectedCompany.value || track.companies.includes(selectedCompany.value))
    );
  });
});

const paginatedTracks = computed(() => {
  const start = currentPage.value * rowsPerPage.value;
  return filteredTracks.value.slice(start, start + rowsPerPage.value);
});

const resetFilters = () => {
  searchQuery.value = "";
  selectedFavoriteCourse.value = null;
  selectedCompany.value = null;
};

const onPageChange = (event) => {
  currentPage.value = event.page;
};


const viewTrack = (track) => {
  const routeUrl = router.resolve({ name: "TracksDetail", params: { id: track._id } });
  window.open(routeUrl.href, "_blank");
};

onMounted(fetchTracks);
</script>

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