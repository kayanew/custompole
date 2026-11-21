import { content } from '../data/content.js'
import { FiMoon, FiSun } from 'react-icons/fi'

export function ThemeToggle({ theme, onToggle, className = '' }) {
  const isDark = theme === 'dark'

  return (
    <button
      className={`theme-toggle ${className}`.trim()}
      type="button"
      aria-label={`Switch to ${isDark ? content.ui.lightTheme : content.ui.darkTheme} theme`}
      aria-pressed={isDark}
      onClick={onToggle}
    >
      {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
      <span>{isDark ? content.ui.darkTheme : content.ui.lightTheme}</span>
    </button>
  )
}
