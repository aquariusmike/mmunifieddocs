<template>
  <div class="navbar w-full h-[70px] flex justify-between items-center px-6 py-4 bg-slate-800 text-white fixed top-0 left-0 right-0 z-40 shadow-lg">
    <!-- Logo -->
<div class="logo px-1 h-[70px] flex items-center">
      <nuxt-link to="/" class="w-full h-full flex items-center">
     
      <img src="/unified-docs-logo.svg" alt="Logo" class="w-[90px] h-[90px]" />
      <h2 class="text-xl font-bold text-slate-200 font-[lobster] ml-2">Unified Docs</h2>
      </nuxt-link>
    </div>    <div class="nav-links flex flex-row">
      <nuxt-link to="/about" class="px-4 py-2 hover:bg-slate-600 rounded-lg transition">About</nuxt-link>
      <nuxt-link to="/docsList" class="px-4 py-2 hover:bg-slate-600 rounded-lg transition">Docs List</nuxt-link>
   
    </div>
    <!-- Controls -->
    <div class="flex items-center space-x-4">

      <!-- Locale Dropdown -->
      <div class="relative" @mouseleave="showDropdown = false">
        <button @mouseenter="showDropdown = true"
                class="px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition">
          🌐 {{ currentLocaleLabel }}
        </button>
        <transition name="fade">
          <div v-if="showDropdown"
               class="absolute top-full mt-2 bg-slate-700 rounded-lg shadow-lg z-50 w-40">
            <button
              v-for="loc in localeList"
              :key="loc.code"
              @click="changeLocale(loc.code)"
              class="block w-full text-left px-4 py-2 hover:bg-slate-600"
            >
              {{ loc.name }}
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

    <!-- Modal Search Box -->
    <div
      v-show="isSearchOpen"
      @click="handleBackdropClick"
      :class="[
        'fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50',
        animationClass
      ]"
    >
      <div class="bg-slate-800 p-6 rounded-lg shadow-xl w-[80%] min-w-3/4">
        <SearchBar />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, unref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '#imports'

// Inject animated-icons script
useHead({
  script: [
    {
      src: 'https://animatedicons.co/scripts/embed-animated-icons.js',
      async: true
    }
  ]
})

const { locales, locale, setLocale } = useI18n()

// Handle locale list safely
const localeList = computed(() => {
  const raw = typeof locales === 'function' ? locales() : unref(locales)
  return Array.isArray(raw) ? raw : []
})

// Current locale display name
const currentLocaleLabel = computed(() => {
  const current = localeList.value.find(l => l.code === locale.value)
  return current ? current.name : locale.value.toUpperCase()
})

const showDropdown = ref(false)

// Locale switch
function changeLocale(code) {
  setLocale(code)
  showDropdown.value = false
}

// Modal search logic
const isSearchOpen = ref(false)
const animationClass = ref('')

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
  }, 300)
}

function handleBackdropClick(event) {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lobster&display=swap');

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
