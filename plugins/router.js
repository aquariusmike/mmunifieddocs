// Place this file in your plugins directory: ~/plugins/router.js
export default defineNuxtPlugin((nuxtApp) => {
  // Ensure the router is initialized before components try to use it
  nuxtApp.hook('app:created', () => {
    // Additional router setup if needed
    console.log('Router plugin initialized')
  })
})