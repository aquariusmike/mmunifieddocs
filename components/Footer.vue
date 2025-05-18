// components/Footer.vue
<template>
  <footer class="w-full bg-slate-700 text-white p-4">
    <div class="flex flex-col md:flex-row justify-between items-center w-full max-w-4xl mx-auto">
      <div class="text-sm mb-2 md:mb-0">
        <p>© {{ currentYear }} {{ companyName }}. All rights reserved.</p>
      </div>
      <div class="flex flex-row gap-4">
        <a href="#" class="text-sm hover:text-gray-400 transition-colors">Privacy Policy</a>
        <a href="#" class="text-sm hover:text-gray-400 transition-colors">Terms of Service</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
const companyName = 'L.A'
const currentYear = computed(() => new Date().getFullYear())
</script>