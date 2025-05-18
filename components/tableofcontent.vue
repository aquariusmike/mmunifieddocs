// 1. Create a TableOfContents.vue component
// components/content/TableOfContents.vue
<template>
  <nav v-if="links.length" class="table-of-contents">
    <p class="font-bold text-lg mb-2">Table of Contents</p>
    <ul class="toc-list">
      <li v-for="link in links" :key="link.id" :class="{ 'pl-4': link.depth > 2 }">
        <a :href="`#${link.id}`" class="text-blue-600 hover:underline">{{ link.text }}</a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAsyncData, queryContent } from '#imports'

const route = useRoute()
const links = ref([])

const fetchToc = async () => {
  const { path } = route
  const contentPath = path === '/' ? '/index' : path
  
  const { data } = await useAsyncData(`toc-${contentPath}`, () => {
    return queryContent(contentPath)
      .only(['body'])
      .findOne()
  })
  
  if (data.value && data.value.body) {
    // Extract headings from the document body
    links.value = data.value.body.toc?.links || []
  }
}

onMounted(() => {
  fetchToc()
})

watch(() => route.path, () => {
  fetchToc()
})
</script>
