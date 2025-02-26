<template>
    <header class="header-bar w-full text-white py-4 px-6 shadow-md">
        <div class="max-w-7xl mx-auto flex items-center">
            <a href="https://www.byu.edu" target="_blank" rel="noopener noreferrer" class="mr-4">
                <img src="@/assets/BYU_monogram_white.svg" alt="Logo" class="h-10 w-auto">
            </a>
            <h1 class="text-2xl font-bold">| ECE Tracks</h1>
        </div>
    </header>
</template>

<script>
export default {
    name: "HeaderBar",
};
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

h1{
    color:white;
}
</style>