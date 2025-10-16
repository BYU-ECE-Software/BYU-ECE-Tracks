<template>
  <header class="header-bar w-full text-white py-4 px-6 shadow-md">
    <div class="max-w-7xl mx-auto flex items-center">
      <a
        href="https://www.byu.edu"
        target="_blank"
        rel="noopener noreferrer"
        class="mr-4"
      >
        <img
          src="@/assets/BYU_monogram_white.svg"
          alt="Logo"
          class="h-10 w-auto"
        />
      </a>
      <RouterLink to="/tracks">
        <h1 class="text-2xl font-bold">| ECE Tracks</h1>
      </RouterLink>
    </div>
    <!-- Right side: Auth buttons -->
    <div>
      <template v-if="user">
        <span class="mr-4 font-semibold"
          >Welcome, {{ user.firstName || user.name || "User" }}</span
        >
        <button
          @click="logout"
          class="bg-white text-blue-900 font-semibold py-2 px-4 rounded shadow hover:bg-gray-100 transition"
        >
          Sign Out
        </button>
      </template>

      <template v-else>
        <button
          @click="login"
          class="bg-white text-blue-900 font-semibold py-2 px-4 rounded shadow hover:bg-gray-100 transition"
        >
          Sign In
        </button>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from "vue";

const API_BASE = import.meta.env.VITE_API_BASE_URI;
const user = ref(null);

// Fetch session from backend (Auth.js provides /api/auth/session)
async function fetchSession() {
  try {
    const res = await fetch(`${API_BASE}/auth/session`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      user.value = data?.user || null;
    } else {
      user.value = null;
    }
  } catch (err) {
    console.error("Failed to fetch session:", err);
    user.value = null;
  }
}

async function login() {
  window.location.href = `${API_BASE}/auth/login?callbackUrl=${encodeURIComponent(window.location.origin)}`;
}

async function logout() {
  window.location.href = `${API_BASE}/auth/logout?callbackUrl=${encodeURIComponent(window.location.origin)}`;
}

onMounted(fetchSession);
</script>

<style scoped>
header {
  width: 100%;
}

.header-bar {
  width: 100vw;
  background-color: var(--byu-navy);
  padding: 2rem;
  text-align: center;
  margin: 0 auto;
}

h1 {
  color: white;
}
</style>
