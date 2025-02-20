<template>
  <div class="course-detail-container">
    <!-- Back Button -->
    <Button label="Back to Courses" icon="pi pi-arrow-left" class="back-button" @click="$router.push('/courses')" />

    <!-- Course Details -->
    <div v-if="course" class="course-detail">
      <h2 class="course-title">{{ course.name }}</h2>

      <!-- Course Image -->
      <div class="course-image-wrapper">
        <img v-if="course.imageUrl" :src="course.imageUrl" :alt="course.name" class="course-image" />
      </div>

      <!-- Description -->
      <p class="course-description">{{ course.description }}</p>

      <!-- Course Tags -->
      <div class="course-tags">
        <div v-if="course.majors.length" class="tag-section">
          <h4>Applicable Majors</h4>
          <div class="tag-list">
            <span v-for="majorId in course.majors" :key="majorId" class="tag">{{ getMajorName(majorId) || 'Unknown' }}</span>
          </div>
        </div>

        <div v-if="course.companies.length" class="tag-section">
          <h4>Companies You Could Work At</h4>
          <div class="tag-list">
            <span v-for="companyId in course.companies" :key="companyId" class="tag">{{ getCompanyName(companyId) || 'Unknown' }}</span>
          </div>
        </div>

        <div v-if="course.tracks.length" class="tag-section">
          <h4>Related Tracks</h4>
          <div class="tag-list">
            <span v-for="trackId in course.tracks" :key="trackId" class="tag">{{ getTrackName(trackId) || 'Unknown' }}</span>
          </div>
        </div>

        <div v-if="course.skills.length" class="tag-section">
          <h4>Skills You'll Develop</h4>
          <div class="tag-list">
            <span v-for="skillId in course.skills" :key="skillId" class="tag">{{ getSkillName(skillId) || 'Unknown' }}</span>
          </div>
        </div>

      </div>


      <!-- Related Courses -->
      <div class="related-courses-section">
        <h4>Related Courses</h4>
        <ul class="related-courses">
          <li v-for="related in course.relatedCourses" :key="related.id" @click="viewRelatedCourse(related.id)">
            <span>{{ getCourseName(related.id) || 'Unknown' }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="loading-message">
      <p>Loading course details...</p>
    </div>
  </div>
</template>

<style scoped>
.course-detail-container {
  max-width: 1500px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.back-button {
  margin-bottom: 15px;
}

.course-title {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
}

.course-image-wrapper {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.course-image {
  width: 100%;
  max-width: 600px;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.course-description {
  font-size: 1.1rem;
  color: #34495e;
  text-align: center;
  margin-bottom: 20px;
}

.course-tags {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.tag-section {
  text-align: center;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.tag {
  background: #3498db;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.related-courses-section {
  margin-top: 30px;
  text-align: center;
}

.related-courses {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.related-courses li {
  background: #ecf0f1;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

.related-courses li:hover {
  background: #3498db;
  color: white;
}

.loading-message {
  text-align: center;
  font-size: 1.2rem;
  color: #777;
}
</style>


<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Button from "primevue/button";

const route = useRoute();
const router = useRouter();
const course = ref(null);

// Fetch Course Details
const fetchCourseDetails = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/courses/${route.params.id}`);
    course.value = response.data;
  } catch (error) {
    console.error("Error fetching course details:", error);
  }
};


const majorCache = ref({}); // Cache to store fetched major names
const skillCache = ref({}); // Cache to store fetched major names
const courseCache = ref({}); // Cache to store fetched major names
const trackCache = ref({}); // Cache to store fetched major names
const companyCache = ref({}); // Cache to store fetched major names

// Function to get major name by ID (with caching)
const getMajorNameById = async (majorId) => {
  if (!majorId) return "Unknown";

  // Check if the major is already in the cache
  if (majorCache.value[majorId]) {
    return majorCache.value[majorId];
  }

  try {
    // Fetch major details from API
    const response = await axios.get(`http://localhost:5000/majors/${majorId}`);
    const majorName = response.data.name;

    // Store result in cache
    majorCache.value[majorId] = majorName;
    return majorName;
  } catch (error) {
    console.error("Error fetching major:", error);
    return "Unknown";
  }
};



const getSkillNameById = async (skillId) => {
  if (!skillId) return "Unknown";

  // Check if the skill is already in the cache
  if (skillCache.value[skillId]) {
    return skillCache.value[skillId];
  }

  try {
    // Fetch skill details from API
    const response = await axios.get(`http://localhost:5000/skills/${skillId}`);
    const skillName = response.data.name;

    // Store result in cache
    skillCache.value[skillId] = skillName;
    return skillName;
  } catch (error) {
    console.error("Error fetching skill:", error);
    return "Unknown";
  }
};

const getTrackNameById = async (trackId) => {
  if (!trackId) return "Unknown";

  // Check if the track is already in the cache
  if (trackCache.value[trackId]) {
    return trackCache.value[trackId];
  }

  try {
    // Fetch track details from API
    const response = await axios.get(`http://localhost:5000/tracks/${trackId}`);
    const trackName = response.data.name;

    // Store result in cache
    trackCache.value[trackId] = trackName;
    return trackName;
  } catch (error) {
    console.error("Error fetching track:", error);
    return "Unknown";
  }
};

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

const getMajorName = (majorId) => {
  if (!majorCache.value[majorId]) {
    getMajorNameById(majorId); // Fetch name if not cached
    return "Loading..."; // Placeholder while fetching
  }
  return majorCache.value[majorId];
};

const getSkillName = (skillId) => {
  if (!skillCache.value[skillId]) {
    getSkillNameById(skillId); // Fetch name if not cached
    return "Loading..."; // Placeholder while fetching
  }
  return skillCache.value[skillId];
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

// Navigate to Related Course
const viewRelatedCourse = (id) => {
  router.push({ name: "CourseDetail", params: { id } });
};

onMounted(fetchCourseDetails);
</script>
