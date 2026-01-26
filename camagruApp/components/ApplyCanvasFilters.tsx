export type FilterName =
  | 'none'
  | 'grayscale(100%)'
  | 'sanfrancisco'
  | 'tokyo'
  | 'london'
  | 'nyc'

export function applyCanvasFilter(
  ctx: CanvasRenderingContext2D,
  filter: FilterName,
  width: number,
  height: number,
) {
  if (filter === 'grayscale(100%)') {
    const imgData = ctx.getImageData(0, 0, width, height)
    const data = imgData.data
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
      data[i] = data[i + 1] = data[i + 2] = avg
    }
    ctx.putImageData(imgData, 0, 0)
  }

  if (filter === 'tokyo') {
    // Blue overlay
    ctx.fillStyle = 'rgba(0, 80, 180, 0.2)'
    ctx.globalCompositeOperation = 'overlay'
    ctx.fillRect(0, 0, width, height)

    // Vinietka
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

  ctx.globalCompositeOperation = 'source-over'
}
