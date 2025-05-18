<script setup>
// Import composables with proper guards to prevent SSR issues
import { computed, ref, onMounted, onUnmounted } from 'vue'

// Only access router and route on client-side
const route = import.meta.client ? useRoute() : { path: '' }
const router = import.meta.client ? useRouter() : { push: () => { } }

// Search functionality variables
const isSearchOpen = ref(false)
const animationClass = ref('')

// Use asyncData with safety checks
const { data: page } = await useAsyncData(
  import.meta.client ? route.path : 'fallback-key',
  () => {
    if (!import.meta.client) return { body: { toc: { links: [] } } }
    return queryCollection('docs').path(route.path).first()
  },
  { server: false } // Only fetch on client-side
)

// Extract TOC links with fallback
const tocLinks = computed(() => {
  if (!page.value?.body?.toc) return []
  return page.value.body.toc.links || []
})

// Handle scroll behavior only on client-side
if (import.meta.client) {
  onMounted(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1)
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  })
}

// Get surrounding content safely
const { data: surround } = await useAsyncData('docs-surround', () => {
  if (!import.meta.client) return {}
  return queryCollectionSearchSections('docs', {
    ignoredTags: ['code']
  })
}, { server: false })

// Language switcher functionality
const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'kn', name: 'ಕನ್ನಡ' } // Kannada
]

// Get current language with safety checks
const getCurrentLanguage = () => {
  if (!import.meta.client) return 'en'
  const pathParts = route.path.split('/')
  return pathParts.length >= 3 ? pathParts[2] : 'en'
}

const currentLanguage = ref(getCurrentLanguage())
const isDropdownOpen = ref(false)

const getLanguageSwitchPath = (langCode) => {
  if (!import.meta.client) return '/'
  const pathParts = route.path.split('/')
  if (pathParts.length >= 3) {
    pathParts[2] = langCode
    return pathParts.join('/')
  }
  return route.path
}

const selectLanguage = (langCode) => {
  currentLanguage.value = langCode
  router.push(getLanguageSwitchPath(langCode))
  isDropdownOpen.value = false
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

// Client-side event handling
if (import.meta.client) {
  const closeDropdownOnClickOutside = (event) => {
    if (isDropdownOpen.value && !event.target.closest('.custom-language-dropdown')) {
      isDropdownOpen.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', closeDropdownOnClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', closeDropdownOnClickOutside)
  })
}

const getCurrentLanguageName = computed(() => {
  const lang = availableLanguages.find(lang => lang.code === currentLanguage.value)
  return lang ? lang.name : 'Language'
})

// Load animated icons script
useHead({
  script: [
    {
      src: 'https://animatedicons.co/scripts/embed-animated-icons.js',
      async: true
    }
  ]
})

// Search functionality
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
</script>

<template>
  <div class="page-container">
    <!-- Fixed Navbar -->
    <header class="fixed top-0 left-0 w-full z-40">
      <div class="navbar w-full h-[70px] flex justify-between items-center px-6 py-4 bg-slate-800 text-white relative top-0 left-0 right-0 z-40 shadow-lg">
        <!-- Logo -->
       <div class="logo px-1 h-[70px] flex items-center">
      <nuxt-link to="/" class="w-full h-full flex items-center">
     
      <img src="/unified-docs-logo.svg" alt="Logo" class="w-[90px] h-[90px]" />
      <h2 class="text-xl font-bold text-slate-200 font-[lobster] ml-2">Unified Docs</h2>
      </nuxt-link>
    </div>
        <div class="nav-links flex flex-row">
          <nuxt-link to="/about" class="px-4 py-2 hover:bg-slate-600 rounded-lg transition">About</nuxt-link>
          <nuxt-link to="/docsList" class="px-4 py-2 hover:bg-slate-600 rounded-lg transition">Docs List</nuxt-link>
          
        </div>

        <!-- Controls Container -->
        <div class="nav-controls flex items-center gap-4">
          <!-- Language Switcher -->
          <div class="language-switcher flex items-center">
            <span class="language-label text-slate-300 mr-2 hidden md:inline">Language:</span>
            <div class="custom-language-dropdown">
              <button @click="toggleDropdown" class="dropdown-toggle bg-slate-700 text-white border-slate-600">
                {{ getCurrentLanguageName }}
                <span class="dropdown-arrow" :class="{ 'arrow-up': isDropdownOpen }">▼</span>
              </button>
              <transition name="dropdown">
                <ul v-if="isDropdownOpen" class="dropdown-menu bg-slate-700 border-slate-600">
                  <li v-for="lang in availableLanguages" :key="lang.code" @click="selectLanguage(lang.code)"
                    :class="{ active: currentLanguage === lang.code }"
                    class="dropdown-item text-white hover:bg-slate-600">
                    {{ lang.name }}
                  </li>
                </ul>
              </transition>
            </div>
          </div>

          <!-- Search Button -->
          <button @click="toggleSearchBox"
            class="search-btn px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition flex items-center">
            <span class="hidden md:inline mr-2">Search</span>
            <animated-icons
              src="https://animatedicons.co/get-icon?name=search&style=minimalistic&token=12e9ffab-e7da-417f-a9d9-d7f67b64d808"
              trigger="hover" height="24" width="24"></animated-icons>
          </button>
        </div>
      </div>

    </header>

    <!-- Search Modal -->
    <div v-show="isSearchOpen" @click="handleBackdropClick" :class="[
      'fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50',
      animationClass
    ]">
      <div class="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <!-- Replace with your actual SearchBar component -->
        <SearchBar />
      </div>
    </div>

    <!-- Main Content with proper spacing for fixed header -->
    <div class="content-wrapper w-full m-h-screen">
      <!-- Table of Contents -->
      <aside v-if="tocLinks.length" class="toc-sidebar">
        <div class="toc-container">
          <h3 class="toc-title">Table of Contents</h3>
          <nav class="toc-nav">
            <ul class="toc-list">
              <li v-for="link in tocLinks" :key="link.id" :class="{ 'ml-4': link.depth > 2 }">
                <a :href="`#${link.id}`" class="toc-link">{{ link.text }}</a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="content-area">
        <ContentRenderer v-if="page" :value="page" />
      </main>
    </div>
  </div>
    <Footer />
</template>

<style scoped>
/* Animation classes */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-fade-out {
  animation: fadeOut 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

.page-container {

  width: 100%;
  height: auto;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.custom-language-dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  min-width: 120px;
  justify-content: space-between;
  transition: all 0.2s ease;
}

.dropdown-arrow {
  font-size: 0.625rem;
  transition: transform 0.2s ease;
}

.arrow-up {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  z-index: 50;
  border-radius: 0.375rem;
  padding: 0.25rem 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  list-style: none;
  margin: 0;
}

.dropdown-item {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.25s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.content-area {
  flex: 1;
}

.toc-sidebar {
  width: 100%;
  margin-bottom: 1.5rem;
}

.toc-container {
  position: sticky;
  top: 5rem;
  /* Account for fixed header */
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
}

.toc-title {
  font-weight: bold;
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.toc-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.toc-link {
  display: block;
  padding: 0.25rem 0;
  color: #4b5563;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.toc-link:hover {
  color: #2563eb;
}

/* Responsive layout */
@media (min-width: 768px) {
  .content-wrapper {
    flex-direction: row;
    gap: 2rem;
  }

  .toc-sidebar {
    width: 250px;
    flex-shrink: 0;
    margin-bottom: 0;
  }
}
</style>