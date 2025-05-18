<script setup>
import { useRouter, useRoute } from 'vue-router'

// Only use these in client-side code with proper guards
const router = process.import.meta.client ? useRouter() : null
const route = process.import.meta.client ? useRoute() : null
</script>

<template>
  <div>
    <NuxtLayout>
      <section class="flex flex-col items-center justify-center min-w-full min-h-screen bg-slate-900">
        <NuxtPage />
      </section>
    </NuxtLayout>
  </div>
</template>