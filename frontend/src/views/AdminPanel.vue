<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import axios from 'axios';

import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Card from 'primevue/card'
import { TabMenu } from 'primevue';
import MultiSelect from 'primevue/multiselect';
import FileUpload from 'primevue/fileupload';
import CourseList from './CourseList.vue';

import { useImageFromMinio } from '@/composables/useImageFromMinio';

const { imageUrl, isLoading, error, loadImageUrl } = useImageFromMinio();


// const toast = useToast();

//Boo we hate global variables
const editable = ref(true);

const activeTab = ref('courses');
const tabs = ref([
  { label: 'Courses', command: () => (activeTab.value = 'courses') },
  { label: 'Tracks', command: () => (activeTab.value = 'tracks') },
  { label: 'Super Tracks', command: () => (activeTab.value = 'supertracks') },
]);

// Reactive state for courses
const coursesList = ref([]);
const selectedCourses = ref([]);
const course = ref({
  name: '',
  description: '',
  majors: [],
  tracks: [],
  skills: [],
  relatedCourses: [],
  offered: '',
  imageUrl: ''
});
const courseDialog = ref(false);
const courseSubmitted = ref(false);
const trackDialog = ref(false);
const trackSubmitted = ref(false);
const supertrackDialog = ref(false);
const supertrackSubmitted = ref(false);

// Lists from API
const tracksList = ref([]);
const supertracksList = ref([]);

const fetchData = async () => {
  try {
    const [tracksRes, supertracksRes] = await Promise.all([
      axios.get(`${import.meta.env.VITE_API_BASE_URI}/tracks`),
      axios.get(`${import.meta.env.VITE_API_BASE_URI}/supertracks`)
    ]);

    tracksList.value = tracksRes.data
    supertracksList.value = supertracksRes.data
  } catch (error) {
    console.error("Error fetching lists:", error);
  }
};


const getTrackNames = (trackIds) => {
  if (!trackIds || !Array.isArray(trackIds)) return "-";

  return trackIds
    .map(id => {
      const track = tracksList.value.find(i => i._id === id);
      return track ? track.name : "Unknown";
    })
    .join(", ");
};

const getCourseNames = (relatedCourseIds) => {
  if (!relatedCourseIds || !Array.isArray(relatedCourseIds)) return "-";

  return relatedCourseIds
    .map(id => {
      const relatedCourse = coursesList.value.find(i => i._id === id);
      return relatedCourse ? relatedCourse.name : "Unknown";
    })
    .join(", ");
};

// const tracks = ref([]);
const track = ref({ extension: "", name: "", description: "", imageUrl: "", imageKey: "", primaryCourses: [], optionalCourses: [] });
const supertrack = ref({ extension: "", name: "", description: "", imageUrl: "", imageKey: "", tracks: [] });

watch(() => supertrack.value.imageKey, (newKey) => {
  // supertrack.value.imageKey = newKey ? `supertrack_${Date.now()}` : "";
  fetchImageUrl(newKey);
});

watch(() => track.value.imageKey, (newKey) => {
  // supertrack.value.imageKey = newKey ? `supertrack_${Date.now()}` : "";
  fetchImageUrl(newKey);
});

const fetchTracks = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URI}/tracks`);
    tracksList.value = response.data;
  } catch (error) {
    console.error("Error fetching tracks:", error);
  }
};

const removeTrack = async (selected) => {
  try {
    if (editable.value) {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URI}/tracks/${selected._id}`); //remove for UI beta
    }
    fetchTracks();
  } catch (error) {
    console.error("Error deleting track:", error);
  }
};

const fetchSupertracks = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URI}/supertracks`);
    supertracksList.value = response.data;
  } catch (error) {
    console.error("Error fetching supertracks:", error);
  }
};

const removeSupertrack = async (selected) => {
  try {
    if (editable.value) {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URI}/supertracks/${selected._id}`); //remove for UI beta
    }
    fetchSupertracks();
  } catch (error) {
    console.error("Error deleting supertrack:", error);
  }
};


// Filters for DataTable search
const filters = reactive({
  global: { value: '' },
});

