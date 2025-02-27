<script setup>
import { ref, reactive, onMounted } from 'vue';
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
import CourseList from './CourseList.vue';


// const toast = useToast();

//Boo we hate global variables
const editable = false;

const activeTab = ref('courses');
const tabs = ref([
  { label: 'Courses', command: () => (activeTab.value = 'courses') },
  { label: 'Majors', command: () => (activeTab.value = 'majors') },
  { label: 'Skills', command: () => (activeTab.value = 'skills') },
  { label: 'Tracks', command: () => (activeTab.value = 'tracks') },
  { label: 'Companies', command: () => (activeTab.value = 'companies') }
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

// Lists from API
const majorsList = ref([]);
const tracksList = ref([]);
const skillsList = ref([]);
const companiesList = ref([]);

const fetchData = async () => {
  try {
    const [majorsRes, tracksRes, skillsRes, companiesRes] = await Promise.all([
      axios.get('http://localhost:5000/majors'),
      axios.get('http://localhost:5000/tracks'),
      axios.get('http://localhost:5000/skills'),
      axios.get('http://localhost:5000/companies')
    ]);

    majorsList.value = majorsRes.data
    tracksList.value = tracksRes.data
    skillsList.value = skillsRes.data
    companiesList.value = companiesRes.data
  } catch (error) {
    console.error("Error fetching lists:", error);
  }
};


const getMajorNames = (majorIds) => {
  if (!majorIds || !Array.isArray(majorIds)) return "-";

  return majorIds
    .map(id => {
      const major = majorsList.value.find(m => m._id === id);
      return major ? major.name : "Unknown";
    })
    .join(", ");
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

const getSkillNames = (skillIds) => {
  if (!skillIds || !Array.isArray(skillIds)) return "-";

  return skillIds
    .map(id => {
      const skill = skillsList.value.find(i => i._id === id);
      return skill ? skill.name : "Unknown";
    })
    .join(", ");
};

const getCompanyNames = (companyIds) => {
  if (!companyIds || !Array.isArray(companyIds)) return "-";

  return companyIds
    .map(id => {
      const company = companiesList.value.find(i => i._id === id);
      return company ? company.name : "Unknown";
    })
    .join(", ");
};

// const majors = ref([]);
const newMajor = ref('');

const fetchMajors = async () => {
  try {
    const response = await axios.get('http://localhost:5000/majors');
    majorsList.value = response.data
  } catch (error) {
    console.error("Error fetching majors:", error);
  }
};

const addMajor = async () => {
  if (!newMajor.value.trim()) return;

  try {
    if (editable) {
      await axios.post('http://localhost:5000/majors', { name: newMajor.value }); //remove for UI beta
    }
    fetchMajors();
    newMajor.value = ''; // Clear input
  } catch (error) {
    console.error("Error adding major:", error);
  }
};

const removeMajor = async (id) => {
  try {
    if (editable) {
      await axios.delete(`http://localhost:5000/majors/${id}`); //remove for ui beta
    }
    fetchMajors();
  } catch (error) {
    console.error("Error deleting major:", error);
  }
};

const newSkill = ref('');

const fetchSkills = async () => {
  try {
    const response = await axios.get('http://localhost:5000/skills');
    skillsList.value = response.data
  } catch (error) {
    console.error("Error fetching skills:", error);
  }
};

const addSkill = async () => {
  if (!newSkill.value.trim()) return;

  try {
    if (editable) {
      await axios.post('http://localhost:5000/skills', { name: newSkill.value }); //remove for UI beta
    }
    fetchSkills();
    newSkill.value = ''; // Clear input
  } catch (error) {
    console.error("Error adding skill:", error);
  }
};

const removeSkill = async (id) => {
  console.log("Deleting skill with ID: ", id)
  try {
    if (editable) {
      const response = await axios.delete(`http://localhost:5000/skills/${id}`); //remove for ui beta
    }
    // if (response.status == 200) {
    fetchSkills();
    //}
  } catch (error) {
    console.error("Error deleting skill:", error);
  }
};

const newCompany = ref('');

const fetchCompanies = async () => {
  try {
    const response = await axios.get('http://localhost:5000/companies');
    companiesList.value = response.data
  } catch (error) {
    console.error("Error fetching companies:", error);
  }
};

const addCompany = async () => {
  if (!newCompany.value.trim()) return;

  try {
    if (editable) {
      await axios.post('http://localhost:5000/companies', { name: newCompany.value }); //Removed for beta UI test
    }
    fetchCompanies();
    newCompany.value = ''; // Clear input
  } catch (error) {
    console.error("Error adding company:", error);
  }
};

const removeCompany = async (id) => {
  try {
    if (editable) {
      await axios.delete(`http://localhost:5000/companies/${id}`); //remove from ui beta test
    }
    fetchCompanies();
  } catch (error) {
    console.error("Error deleting company:", error);
  }
};

// const tracks = ref([]);
const track = ref({ name: "", description: "", imageUrl: "", primaryCourses: [], optionalCourses: [], companies: [] });


const fetchTracks = async () => {
  try {
    const response = await axios.get("http://localhost:5000/tracks");
    tracksList.value = response.data;
  } catch (error) {
    console.error("Error fetching tracks:", error);
  }
};

const removeTrack = async (selected) => {
  try {
    if (editable) {
      await axios.delete(`http://localhost:5000/tracks/${selected._id}`); //remove for UI beta
    }
    fetchTracks();
  } catch (error) {
    console.error("Error deleting track:", error);
  }
};


// Filters for DataTable search
const filters = reactive({
  global: { value: '' },
});

// Fetch courses from backend
const fetchCourses = async () => {
  try {
    const response = await axios.get("http://localhost:5000/courses");
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
  track.value = { name: '', description: '', imageUrl: '' };
  trackSubmitted.value = false;
  trackDialog.value = true;
}

// Save course (New or Edit)
const saveCourse = async () => {
  courseSubmitted.value = true;

  if (!course.value.name) return;

  try {
    const updatedCourse = { ...course.value };

    // Convert selected names into their corresponding _id values
    if (updatedCourse.majors) {
      updatedCourse.majors = updatedCourse.majors.map(name => {
        const major = majorsList.value.find(m => m.name === name);
        return major ? major._id : name; // Use _id if found, otherwise keep the name
      });
    }
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
    if (updatedCourse.skills) {
      updatedCourse.skills = updatedCourse.skills.map(name => {
        const skill = skillsList.value.find(m => m.name === name);
        return skill ? skill._id : name;
      });
    }
    if (updatedCourse.companies) {
      updatedCourse.companies = updatedCourse.companies.map(name => {
        const companies = companiesList.value.find(m => m.name === name);
        return companies ? companies._id : name;
      });
    }


    // FIXED: Check `updatedCourse.id`, not `updatedCourse.value.id`
    if (updatedCourse._id != null) {
      if (editable) {
        await axios.put(`http://localhost:5000/courses/${updatedCourse._id}`, updatedCourse); //remove for UI beta
      }
      // toast.add({ severity: 'success', summary: 'Success', detail: 'Course updated', life: 3000 });
    } else {
      // FIXED: Should use `updatedCourse`, not `updateCourse.value`
      if (editable) {
        await axios.post("http://localhost:5000/courses", updatedCourse); //remove for ui beta
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

  if (course.value.majors) {
    course.value.majors = course.value.majors.map(id => {
      const major = majorsList.value.find(m => m._id === id);
      return major ? major.name : id //fallback to ID if not found
    })
  }

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

  if (course.value.skills) {
    course.value.skills = course.value.skills.map(id => {
      const skill = skillsList.value.find(m => m._id === id);
      return skill ? skill.name : id //fallback to ID if not found
    })
  }

  if (course.value.companies) {
    course.value.companies = course.value.companies.map(id => {
      const company = companiesList.value.find(m => m._id === id);
      return company ? company.name : id //fallback to ID if not found
    })
  }

  courseDialog.value = true;
};

// Save course (New or Edit)
const saveTrack = async () => {
  trackSubmitted.value = true;

  if (!track.value.name) return;

  try {
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
    if (updatedTrack.companies) {
      updatedTrack.companies = updatedTrack.companies.map(name => {
        const companies = companiesList.value.find(c => c.name === name);
        return companies ? companies._id : name;
      });
    }



    // FIXED: Check `updatedCourse.id`, not `updatedCourse.value.id`
    if (updatedTrack._id != null) {
      if (editable) {
        await axios.put(`http://localhost:5000/tracks/${updatedTrack._id}`, updatedTrack); //remove for UI beta
      }
      // toast.add({ severity: 'success', summary: 'Success', detail: 'Course updated', life: 3000 });
    } else {
      // FIXED: Should use `updatedCourse`, not `updateCourse.value`
      if (editable) {
        await axios.post("http://localhost:5000/tracks", updatedTrack); //remove for UI beta
      }
      // toast.add({ severity: 'success', summary: 'Success', detail: 'Course added', life: 3000 });
    }

    trackDialog.value = false;
    track.value = { name: "", description: "", imageUrl: "", primaryCourses: [], optionalCourses: [], companies: [] };
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

  if (track.value.companies) {
    track.value.companies = track.value.companies.map(id => {
      const company = companiesList.value.find(c => c._id === id);
      return company ? company.name : id //fallback to ID if not found
    })
  }

  trackDialog.value = true;
};

// Delete confirmation
const confirmDeleteCourse = async (selected) => {
  try {
    if (editable) {
      await axios.delete(`http://localhost:5000/courses/${selected._id}`); //remove from ui beta
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
          <Column field="majors" header="Majors" sortable style="min-width: 16rem">
            <template #body="slotProps">
              <span v-if="slotProps.data.majors && slotProps.data.majors.length">
                {{ getMajorNames(slotProps.data.majors) }}
              </span>
              <span v-else>-</span>
            </template>
          </Column>
          <Column field="relatedCourses" header="Related Courses" sortable style="min-width: 16rem">
            <template #body="slotProps">
              <span v-if="slotProps.data.relatedCourses && slotProps.data.relatedCourses.length">
                {{ getCourseNames(slotProps.data.relatedCourses) }}
              </span>
              <span v-else>-</span>
            </template>
          </Column>
          <Column field="tracks" header="Tracks" sortable style="min-width: 16rem">
            <template #body="slotProps">
              <span v-if="slotProps.data.tracks && slotProps.data.tracks.length">
                {{ getTrackNames(slotProps.data.tracks) }}
              </span>
              <span v-else>-</span>
            </template>
          </Column>
          <Column field="skills" header="Skills" sortable style="min-width: 16rem">
            <template #body="slotProps">
              <span v-if="slotProps.data.skills && slotProps.data.skills.length">
                {{ getSkillNames(slotProps.data.skills) }}
              </span>
              <span v-else>-</span>
            </template>
          </Column>
          <Column field="companies" header="Companies" sortable style="min-width: 16rem">
            <template #body="slotProps">
              <span v-if="slotProps.data.companies && slotProps.data.companies.length">
                {{ getCompanyNames(slotProps.data.companies) }}
              </span>
              <span v-else>-</span>
            </template>
          </Column>
          <!-- <Column field="offered" header="When Offered" sortable style="min-width: 12rem"></Column>
          <Column field="description" header="Description" sortable style="min-width: 20rem"></Column> -->
          <!-- <Column header="Image">
            <template #body="slotProps">
              <img :src="slotProps.data.imageUrl" :alt="slotProps.data.name" class="rounded" style="width: 64px" />
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

    <!-- Majors Tab -->
    <div v-if="activeTab === 'majors'" class="p-4">
      <Card class="mb-4 shadow-md">
        <template #content>
          <h4 class="mb-3">Add a New Major</h4>
          <div class="flex flex-col md:flex-row gap-3 items-center">
            <InputText v-model="newMajor" placeholder="Enter major name" class="w-full md:w-auto p-inputtext-lg" />
            <Button label="Add Major" icon="pi pi-plus" class="p-button-success p-button-lg" @click="addMajor"
              :disabled="!newMajor.trim()" />
          </div>
        </template>
      </Card>

      <h4 class="mb-3 py-2">Existing Majors</h4>
      <DataTable :value="majorsList" class="p-datatable-sm" stripedRows responsiveLayout="scroll">
        <Column field="name" header="Major Name" class="p-text-lg"></Column>

        <Column header="Actions" class="text-center">
          <template #body="slotProps">
            <div class="flex justify-center gap-2">
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-sm"
                @click="removeMajor(slotProps.data._id)" v-tooltip.bottom="'Delete Major'" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>


    <!-- Skills Tab -->
    <div v-if="activeTab === 'skills'" class="p-4">
      <Card class="mb-4 shadow-md">
        <template #content>
          <h4 class="mb-3">Add a New Skill</h4>
          <div class="flex flex-col md:flex-row gap-3 items-center">
            <InputText v-model="newSkill" placeholder="Enter skill name" class="w-full md:w-auto p-inputtext-lg" />
            <Button label="Add Skill" icon="pi pi-plus" class="p-button-success p-button-lg" @click="addSkill"
              :disabled="!newSkill.trim()" />
          </div>
        </template>
      </Card>

      <h4 class="mb-3 py-2">Existing Skills</h4>
      <DataTable :value="skillsList" class="p-datatable-sm" stripedRows responsiveLayout="scroll">
        <Column field="name" header="Skill Name" class="p-text-lg"></Column>

        <Column header="Actions" class="text-center">
          <template #body="slotProps">
            <div class="flex justify-center gap-2">
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-sm"
                @click="removeSkill(slotProps.data._id)" v-tooltip.bottom="'Delete Skill'" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Company Tab -->
    <div v-if="activeTab === 'companies'" class="p-4">
      <Card class="mb-4 shadow-md">
        <template #content>
          <h4 class="mb-3">Add a New Company</h4>
          <div class="flex flex-col md:flex-row gap-3 items-center">
            <InputText v-model="newCompany" placeholder="Enter company name" class="w-full md:w-auto p-inputtext-lg" />
            <Button label="Add Company" icon="pi pi-plus" class="p-button-success p-button-lg" @click="addCompany"
              :disabled="!newCompany.trim()" />
          </div>
        </template>
      </Card>

      <h4 class="mb-3 py-2">Existing Companies</h4>
      <DataTable :value="companiesList" class="p-datatable-sm" stripedRows responsiveLayout="scroll">
        <Column field="name" header="Company Name" class="p-text-lg"></Column>

        <Column header="Actions" class="text-center">
          <template #body="slotProps">
            <div class="flex justify-center gap-2">
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-sm"
                @click="removeCompany(slotProps.data._id)" v-tooltip.bottom="'Delete Company'" />
            </div>
          </template>
        </Column>
      </DataTable>
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
        <Column field="companies" header="Companies" sortable style="min-width: 12rem; flex-grow: 1;">
          <template #body="slotProps">
            <span v-if="slotProps.data.companies && slotProps.data.companies.length">
              {{ getCompanyNames(slotProps.data.companies) }}
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

        <!-- Full-Width Description -->
        <Card class="p-4">
          <template #title>Description</template>
          <template #content>
            <Textarea id="description" v-model="course.description" required rows="4" class="w-full p-2" />
          </template>
        </Card>
        <br>

        <!-- Image and Offered Term -->
        <div class="grid grid-cols-2 gap-6">
          <Card class="p-4">
            <template #title>When Offered</template>
            <template #content>
              <InputText id="offered" v-model="course.offered" class="w-full p-2" />
            </template>
          </Card>
          <br>

          <Card class="p-4">
            <template #title>Image URL</template>
            <template #content>
              <InputText id="imageUrl" v-model="course.imageUrl" class="w-full p-2" />
            </template>
          </Card>
        </div>
        <br>

        <!-- Image Preview -->
        <div v-if="course.imageUrl" class="flex justify-center">
          <img :src="course.imageUrl" :alt="course.name" class="rounded-md shadow-md w-48" />
        </div>
        <br>

        <!-- Multi-Select Options -->
        <div class="grid grid-cols-2 gap-6">
          <Card class="p-4">
            <template #title>Majors</template>
            <template #content>
              <MultiSelect id="majors" v-model="course.majors" :options="majorsList.map(m => m.name)" filter
                placeholder="Select Majors" class="w-full p-2" />
            </template>
          </Card>
          <br>
          <Card class="p-4">
            <template #title>Tracks</template>
            <template #content>
              <MultiSelect id="tracks" v-model="course.tracks" :options="tracksList.map(i => i.name)" filter
                placeholder="Select Tracks" class="w-full p-2" />
            </template>
          </Card>
          <br>
          <Card class="p-4">
            <template #title>Skills</template>
            <template #content>
              <MultiSelect id="skills" v-model="course.skills" :options="skillsList.map(s => s.name)"
                placeholder="Select Skills" filter class="w-full p-2" />
            </template>
          </Card>
          <br>
          <Card class="p-4">
            <template #title>Related Courses</template>
            <template #content>
              <MultiSelect id="relatedCourses" v-model="course.relatedCourses" :options="coursesList.map(c => c.name)"
                filter placeholder="Select Related Courses" class="w-full p-2" />
            </template>
          </Card>
          <br>
          <Card class="p-4">
            <template #title>Companies</template>
            <template #content>
              <MultiSelect id="companies" v-model="course.companies" :options="companiesList.map(c => c.name)" filter
                placeholder="Select Companies" class="w-full p-2" />
            </template>
          </Card>
          <br>
        </div>
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
            <InputText id="name" v-model.trim="track.name" required autofocus :invalid="courseSubmitted && !track.name"
              class="w-full p-2" />
            <small v-if="courseSubmitted && !track.name" class="text-red-500">Name is required.</small>
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
          <template #title>Companies</template>
          <template #content>
            <MultiSelect id="companies" v-model="track.companies" :options="companiesList.map(c => c.name)" filter
              placeholder="Select Companies" class="w-full p-2" />
          </template>
        </Card>

        <!-- Image URL -->
        <Card class="p-4">
          <template #title>Image URL</template>
          <template #content>
            <InputText id="imageUrl" v-model="track.imageUrl" class="w-full p-2" />
          </template>
        </Card>
        <br>

        <!-- Image Preview -->
        <div v-if="track.imageUrl" class="flex justify-center">
          <img :src="track.imageUrl" :alt="track.name" class="rounded-md shadow-md w-48" />
        </div>
        <br>

        <!-- Save & Cancel Buttons -->
        <div class="flex justify-end gap-3">
          <Button label="Cancel" class="p-button-text" @click="trackDialog = false" />
          <Button label="Save Track" icon="pi pi-check" class="p-button-success" @click="saveTrack"
            :disabled="!track.name.trim()" />
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