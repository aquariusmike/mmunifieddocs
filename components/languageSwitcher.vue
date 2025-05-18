<script setup>
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const { locale, locales } = useI18n()
const route = useRoute()
const router = useRouter()

const availableLocales = computed(() => {
  return (locales.value).filter(i => i.code !== locale.value)
})

const switchLocalePath = (localeCode) => {
  // Get current path components
  const pathMatch = route.path.match(/^\/([^\/]+)?(.*)$/)
  const currentLocale = pathMatch?.[1]
  const pathWithoutLocale = pathMatch?.[2] || ''
  
  // Check if current path starts with a locale
  const hasLocalePrefix = locales.value.some(locale => locale.code === currentLocale)
  
  // Construct new path with the target locale
  let newPath
  if (hasLocalePrefix) {
    // Replace current locale with new locale
    newPath = localeCode === 'en' 
      ? pathWithoutLocale || '/' 
      : `/${localeCode}${pathWithoutLocale}`
  } else {
    // Add locale prefix to current path
    newPath = localeCode === 'en' 
      ? route.path 
      : `/${localeCode}${route.path}`
  }
  
  return newPath
}

const switchLanguage = (localeCode) => {
  const newPath = switchLocalePath(localeCode)
  // Set the locale
  locale.value = localeCode
  // Navigate to the localized route
  router.push(newPath)
}
</script>

<template>
  <div class="language-switcher">
    <button class="current-lang">
      {{ locale }}
      <span class="icon">▼</span>
    </button>
    <ul class="lang-dropdown">
      <li v-for="loc in availableLocales" :key="loc.code">
        <button @click="switchLanguage(loc.code)">
          {{ loc.name }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}

.current-lang {
  padding: 0.5rem 1rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.icon {
  margin-left: 0.5rem;
  font-size: 0.75rem;
}

.lang-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  min-width: 120px;
  margin-top: 0.25rem;
  padding: 0.5rem 0;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: none;
  list-style: none;
}

.language-switcher:hover .lang-dropdown {
  display: block;
}

.lang-dropdown li button {
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  background: transparent;
  border: none;
  cursor: pointer;
}

.lang-dropdown li button:hover {
  background-color: #f3f4f6;
}
</style>