// Alternative approach with fetch: composables/useDocsFetch.js
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export default function useDocsFetch() {
  const { locale } = useI18n()
  const docsData = ref({})
  const isLoading = ref(false)
  const error = ref(null)
  const availableLocales = ref(['mm', 'en', 'kn']) // Add your supported locales here
  
  // Function to fetch docs for a specific locale
  const fetchDocs = async (selectedLocale) => {
    // Reset state
    isLoading.value = true
    error.value = null
    
    try {
      // Fetch the data from a JSON file in the public directory
      const response = await fetch(`/locales/${selectedLocale}/docs.json`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch docs for locale '${selectedLocale}': ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Store the docs for this locale
      docsData.value[selectedLocale] = data
    } catch (err) {
      error.value = `Failed to fetch docs: ${err.message}`
      console.error(error.value)
      
      // Try to fall back to English if available and different from current locale
      if (selectedLocale !== 'en' && !docsData.value['en']) {
        console.warn(`Attempting to fall back to English locale`)
        await fetchDocs('en').catch(fallbackErr => {
          // If even the fallback fails, just log it
          console.error(`Fallback to English failed: ${fallbackErr.message}`)
        })
      }
    } finally {
      isLoading.value = false
    }
  }
  
  // Computed property to get current docs
  const docs = computed(() => {
    return docsData.value[locale.value]?.docsList?.docs || []
  })
  
  // Function to change locale
  const changeLocale = async (newLocale) => {
    locale.value = newLocale
    
    // Only fetch if we don't already have this locale data
    if (!docsData.value[newLocale]) {
      await fetchDocs(newLocale)
    }
  }
  
  // Watch for locale changes
  watch(locale, async (newLocale) => {
    if (!docsData.value[newLocale]) {
      await fetchDocs(newLocale)
    }
  }, { immediate: true })
  
  return {
    docs,
    isLoading,
    error,
    changeLocale,
    availableLocales
  }
}