// Fetch courses from backend
const fetchCourses = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URI}/courses`);
    coursesList.value = response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

// Open new course dialog
const openNewCourseDialog = () => {
  course.value = {};
  courseSubmitted.value = false;
  courseDialog.value = true;
};

const openNewTrackDialog = () => {
  track.value = { extension: '', name: '', description: '', imageUrl: '', primaryCourses: [], optionalCourses: [] };
  trackSubmitted.value = false;
  trackDialog.value = true;
}

const openNewSupertrackDialog = () => {
  supertrack.value = { extension: '', name: '', description: '', imageUrl: '', tracks: [] };
  supertrackSubmitted.value = false;
  supertrackDialog.value = true;
};

// Save course (New or Edit)
const saveCourse = async () => {
  courseSubmitted.value = true;

  if (!course.value.name) return;

  try {
    const updatedCourse = { ...course.value };

    // Convert selected names into their corresponding _id values
    if (updatedCourse.relatedCourses) {
      updatedCourse.relatedCourses = updatedCourse.relatedCourses.map(name => {
        const relatedCourse = coursesList.value.find(m => m.name === name);
        return relatedCourse ? relatedCourse._id : name;
      });
    }
    if (updatedCourse.tracks) {
      updatedCourse.tracks = updatedCourse.tracks.map(name => {
        const track = tracksList.value.find(m => m.name === name);
        return track ? track._id : name;
      });
    }


    // FIXED: Check `updatedCourse.id`, not `updatedCourse.value.id`
    if (updatedCourse._id != null) {
      if (editable.value) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URI}/courses/${updatedCourse._id}`, updatedCourse); //remove for UI beta
      }
      // toast.add({ severity: 'success', summary: 'Success', detail: 'Course updated', life: 3000 });
    } else {
      // FIXED: Should use `updatedCourse`, not `updateCourse.value`
      if (editable.value) {
        await axios.post(`${import.meta.env.VITE_API_BASE_URI}/courses`, updatedCourse); //remove for ui beta
      }
      // toast.add({ severity: 'success', summary: 'Success', detail: 'Course added', life: 3000 });
    }

    courseDialog.value = false;
    fetchCourses(); // Refresh course list after saving
  } catch (error) {
    console.error("Error saving course:", error);
  }
};


// Edit course
const editCourse = (selected) => {
  course.value = { ...selected };

  if (course.value.relatedCourses) {
    course.value.relatedCourses = course.value.relatedCourses.map(id => {
      const relatedCourse = coursesList.value.find(o => o._id === id);
      return relatedCourse ? relatedCourse.name : id // fallback
    })
  }

  if (course.value.tracks) {
    course.value.tracks = course.value.tracks.map(id => {
      const track = tracksList.value.find(m => m._id === id);
      return track ? track.name : id //fallback to ID if not found
    })
  }

  courseDialog.value = true;
};

