<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-12 py-8">
    <h1 class="text-5xl font-bold text-center mb-10 py-12">Tracks</h1>

    <!-- Grid Layout for Supertracks -->
    <div class="place-items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <Card v-for="supertrack in supertracks" :key="supertrack._id" class="supertrack-card w-full h-full cursor-pointer transition hover:shadow-lg" @click="viewSupertrack(supertrack)">
        <template #content>
          <div class="flex flex-col items-center">
            <img
              v-if="supertrack.imageUrl"
              :src="supertrack.imageUrl"
              :alt="supertrack.name"
              class="supertrack-image max-h-96 object-cover rounded"
            />
            <div class="p-4 text-center">
              <h3 class="text-xl font-bold py-1">{{ supertrack.name }}</h3>
              <p class="text-sm mt-2">{{ supertrack.description }}</p>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Card from 'primevue/card'
import { useRouter } from 'vue-router'
// import { useImageFromMinio } from '@/composables/useImageFromMinio'

const router = useRouter()
const supertracks = ref([])
// const supertracksWithUrls = ref([])

const fetchSupertracks = async () => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URI}/supertracks`)

    // If your DB field is named differently, we normalize it here.
    // Adjust the fallback chain as needed (e.g., t.image_path).
    supertracks.value = (Array.isArray(data) ? data : []).map(t => ({
      ...t,
      imageUrl: t.imageUrl || t.image || t.url || ''
    }))
  } catch (error) {
    console.error('Error fetching supertracks:', error)
  }
}

const viewSupertrack = (supertrack) => {
  const routeUrl = router.resolve({
    name: 'Supertrack',
    params: { supertrack: supertrack.extension },
  })
  window.open(routeUrl.href, '_blank')
}

onMounted(fetchSupertracks)
</script>

<style scoped>
@import "tailwindcss";

.supertrack-card {
  width: 100%;
  max-width: 450px;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.supertrack-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.supertrack-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

:deep(.p-paginator){
  border-radius: 8px;
  padding: 20px;
}

/* Style the buttons */
:deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  background-color: white;
  color: var(--byu-royal); /* Your theme blue */
  border-radius: 6px;
  margin: 0 3px;
  transition: all 0.2s ease-in-out;
}

/* Hover effect */
:deep(.p-paginator .p-paginator-pages .p-paginator-page:hover) {
  background-color: var(--byu-medgray); /* Light blue */
}

/* Next & Previous buttons */
:deep(.p-paginator .p-paginator-next, .p-paginator .p-paginator-prev) {
  color: var(--byu-royal);
  font-size: 1.2rem;
}

:deep(.p-paginator .p-paginator-next:hover, .p-paginator .p-paginator-prev:hover) {
  color: var(--byu-medgray);
}

/* Disabled buttons */
:deep(.p-paginator .p-disabled) {
  opacity: 0.5;
}

</style>