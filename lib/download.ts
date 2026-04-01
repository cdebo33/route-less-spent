export async function downloadItineraryText(destination: string, startDate: string, content: string) {
  const filename = `${destination.replace(/\s+/g, '-')}-itinerary-${startDate}.txt`
  const file = new File([content], filename, { type: 'text/plain' })

  // Use Web Share API on mobile (iOS/Android native share sheet)
  if (
    typeof navigator !== 'undefined' &&
    navigator.share &&
    navigator.canShare &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({ files: [file], title: `${destination} Itinerary` })
      return
    } catch (err) {
      // User cancelled share — don't fall through to download
      if (err instanceof Error && err.name === 'AbortError') return
    }
  }

  // Desktop fallback: blob download
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
