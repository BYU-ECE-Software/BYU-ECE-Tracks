import { createRouter, createWebHistory } from "vue-router";
import CourseList from "@/views/CourseList.vue";
import CourseDetail from "@/views/CourseDetail.vue";
import AdminPanel from "@/views/AdminPanel.vue";
import TracksList from "@/views/TracksList.vue";
import TracksDetail from "@/views/TracksDetail.vue";
import SuperTracksList from "@/views/SuperTracksList.vue";

const routes = [
  { path: "/tracks", name: "Home", component: SuperTracksList },
  { path: "/", redirect: "/tracks" },
  // { path: "/courses/:id", name: "CourseDetail", component: CourseDetail, props: true },
  // { path: "/tracks/:id", name: "TracksDetail", component: TracksDetail, props: true },
  // { path: "/tracks/:name", name: "TracksList", component: TracksList, props: true },
  { path: "/admin", name: "AdminPanel", component: AdminPanel },
  // { path: "/courses", name: "CourseList", component: CourseList },
  { path: "/tracks", name: "SupertracksList", component: SuperTracksList },
  { path: "/tracks/:supertrack/:track", name: "TrackDetail", component: TracksDetail, props: true },
  { path: "/tracks/:supertrack", name: "Supertrack", component: TracksList, props: true, }
];

const router = createRouter({
  history: createWebHistory(), // Ensure you're using createWebHistory()
  routes
});

export default router;
