import { createRouter, createWebHistory } from "vue-router";
import CourseList from "@/views/CourseList.vue";
import CourseDetail from "@/views/CourseDetail.vue";
import AdminPanel from "@/views/AdminPanel.vue";
import TracksList from "@/views/TracksList.vue";
import TracksDetail from "@/views/TracksDetail.vue";

const routes = [
  { path: "/", name: "Home", component: TracksList },
  { path: "/courses/:id", name: "CourseDetail", component: CourseDetail, props: true },
  { path: "/tracks/:id", name: "TracksDetail", component: TracksDetail, props: true },
  { path: "/admin", name: "AdminPanel", component: AdminPanel },
  { path: "/courses", name: "CourseList", component: CourseList}
];

const router = createRouter({
  history: createWebHistory(), // Ensure you're using createWebHistory()
  routes
});

export default router;
