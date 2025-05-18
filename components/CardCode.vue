<template>
    <div class="relative bg-slate-700 rounded-xl p-3 shadow-md my-6">
      <div class="flex flex-row justify-between items-center p-1">
        <!-- Browser Titlee Buttons-->
         <div class="flex flex-co justify-start px-0.5 gap-1">
        <div class="rounded-xl p-1.5 bg-red-600"></div>
        <div class="rounded-xl p-1.5 bg-green-600"></div>
        <div class="rounded-xl p-1.5 bg-yellow-600"></div>


      </div>
      <button class=" top-2 right-2 bg-slate-700 hover:bg-slate-800 text-white text-sm p-2 rounded transition-all"
        @click="copyCode"
      >
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>
      <!-- Slot holds the markdown code block -->
      <pre ref="codeBlock"><slot /></pre>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const codeBlock = ref(null)
  const copied = ref(false)
  
  const copyCode = () => {
    if (!codeBlock.value) return
    const code = codeBlock.value.textContent
    navigator.clipboard.writeText(code).then(() => {
      copied.value = true
      setTimeout(() => (copied.value = false), 1500)
    })
  }
  </script>
  