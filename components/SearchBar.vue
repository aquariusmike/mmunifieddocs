<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

import Fuse from 'fuse.js'

const searchQuery = ref('')
const searchResults = ref([])
const searchDataItems = ref([])
const isSearchLoading = ref(true)
const isComponentMounted = ref(false)

onMounted(async () => {
  isComponentMounted.value = true
  await nextTick()
  await loadSearchData()
})

onBeforeUnmount(() => {
  isComponentMounted.value = false
})

async function loadSearchData() {
  if (!isComponentMounted.value) return

  try {
    const { data: fetchedData } = await useAsyncData(
      'search-data-filtered',
      () => queryCollectionSearchSections('docs')
    )

    if (isComponentMounted.value && fetchedData.value) {
      searchDataItems.value = fetchedData.value
    }
  } catch (error) {
    console.error('Error loading search data:', error)
  } finally {
    if (isComponentMounted.value) {
      isSearchLoading.value = false
    }
  }
}

function performSearch() {
  if (!searchQuery.value.trim() || !searchDataItems.value.length) {
    searchResults.value = []
    return
  }

  try {
    const cleanedData = searchDataItems.value
      .filter(Boolean)
      .map(processSearchItem)

    const searchEngine = new Fuse(cleanedData, {
      keys: [
        { name: 'title', weight: 2 },
        'description',
        'content'
      ],
      ignoreLocation: true,
      includeMatches: true,
      threshold: 0.3,
      minMatchCharLength: 1
    })

    const rawResults = searchEngine.search(searchQuery.value)
    searchResults.value = filterCodeResults(rawResults).slice(0, 10)
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  }
}

function processSearchItem(item) {
  if (!item) return null

  const processedItem = JSON.parse(JSON.stringify(item))

  if (processedItem.content) {
    processedItem.content = removeCodeContent(processedItem.content)
  }

  if (processedItem.description) {
    processedItem.description = removeCodeContent(processedItem.description)
  }

  return processedItem
}

function removeCodeContent(text) {
  if (!text) return ''

  let cleaned = text
  cleaned = cleaned.replace(/<CardCode>[\s\S]*?<\/CardCode>/g, '')
  cleaned = cleaned.replace(/```[\s\S]*?```/g, '')
  cleaned = cleaned.replace(/<html>[\s\S]*?<\/html>/g, '')

  return cleaned
}

function filterCodeResults(results) {
  return results.filter(result => {
    if (!result || !result.item) return false

    const content = result.item.content || ''
    const codeIndicators = [
      '<html>', '</html>', '<CardCode>', '```html',
      'code.shiki', 'pre.shiki', '.sn6kH', '<script'
    ]

    return !codeIndicators.some(indicator => content.includes(indicator))
  })
}

watch(searchQuery, () => {
  if (isComponentMounted.value) {
    performSearch()
  }
})

watch(searchDataItems, () => {
  if (isComponentMounted.value && searchQuery.value.trim()) {
    performSearch()
  }
})
</script>

<template>
  <div class="p-2 ">
    <div class="mb-6">
      <input 
        v-model="searchQuery" 
        placeholder="Search..." 
        class="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-900 text-gray-200 "
      />
    </div>

    <div class="w-full max-h-[40vh] overflow-y-auto">
    <div v-if="isSearchLoading" class="text-center py-4">
      <p class="text-gray-500">Loading search data...</p>
    </div>

    <div v-else-if="searchQuery.length > 0" class="space-y-4 h-auto overflow-hidden">
      <div v-if="searchResults.length === 0" class="text-gray-500 text-center py-4">
        No results found for "{{ searchQuery }}"
      </div>

      <div 
        v-for="(result, index) in searchResults" 
        :key="index"
        class="px-4 py-1 w-full h-auto overflow-y-auto bg-slate-900 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
      >
        <h1 v-if="result?.item?.title" class="text-xl font-bold text-gray-300 mb-1">
          {{ result.item.title }}
        </h1>
        <p v-if="result?.item?.description" class="text-gray-500 text-sm mb-1">
          {{ result.item.description }}
        </p>
        <p v-else-if="result?.item?.content" class="text-gray-500 text-sm">
          {{ result.item.content.slice(0, 120).trim() + (result.item.content.length > 120 ? '...' : '') }}
        </p>
        <RouterLink 
          v-if="result?.item?.id"
          :to="result.item.id"
          class="mt-2 text-blue-600 hover:underline text-sm font-medium inline-block"
        >
          View details
        </RouterLink>
      </div>
    </div>
  </div>
  </div>
</template>