// Save course (New or Edit)
const saveTrack = async () => {
  trackSubmitted.value = true;

  if (!track.value.name) return;

  try {
    track.value.extension = formatNameToExtension(track.value.name); // Format title to name

    const updatedTrack = { ...track.value };


    // Convert selected names into their corresponding _id values
    if (updatedTrack.primaryCourses) {
      updatedTrack.primaryCourses = updatedTrack.primaryCourses.map(name => {
        const primaryCourse = coursesList.value.find(c => c.name === name);
        return primaryCourse ? primaryCourse._id : name; // Use _id if found, otherwise keep the name
      });
    }
    if (updatedTrack.optionalCourses) {
      updatedTrack.optionalCourses = updatedTrack.optionalCourses.map(name => {
        const optionalCourse = coursesList.value.find(c => c.name === name);
        return optionalCourse ? optionalCourse._id : name; // Use _id if found, otherwise keep the name
      });
    }



    // FIXED: Check `updatedCourse.id`, not `updatedCourse.value.id`
    if (updatedTrack._id != null) {
      if (editable.value) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URI}/tracks/${updatedTrack._id}`, updatedTrack); //remove for UI beta
      }
      // toast.add({ severity: 'success', summary: 'Success', detail: 'Course updated', life: 3000 });
    } else {
      // FIXED: Should use `updatedCourse`, not `updateCourse.value`
      if (editable.value) {
        await axios.post(`${import.meta.env.VITE_API_BASE_URI}/tracks`, updatedTrack); //remove for UI beta
      }
      // toast.add({ severity: 'success', summary: 'Success', detail: 'Course added', life: 3000 });
    }

    trackDialog.value = false;
    track.value = { extension: "", name: "", description: "", imageUrl: "", primaryCourses: [], optionalCourses: [], companies: [] };
    fetchTracks(); // Refresh course list after saving
  } catch (error) {
    console.error("Error saving course:", error);
  }
};

// Edit track
const editTrack = (selected) => {
  track.value = { ...selected };

  if (track.value.primaryCourses) {
    track.value.primaryCourses = track.value.primaryCourses.map(id => {
      const primaryCourse = coursesList.value.find(c => c._id === id);
      return primaryCourse ? primaryCourse.name : id //fallback to ID if not found
    })
  }

  if (track.value.optionalCourses) {
    track.value.optionalCourses = track.value.optionalCourses.map(id => {
      const optionalCourse = coursesList.value.find(c => c._id === id);
      return optionalCourse ? optionalCourse.name : id // fallback
    })
  }


  trackDialog.value = true;
};

// Save supertrack (New or Edit)
const saveSupertrack = async () => {
  supertrackSubmitted.value = true;

  if (!supertrack.value.name) return;
  console.log("Supertrack data:", supertrack.value);

  try {
    supertrack.value.extension = formatNameToExtension(supertrack.value.name); // Format title to name
    const updatedSupertrack = { ...supertrack.value };


    // Convert selected names into their corresponding _id values
    if (updatedSupertrack.tracks) {
      updatedSupertrack.tracks = updatedSupertrack.tracks.map(name => {
        const track = tracksList.value.find(c => c.name === name);
        return track ? track._id : name; // Use _id if found, otherwise keep the name
      });
    }



    // FIXED: Check `updatedCourse.id`, not `updatedCourse.value.id`
    if (updatedSupertrack._id != null) {
      if (editable.value) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URI}/supertracks/${updatedSupertrack._id}`, updatedSupertrack); //remove for UI beta
      }
      // toast.add({ severity: 'success', summary: 'Success', detail: 'Course updated', life: 3000 });
    } else {
      // FIXED: Should use `updatedCourse`, not `updateCourse.value`
      if (editable.value) {
        await axios.post(`${import.meta.env.VITE_API_BASE_URI}/supertracks`, updatedSupertrack); //remove for UI beta
      }
      // toast.add({ severity: 'success', summary: 'Success', detail: 'Course added', life: 3000 });
    }

    supertrackDialog.value = false;
    supertrack.value = { extension: "", name: "", description: "", imageUrl: "", imageKey: "", tracks: [] };
    fetchSupertracks(); // Refresh course list after saving
  } catch (error) {
    console.error("Error saving supertrack:", error);
  }
};

// Edit supertrack
const editSupertrack = (selected) => {
  supertrack.value = { ...selected };

  if (supertrack.value.tracks) {
    supertrack.value.tracks = supertrack.value.tracks.map(id => {
      const track = tracksList.value.find(c => c._id === id);
      return track ? track.name : id //fallback to ID if not found
    })
  }

  supertrackDialog.value = true;
};

