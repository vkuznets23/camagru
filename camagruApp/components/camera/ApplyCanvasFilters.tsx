export type FilterName =
  | 'none'
  | 'grayscale(100%)'
  | 'sanfrancisco'
  | 'tokyo'
  | 'london'
  | 'nyc'

/**
 * Apply a selected filter directly to a canvas.
 *
 * For simple filters like 'grayscale', we manipulate each pixel.
 * For complex filters like 'tokyo', 'london', 'nyc', we draw overlays
 * and gradients with specific blend modes to mimic the visual effect.
 *
 * This ensures the captured image exactly matches the preview,
 * including on browsers like iOS Safari that ignore CSS overlays on <video>.
 */
export function applyCanvasFilter(
  ctx: CanvasRenderingContext2D,
  filter: FilterName,
  width: number,
  height: number,
) {
  // Converts the image to black and white
  if (filter === 'grayscale(100%)') {
    const imgData = ctx.getImageData(0, 0, width, height)
    const data = imgData.data
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
      data[i] = data[i + 1] = data[i + 2] = avg
    }
    ctx.putImageData(imgData, 0, 0)
  }

  // Blue color overlay + subtle vignette
  if (filter === 'tokyo') {
    ctx.fillStyle = 'rgba(0, 80, 180, 0.2)'
    ctx.globalCompositeOperation = 'overlay'
    ctx.fillRect(0, 0, width, height)

    // radial vignette
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.3,
      width / 2,
      height / 2,
      width * 0.7,
    )
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.5)')
    ctx.fillStyle = gradient
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillRect(0, 0, width, height)
  }

  // Soft dark vignette for subtle contrast
  if (filter === 'london') {
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.5,
      width / 2,
      height / 2,
      width * 0.8,
    )
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.25)')
    ctx.fillStyle = gradient
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillRect(0, 0, width, height)
  }

  // Strong dark vignette, dramatic effect
  if (filter === 'nyc') {
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.4,
      width / 2,
      height / 2,
      width * 0.8,
    )
    gradient.addColorStop(0, 'rgba(0,0,0,0)')
    gradient.addColorStop(1, 'rgba(0,0,0,0.7)')
    ctx.fillStyle = gradient
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillRect(0, 0, width, height)
  }

  // Reset composite mode
  ctx.globalCompositeOperation = 'source-over'
}
