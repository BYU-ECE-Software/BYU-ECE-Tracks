<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-12 py-8">
    <h1 class="text-5xl font-bold text-center mb-10 py-12">{{ supertrackTitle }}</h1>

    <h3 class="text-2xl font-semibold text-center mb-6">{{ supertrackDescription }}</h3><br></br>

    <!-- Grid Layout for Tracks -->
    <div class="place-items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <Card v-for="track in tracksWithUrls" :key="track._id" class="track-card w-full h-full cursor-pointer transition hover:shadow-lg" @click="viewTrack(track)">
        <template #content>
          <div class="flex flex-col items-center">
            <img v-if="track.imageUrl" :src="track.imageUrl" :alt="track.name" class="track-image max-h-96 object-cover rounded" />
            <div class="p-4 text-center">
              <h3 class="text-xl font-bold py-1">{{ track.name }}</h3>
              <p class="text-sm mt-2">{{ track.description }}</p>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Card from "primevue/card";
import { useImageFromMinio } from "@/composables/useImageFromMinio";

const route = useRoute();
const router = useRouter();

const supertrackTitle = ref("");
const supertrackDescription = ref("");
const tracksWithUrls = ref([]);

const fetchSupertrackAndTracks = async () => {
  try {
    const supertrackExtension = route.params.supertrack;

    // Fetch the supertrack by name
    const { data: supertrack } = await axios.get(`${import.meta.env.VITE_API_BASE_URI}/supertracks/name/${supertrackExtension}`);
    console.log(supertrack);
    supertrackTitle.value = supertrack.name;
    supertrackDescription.value = supertrack.description;

    // Fetch full track data by ID
    const { data: allTracks } = await axios.get(`${import.meta.env.VITE_API_BASE_URI}/tracks`);
    const relatedTracks = allTracks.filter((track) => supertrack.tracks.includes(track._id));

    // Load images
    const resolved = await Promise.all(
      relatedTracks.map(async (track) => {
        const { imageUrl, loadImageUrl } = useImageFromMinio();
        await loadImageUrl(track.imageKey);
        return {
          ...track,
          imageUrl: imageUrl.value,
        };
      })
    );

    tracksWithUrls.value = resolved;
  } catch (error) {
    console.error("Failed to load supertrack and tracks", error);
  }
};

const viewTrack = (track) => {
  console.log(track);
  const routeUrl = router.resolve({
    name: 'TrackDetail',
    params: { track: track.extension },
  })
  console.log(routeUrl);
  window.open(routeUrl.href, '_blank')
};

onMounted(fetchSupertrackAndTracks);
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