// Delete confirmation
const confirmDeleteCourse = async (selected) => {
  try {
    if (editable.value) {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URI}/courses/${selected._id}`); //remove from ui beta
    }
    // toast.add({ severity: 'warn', summary: 'Deleted', detail: 'Course removed', life: 3000 });
    fetchCourses();
  } catch (error) {
    console.error("Error deleting course:", error);
  }
};

// Hide Dialog
const hideCourseDialog = () => {
  courseDialog.value = false;
};

const formatNameToExtension = (name) => {
  // Format the name into the extension format (lowercase and replace spaces with dashes)
  console.log("HERE");
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')  // Replace spaces with dashes
    .replace(/[^\w\-]+/g, '');  // Optional: remove non-alphanumeric characters
};

async function fetchImageUrl(imageKey) {
  if (!imageKey) {
    console.log("No image key provided");
    return "";
  }
  const res = await fetch(`http://localhost:3000/api/image-url/${imageKey}`);
  const data = await res.json();
  return data.url;
}

const onUploadSuccessSupertrack = ({ xhr }) => {
    const response = JSON.parse(xhr.response);
    console.log(xhr.response);
    // supertrack.value.imageUrl = response.imageUrl;
    supertrack.value.imageKey = response.imageKey;
    // loadImageUrl(response.imageKey);
    fetchImageUrl(response.imageKey)
      .then(url => {
        supertrack.value.imageUrl = url;
        console.log("Supertrack image URL:", supertrack.value.imageUrl);
      })
      .catch(err => {
        console.error("Error fetching supertrack image URL:", err);
      });
    console.log("Supertrack image URL:", supertrack.value.imageKey);
  }
const onUploadSuccessTrack = ({ xhr }) => {
    const response = JSON.parse(xhr.response);
    console.log(xhr.response);
    // supertrack.value.imageUrl = response.imageUrl;
    track.value.imageKey = response.imageKey;
    // loadImageUrl(response.imageKey);
    fetchImageUrl(response.imageKey)
      .then(url => {
        track.value.imageUrl = url;
        console.log("Track image URL:", track.value.imageUrl);
      })
      .catch(err => {
        console.error("Error fetching track image URL:", err);
      });
    console.log("Track image URL:", track.value.imageKey);
  }


// Fetch courses on load
onMounted(fetchData);
fetchCourses();
</script>


<template>
  <div>
    <!--Navbar-->
    <TabMenu class="px-4" :model="tabs" />

    <div v-if="activeTab === 'courses'">
      <div class="card">
        <Toolbar class="mb-6">
          <template #start>
            <Button label="New" icon="pi pi-plus" severity="secondary" class="mr-2" @click="openNewCourseDialog" />
            <!-- <Button label="Delete" icon="pi pi-trash" severity="secondary" @click="confirmDeleteSelected"
              :disabled="!selectedCourses || !selectedCourses.length" /> -->
          </template>

          <!-- <template #end>
            <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
          </template> -->
        </Toolbar>

        <DataTable class="px-4" ref="dt" v-model:selection="selectedCourses" :value="coursesList" dataKey="id"
          :paginator="true" :rows="10" :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} courses">
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h4 class="m-0">Manage Courses</h4>
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="filters.global.value" placeholder="Search..." />
              </IconField>
            </div>
          </template>

          <!-- <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column> -->
          <Column field="name" header="Course Name" sortable style="min-width: 16rem"></Column>
          <!-- <Column field="relatedCourses" header="Related Courses" sortable style="min-width: 16rem">
            <template #body="slotProps">
              <span v-if="slotProps.data.relatedCourses && slotProps.data.relatedCourses.length">
                {{ getCourseNames(slotProps.data.relatedCourses) }}
              </span>
              <span v-else>-</span>
            </template>
          </Column> -->
          <!-- <Column field="tracks" header="Tracks" sortable style="min-width: 16rem">
            <template #body="slotProps">
              <span v-if="slotProps.data.tracks && slotProps.data.tracks.length">
                {{ getTrackNames(slotProps.data.tracks) }}
              </span>
              <span v-else>-</span>
            </template>
          </Column> -->
          <Column :exportable="false" style="min-width: 12rem">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editCourse(slotProps.data)" />
              <Button icon="pi pi-trash" outlined rounded severity="danger"
                @click="confirmDeleteCourse(slotProps.data)" />
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Tracks Tab -->
    <div v-if="activeTab === 'tracks'" class="p-4">
      <Card class="mb-4 shadow-md">
        <template #content>
          <h4 class="mb-3">Add a New Track</h4>
          <div class="flex flex-col md:flex-row gap-3 items-center w-full">
            <Button label="Add New Track" icon="pi pi-plus" class="p-button-primary" @click="openNewTrackDialog" />
          </div>
        </template>
      </Card>

      <DataTable :value="tracksList" class="p-datatable-striped">
        <Column field="name" header="Track Name"></Column>
        <Column field="extension" header="Track Extension (For URLs)"></Column>
        <Column field="description" header="Description" style="min-width: 500px; flex-grow: 2;"></Column>
        <Column field="primaryCourses" header="Primary Courses" sortable style="min-width: 12rem; flex-grow: 1;">
          <template #body="slotProps">
            <span v-if="slotProps.data.primaryCourses && slotProps.data.primaryCourses.length">
              {{ getCourseNames(slotProps.data.primaryCourses) }}
            </span>
            <span v-else>-</span>
          </template>
        </Column>
        <Column field="optionalCourses" header="Optional Courses" sortable style="min-width: 12rem; flex-grow: 1;">
          <template #body="slotProps">
            <span v-if="slotProps.data.optionalCourses && slotProps.data.optionalCourses.length">
              {{ getCourseNames(slotProps.data.optionalCourses) }}
            </span>
            <span v-else>-</span>
          </template>
        </Column>
        <Column header="Actions">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editTrack(slotProps.data)" />
            <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="removeTrack(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <div v-if="activeTab === 'supertracks'" class="p-4">
      <Card class="mb-4 shadow-md">
        <template #content>
          <h4 class="mb-3">Add a New Super Track</h4>
          <div class="flex flex-col md:flex-row gap-3 items-center w-full">
            <Button label="Add New Super Track" icon="pi pi-plus" class="p-button-primary"
              @click="openNewSupertrackDialog" />
          </div>
        </template>
      </Card>

      <DataTable :value="supertracksList" class="p-datatable-striped">
        <Column field="name" header="Super Track Name"></Column>
        <Column field="extension" header="Super Track Extension (for URLs)"></Column>
        <Column field="description" header="Description" style="min-width: 500px; flex-grow: 2;"></Column>
        <Column field="tracks" header="Tracks" sortable style="min-width: 12rem; flex-grow: 1;">
          <template #body="slotProps">
            <span v-if="slotProps.data.tracks && slotProps.data.tracks.length">
              {{ getTrackNames(slotProps.data.tracks) }}
            </span>
            <span v-else>-</span>
          </template>
        </Column>
        <Column header="Actions">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editSupertrack(slotProps.data)" />
            <Button icon="pi pi-trash" class="p-button-danger p-button-sm" @click="removeSupertrack(slotProps.data)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="courseDialog" :style="{ width: '800px' }" header="Course Details" :modal="true">
      <div class="flex flex-col gap-6 p-4">

        <!-- Course Name -->
        <Card class="p-4">
          <template #title>Course Name</template>
          <template #content>
            <InputText id="name" v-model.trim="course.name" required autofocus
              :invalid="courseSubmitted && !course.name" class="w-full p-2" />
            <small v-if="courseSubmitted && !course.name" class="text-red-500">Name is required.</small>
          </template>
        </Card>
        <br>
      </div>
      <br>
      <!-- Footer -->
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideCourseDialog" />
        <Button label="Save" icon="pi pi-check" class="p-button-success" @click="saveCourse" />
      </template>
    </Dialog>

    <Dialog v-model:visible="trackDialog" :style="{ width: '800px' }" header="Add New Track" :modal="true">
      <div class="flex flex-col gap-6 p-4">

        <!-- Track Name -->
        <Card class="p-4">
          <template #title>Track Name</template>
          <template #content>
            <InputText id="name" v-model.trim="track.name" required autofocus
              :invalid="trackSubmitted && !track.name" class="w-full p-2" />
            <small v-if="trackSubmitted && !track.name" class="text-red-500">Name is required.</small>
          </template>
        </Card>
        <br>
        <Card hidden class="p-4">
          <template #title>Track Extension</template>
          <template #content>
            <InputText id="extension" v-model.trim="track.extension" required readonly class="w-full p-2" />
            <small v-if="trackSubmitted && !track.extension" class="text-red-500">Extension is required.</small>
          </template>
        </Card>
        <br>

        <!-- Description -->
        <Card class="p-4">
          <template #title>Description</template>
          <template #content>
            <Textarea id="description" v-model="track.description" required rows="4" class="w-full p-2" />
          </template>
        </Card>
        <br>

        <Card class="p-4">
          <template #title>Primary Courses</template>
          <template #content>
            <MultiSelect id="primaryCourses" v-model="track.primaryCourses" :options="coursesList.map(c => c.name)"
              filter placeholder="Select Primary Courses" class="w-full p-2" />
          </template>
        </Card>

        <Card class="p-4">
          <template #title>Optional Courses</template>
          <template #content>
            <MultiSelect id="optionalCourses" v-model="track.optionalCourses" :options="coursesList.map(c => c.name)"
              filter placeholder="Select Optional Courses" class="w-full p-2" />
          </template>
        </Card>

        <Card class="p-4">
          <template #title>Upload Image</template>
          <template #content>
            <FileUpload mode="basic" name="file" url="http://localhost:3000/api/upload" accept="image/*" auto
              chooseLabel="Upload Image" @upload="onUploadSuccessTrack" />
            <div v-if="track.imageUrl" class="mt-4">
              <img :src="track.imageUrl" alt="Uploaded Image" class="max-w-full rounded" />
            </div>
          </template>
        </Card>

        <!-- Save & Cancel Buttons -->
        <div class="flex justify-end gap-3">
          <Button label="Cancel" class="p-button-text" @click="trackDialog = false" />
          <Button label="Save Track" icon="pi pi-check" class="p-button-success" @click="saveTrack"
            :disabled="!track.name.trim()" />
        </div>
      </div>
    </Dialog>

    <Dialog v-model:visible="supertrackDialog" :style="{ width: '800px' }" header="Add New Supertrack" :modal="true">
      <div class="flex flex-col gap-6 p-4">

        <!-- Track Name -->
        <Card class="p-4">
          <template #title>Supertrack Name</template>
          <template #content>
            <InputText id="name" v-model.trim="supertrack.name" required autofocus
              :invalid="supertrackSubmitted && !supertrack.name" class="w-full p-2" />
            <small v-if="supertrackSubmitted && !supertrack.name" class="text-red-500">Name is required.</small>
          </template>
        </Card>
        <br>
        <Card hidden class="p-4">
          <template #title>Supertrack Extension</template>
          <template #content>
            <InputText id="extension" v-model.trim="supertrack.extension" required readonly class="w-full p-2" />
            <small v-if="supertrackSubmitted && !supertrack.extension" class="text-red-500">Extension is required.</small>
          </template>
        </Card>
        <br>


        <!-- Description -->
        <Card class="p-4">
          <template #title>Description</template>
          <template #content>
            <Textarea id="description" v-model="supertrack.description" required rows="4" class="w-full p-2" />
          </template>
        </Card>
        <br>

        <Card class="p-4">
          <template #title>Subtracks</template>
          <template #content>
            <MultiSelect id="tracks" v-model="supertrack.tracks" :options="tracksList.map(c => c.name)" filter
              placeholder="Select subtracks" class="w-full p-2" />
          </template>
        </Card>


        <!-- Image URL -->
        <!-- <Card class="p-4">
          <template #title>Image URL</template>
          <template #content>
            <InputText id="imageUrl" v-model="supertrack.imageUrl" class="w-full p-2" />
          </template>
        </Card>
        <br> -->

        <!-- Image Preview -->
        <!-- <div v-if="supertrack.imageUrl" class="flex justify-center">
          <img :src="supertrack.imageUrl" :alt="supertrack.name" class="rounded-md shadow-md w-48" />
        </div>
        <br> -->

        <Card class="p-4">
          <template #title>Upload Image</template>
          <template #content>
            <FileUpload mode="basic" name="file" url="http://localhost:3000/api/upload" accept="image/*" auto
              chooseLabel="Upload Image" @upload="onUploadSuccessSupertrack" />
            <div v-if="supertrack.imageUrl" class="mt-4">
              <img :src="supertrack.imageUrl" alt="Uploaded Image" class="max-w-full rounded" />
            </div>
          </template>
        </Card>


        <!-- Save & Cancel Buttons -->
        <div class="flex justify-end gap-3">
          <Button label="Cancel" class="p-button-text" @click="supertrackDialog = false" />
          <Button label="Save Supertrack" icon="pi pi-check" class="p-button-success" @click="saveSupertrack"
            :disabled="!supertrack.name.trim()" />
        </div>
      </div>
    </Dialog>

  </div>
</template>

<style scoped>
.p-multiselect {
  max-width: 100%;
  /* Ensures it doesn’t overflow */
}

.p-multiselect .p-multiselect-label {
  white-space: normal !important;
  /* Allows text to wrap */
  display: flex;
  flex-wrap: wrap;
  /* Enables wrapping */
  min-height: 2.5rem;
  /* Adjust height as needed */
  max-height: 300px;
  /* Set a max height */
  overflow-y: auto;
  /* Allows vertical scrolling if needed */
}
</style>