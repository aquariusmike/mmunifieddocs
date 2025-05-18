<script setup>
import { ref } from 'vue'
const { locales, setLocale } = useI18n()

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
  <navbar />
  <div class="w-full h-screen flex flex-col items-center justify-center min-h-screen ">
      <div class="flex flex-col p-2 bg-slate-400 text-white rounded-lg mb-4">
      <button class="px-4 py-2 bg-slate-300" v-for="locale in locales" @click="setLocale(locale.code)">
      {{ locale.name }}</button>
    </div>

    <h1>{{ $t('nav.home') }}</h1>
    <button @click="toggleSearchBox" class="bg-slate-700 text-white px-1 py-1 rounded-lg mb-4">
      
      <animated-icons
  src="https://animatedicons.co/get-icon?name=search&style=minimalistic&token=12e9ffab-e7da-417f-a9d9-d7f67b64d808"
  trigger="hover"
  attributes='{"variationThumbColour":"#536DFE","variationName":"Two Tone","variationNumber":2,"numberOfGroups":2,"backgroundIsGroup":false,"strokeWidth":1,"defaultColours":{"group-1":"#000000","group-2":"#536DFE","background":"#FFFFFF"}}'
  height="30"
  width="30"
></animated-icons>

    </button>

    <div
      v-show="isSearchOpen"
      @click="handleBackdropClick"
      :class="[
        'fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50',
        animationClass
      ]"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md">
        <SearchBar />
      </div>
    </div>
  </div>
    <Footer />
</template>

