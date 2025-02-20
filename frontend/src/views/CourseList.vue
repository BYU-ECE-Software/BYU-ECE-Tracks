<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
  <div class="course-container p-6">
    <!-- Page Header -->
    <div class="text-center mb-10">
      <h2 class="text-4xl font-bold">ECEn/ITC Course Catalog</h2>
      <span class="text-lg text-gray-600">Explore courses that match your tracks and career goals.</span>
    </div>

    <!-- Filters Section -->
    <div class="row mb-4 flex flex-col items-center space-y-4 md:flex-row md:justify-center md:space-x-4 md:space-y-0 mb-8">
      <InputText v-model="searchQuery" placeholder="Search courses..." class="p-inputtext-lg w-64" />
      <Select v-model="selectedMajor" :options="majors" optionLabel="name" optionValue="_id"
        placeholder="Filter by Major" class="p-dropdown w-64" />
      <Select v-model="selectedCompany" :options="companies" optionLabel="name" optionValue="_id"
        placeholder="Filter by Company" class="p-dropdown w-64" />
      <Select v-model="selectedTrack" :options="tracks" optionLabel="name" optionValue="_id"
        placeholder="Filter by Track" class="p-dropdown w-64" />
      <Button label="Reset" icon="pi pi-refresh" class="p-button-danger w-32" @click="resetFilters" />
    </div>

    <!-- Course Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
      <Card v-for="course in paginatedCourses" :key="course._id" class="course-card" @click="viewCourse(course)">
        <template #content>
          <div class="flex flex-col items-center">
            <img v-if="course.imageUrl" :src="course.imageUrl" :alt="course.name" class="course-image" />
            <div class="p-4 text-center">
              <h3 class="text-xl font-bold text-gray-800">{{ course.name }}</h3>
              <p class="text-sm text-gray-600 mt-2">{{ course.description }}</p>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Pagination -->
    <Paginator :rows="rowsPerPage" :totalRecords="filteredCourses.length" @page="onPageChange" class="mt-8" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Select from "primevue/select";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Card from "primevue/card";
import Paginator from "primevue/paginator";

const courses = ref([]);
const majors = ref([]);
const companies = ref([]);
const tracks = ref([]);
const searchQuery = ref("");
const selectedMajor = ref(null);
const selectedCompany = ref(null);
const selectedTrack = ref(null);

const router = useRouter();
const rowsPerPage = ref(6);
const currentPage = ref(0);

const fetchCourses = async () => {
  try {
    const [coursesRes, majorsRes, companiesRes, tracksRes] = await Promise.all([
      axios.get("http://localhost:5000/courses"),
      axios.get("http://localhost:5000/majors"),
      axios.get("http://localhost:5000/companies"),
      axios.get("http://localhost:5000/tracks"),
    ]);

    courses.value = coursesRes.data;
    majors.value = majorsRes.data;
    companies.value = companiesRes.data;
    tracks.value = tracksRes.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const filteredCourses = computed(() => {
  return courses.value.filter((course) => {
    return (
      course.name.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
      (!selectedMajor.value || course.majors.includes(selectedMajor.value)) &&
      (!selectedCompany.value || course.companies.includes(selectedCompany.value)) &&
      (!selectedTrack.value || course.tracks.includes(selectedTrack.value))
    );
  });
});

const paginatedCourses = computed(() => {
  const start = currentPage.value * rowsPerPage.value;
  return filteredCourses.value.slice(start, start + rowsPerPage.value);
});

const resetFilters = () => {
  searchQuery.value = "";
  selectedMajor.value = null;
  selectedCompany.value = null;
  selectedTrack.value = null;
};

const onPageChange = (event) => {
  currentPage.value = event.page;
};

const viewCourse = (course) => {
  const routeUrl = router.resolve({ name: "CourseDetail", params: { id: course._id } });
  window.open(routeUrl.href, "_blank");
};

onMounted(fetchCourses);
</script>

<style scoped>
.course-card {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.course-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.course-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
</style>