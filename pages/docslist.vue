<template>
  <div class="navbar w-full h-[70px] flex justify-between items-center px-6 py-4 bg-slate-800 text-white fixed top-0 left-0 right-0 z-40 shadow-lg">
    <!-- Logo -->
    <div class="logo px-1 h-[70px] flex items-center">
      <nuxt-link to="/" class="w-full h-full flex items-center">
     
      <img src="/unified-docs-logo.svg" alt="Logo" class="w-[90px] h-[90px]" />
      <h2 class="text-xl font-bold text-slate-200 font-[lobster] ml-2">Unified Docs</h2>
      </nuxt-link>
    </div>
    
    <!-- Navigation Links -->
    <div class="nav-links hidden md:flex flex-row">
      <nuxt-link to="/about" class="px-4 py-2 hover:bg-slate-600 rounded-lg transition">About</nuxt-link>
      <nuxt-link to="/docsList" class="px-4 py-2 hover:bg-slate-600 rounded-lg transition">Docs List</nuxt-link>
    </div>
    
    <!-- Controls -->
    <div class="flex items-center space-x-4">
      <!-- Language Dropdown -->
      <div class="relative">
        <button 
          @click="toggleLanguageDropdown" 
          class="flex items-center px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition"
        >
          <span>{{ localeDisplayNames[currentLocale] || currentLocale.toUpperCase() }}</span>
          <svg 
            class="w-4 h-4 ml-2 transition-transform duration-300" 
            :class="{ 'transform rotate-180': isLanguageDropdownOpen }"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <!-- Dropdown Menu with Animation -->
        <transition 
          enter-active-class="transition ease-out duration-200"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div 
            v-show="isLanguageDropdownOpen" 
            class="absolute right-0 mt-2 w-48 bg-slate-700 rounded-lg shadow-lg py-1 z-50"
          >
            <button 
              v-for="locale in availableLocales" 
              :key="locale"
              @click="selectLanguage(locale)"
              class="w-full text-left px-4 py-2 hover:bg-slate-600 transition"
              :class="{ 'bg-slate-600': currentLocale === locale }"
              :disabled="isLoading"
            >
              {{ localeDisplayNames[locale] || locale.toUpperCase() }}
            </button>
          </div>
        </transition>
      </div>

      <!-- Search Button with Animated Icon -->
      <button @click="toggleSearchBox" class="px-2 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition">
        <animated-icons
          src="https://animatedicons.co/get-icon?name=search&style=minimalistic&token=12e9ffab-e7da-417f-a9d9-d7f67b64d808"
          trigger="hover"
          height="30"
          width="30"
        ></animated-icons>
      </button>
    </div>
  </div>

  <!-- Content Spacer (to prevent content from hiding under fixed navbar) -->
  <div class="h-[65px]"></div>

  <!-- Modal Search Box -->
  <div
    v-show="isSearchOpen"
    @click="handleBackdropClick"
    :class="[
      'fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50',
      animationClass
    ]"
  >
    <div class="bg-slate-800 p-6 rounded-lg shadow-xl w-[80%] max-w-3xl">
      <SearchBar />
    </div>
  </div>

  <!-- Main Content Area -->
  <div class="container mx-auto px-4 py-6">
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      Loading documentation...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else class="docs-list">
      <h2 class="text-2xl font-bold mb-6">Documentation</h2>
      <div v-if="docs.length === 0" class="no-docs">
        No documentation available for this language.
      </div>
      <div v-else v-for="doc in docs" :key="doc.path" class="doc-item">
        <h3 class="text-lg font-semibold">{{ doc.title }}</h3>
        <p class="text-gray-700">{{ doc.description }}</p>
        <router-link :to="doc.path" class="text-blue-600 hover:text-blue-800">Read more</router-link>
      </div>
    </div>
  </div>
  <Footer />

</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import useDocsFetchDynamic from '@/composables/useDocsFetchDynamic'

const { docs, isLoading, error, changeLocale, availableLocales } = useDocsFetchDynamic()
const { locale } = useI18n()

// Display names for locales
const localeDisplayNames = ref({
  en: 'English',
  mm: 'မြန်မာ',
  kn: 'ಕನ್ನಡ'
})

// Language dropdown state
const isLanguageDropdownOpen = ref(false)

// For highlighting the active locale button
const currentLocale = computed(() => locale.value)

// Search modal state
const isSearchOpen = ref(false)
const animationClass = ref('')

useHead({
  script: [
    {
      src: 'https://animatedicons.co/scripts/embed-animated-icons.js',
      async: true
    }
  ]
})

function toggleLanguageDropdown() {
  isLanguageDropdownOpen.value = !isLanguageDropdownOpen.value
}

function selectLanguage(selectedLocale) {
  changeLocale(selectedLocale)
  isLanguageDropdownOpen.value = false
}

function toggleSearchBox() {
  if (isSearchOpen.value) {
    closeModal()
  } else {
    openModal()
  }
}

function openModal() {
  isSearchOpen.value = true
  animationClass.value = 'animate-fade-in'
}

function closeModal() {
  animationClass.value = 'animate-fade-out'
  setTimeout(() => {
    isSearchOpen.value = false
  }, 300) // Match animation duration
}

// Close modal if user clicks the backdrop only
function handleBackdropClick(event) {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

// Close dropdown when clicking outside
const closeDropdownOnClickOutside = (event) => {
  if (isLanguageDropdownOpen.value && !event.target.closest('.relative')) {
    isLanguageDropdownOpen.value = false
  }
}

// Add and remove event listeners
onMounted(() => {
  document.addEventListener('click', closeDropdownOnClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeDropdownOnClickOutside)
})
</script>

<style scoped>
/* Animation for modal */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-fade-out {
  animation: fadeOut 0.3s ease-in forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Loading indicator */
.loading, .error, .no-docs {
  padding: 20px;
  text-align: center;
  border: 1px solid #eee;
  border-radius: 5px;
  margin-bottom: 20px;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #4a6cf7;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  color: #e53935;
  border-color: #ffcdd2;
  background-color: #ffebee;
}

/* Documentation list styling */
.docs-list {
  max-width: 800px;
  margin: 0 auto;
}

.doc-item {
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
  transition: all 0.2s ease;
}

.doc-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-color: #ddd;
}

.doc-item h3 {
  margin-top: 0;
  color: #333;
}

.doc-item a {
  display: inline-block;
  margin-top: 10px;
  font-weight: 500;
}
</style>