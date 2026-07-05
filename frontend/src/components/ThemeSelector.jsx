import React, { useState, useRef, useEffect } from 'react'
import useThemeStore from '../store/themeStore'

const ThemeSelector = () => {
  const { theme, themes, setTheme } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  useEffect(() => {
    // Apply theme to html element when theme changes
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme)
      // Also apply to body as fallback
      document.body.setAttribute('data-theme', theme)
    }
  }, [theme])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className='relative' ref={dropdownRef}>
      <button className='btn btn-circle btn-ghost' onClick={() => setIsOpen(!isOpen)}>🎨</button>
      {isOpen && (
        <div className='absolute right-0 top-12 z-50 bg-base-100 border border-base-300 rounded-xl shadow-lg w-48 max-h-72 overflow-y-auto'>
          {themes.map(t => (
            <button
              key={t}
              onClick={() => { setTheme(t); setIsOpen(false) }}
              className={`w-full text-left px-4 py-2 text-sm capitalize hover:bg-base-200 ${theme === t ? 'text-info font-semibold' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ThemeSelector
