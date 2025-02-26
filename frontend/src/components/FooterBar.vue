<template>
    <footer class="footer-bar text-white py-8 px-6">
        <div class="place-items-center grid grid-cols-1 md:grid-cols-3 gap-4 px-32">
            <!-- Left Section: University Info -->
            
            <!-- Middle Section: Quick Links -->
            <div class="text-center">
                <h2 class="text-xl font-bold">Helpful Links</h2>
                <ul class="mt-2 space-y-2 text-sm">
                    <li><a href="https://www.byu.edu" target="_blank" class="hover:underline white">BYU Homepage</a></li>
                    <li><a href="https://www.byu.edu/privacy" target="_blank" class="hover:underline white">Privacy Policy</a></li>
                    <li><a href="https://www.byu.edu/accessibility" target="_blank" class="hover:underline white">Accessibility</a></li>
                    <li><a href="https://www.ece.byu.edu" target="_blank" class="hover:underline white">ECE Department</a></li>
                </ul>
            </div>
            <div class="text-center">
                <h1 class="text-xl font-bold">Brigham Young University</h1>
                <p class="mt-2 text-sm">
                    450 Engineering Building<br>
                    Provo, UT 84602<br>
                    (801) 422-4012
                </p>
            </div>
            
            <!-- Right Section: Social Media -->
            <div>
                <h2 class="text-xl font-bold">Connect With Us</h2>
                <div class="mt-2 flex space-x-4">
                    <a href="https://www.facebook.com/BYUECE" target="_blank" class="white hover:text-white">
                        <i class="pi pi-facebook text-2xl"></i>
                    </a>
                    <a href="https://twitter.com/BYUECE" target="_blank" class="white hover:text-white">
                        <i class="pi pi-twitter text-2xl"></i>
                    </a>
                    <a href="https://www.linkedin.com/school/byu/" target="_blank" class="white hover:text-white">
                        <i class="pi pi-linkedin text-2xl"></i>
                    </a>
                </div>
            </div>
        </div>

        <!-- Bottom Disclaimer -->
        <div class="mt-8 text-center text-xs text-gray-400">
            © {{ new Date().getFullYear() }} Brigham Young University. All rights reserved.
        </div>
    </footer>
</template>

<script setup>
import "primeicons/primeicons.css";
</script>

<style scoped>
footer a {
    transition: color 0.2s ease-in-out;
}

.footer-bar{
    background-color: var(--byu-navy);
}

h1,h2, p{
    color: white;
}

</style>
