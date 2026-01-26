import { FilterName } from './ApplyCanvasFilters'
import styles from '@/styles/AddPost.module.css'

export const FilterSelector: React.FC<{
  filters: Record<FilterName, unknown>
  current: FilterName
  onSelect: (f: FilterName) => void
  isMobile: boolean
}> = ({ filters, current, onSelect, isMobile }) => (
  <div className={styles.filterButtonsDiv}>
    {(Object.keys(filters) as FilterName[]).map((f) => (
      <button
        type="button"
        key={f}
        onClick={() => onSelect(f as FilterName)}
        aria-label={`Apply ${
          f === 'none'
            ? 'no filter'
            : f === 'grayscale(100%)'
              ? 'Paris filter'
              : f === 'sanfrancisco'
                ? 'San Francisco filter'
                : f
        } filter`}
        aria-pressed={current === f}
        className={styles.singleFilterBtn}
        style={{
          border: current === f ? '2px solid #007aff' : '1px solid #ccc',
          background: current === f ? '#e6f0ff' : 'white',
          flex: isMobile ? '1 1 calc(50% - 5px)' : '1',
          minWidth: isMobile ? 'calc(50% - 5px)' : 'auto',
        }}
      >
        {f === 'none'
          ? 'None'
          : f === 'grayscale(100%)'
            ? 'Paris'
            : f === 'sanfrancisco'
              ? 'SanFr'
              : f.charAt(0).toUpperCase() + f.slice(1)}
      </button>
    ))}
  </div>
)
