import { FilterName } from './ApplyCanvasFilters'

/*
 * Defines visual filters for the live video preview.

 * Each filter has:
 *  - cssFilter: CSS filter applied directly to the <video> element for live preview.
 *  - overlay (optional): a React node rendered on top of the video using mix-blend-mode
 *    to simulate color grading, lighting, or vignette effects.
 */
export const filtersWithOverlay: Record<
  FilterName,
  { cssFilter: string; overlay?: React.ReactNode }
> = {
  none: { cssFilter: 'none' },
  'grayscale(100%)': { cssFilter: 'grayscale(100%)' },

  sanfrancisco: {
    cssFilter: 'brightness(110%) contrast(110%) sepia(0.3)',
    overlay: (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          background: 'rgba(255, 223, 186, 0.15)',
          mixBlendMode: 'screen',
          borderRadius: 'inherit',
        }}
      />
    ),
  },
  tokyo: {
    cssFilter: 'brightness(105%) contrast(120%) saturate(120%)',
    overlay: (
      <>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            background: 'rgba(0, 80, 180, 0.2)',
            mixBlendMode: 'overlay',
            borderRadius: 'inherit',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%)',
            mixBlendMode: 'multiply',
            borderRadius: 'inherit',
          }}
        />
      </>
    ),
  },
  london: {
    cssFilter: 'brightness(120%) contrast(90%) blur(0.3px)',
    overlay: (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.25) 100%)',
          mixBlendMode: 'multiply',
          borderRadius: 'inherit',
        }}
      />
    ),
  },
  nyc: {
    cssFilter: 'contrast(120%) brightness(90%) saturate(80%)',
    overlay: (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          borderRadius: 'inherit',
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)',
          mixBlendMode: 'multiply',
        }}
      />
    ),
  },
}
