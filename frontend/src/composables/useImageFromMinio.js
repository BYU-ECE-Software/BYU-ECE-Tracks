// src/composables/useImageFromMinio.js
import { ref } from 'vue'

export function useImageFromMinio() {
  const imageUrl = ref('')
  const isLoading = ref(false)
  const error = ref(null)

  async function loadImageUrl(imageKey) {
    imageUrl.value = ''
    error.value = null
    if (!imageKey) return

    isLoading.value = true
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URI}/image-url/${imageKey}`)
      const data = await res.json()
      imageUrl.value = data.url
    } catch (err) {
      console.error('Error fetching signed image URL:', err)
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  return {
    imageUrl,
    isLoading,
    error,
    loadImageUrl,
  }
}
