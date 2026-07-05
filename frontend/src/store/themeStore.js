import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { THEMES } from '../constraints'

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      themes: THEMES,
      setTheme: (newTheme) => {
        if (THEMES.includes(newTheme)) {
          set({ theme: newTheme })
          document.documentElement.setAttribute('data-theme', newTheme)
        }
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light'
        set({ theme: newTheme })
        document.documentElement.setAttribute('data-theme', newTheme)
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useThemeStore
