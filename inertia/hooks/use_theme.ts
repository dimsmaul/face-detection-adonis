import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  const storedTheme = localStorage.getItem('theme') as Theme | null
  if (storedTheme) return storedTheme

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export const useThemeStore = create<ThemeState>((set) => {
  const initialTheme = getInitialTheme()

  // Apply class to <html> element
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')
    localStorage.setItem('theme', initialTheme)
  }

  return {
    theme: initialTheme,
    toggleTheme: () =>
      set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark'

        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', newTheme === 'dark')
          localStorage.setItem('theme', newTheme)
        }

        return { theme: newTheme }
      }),
    setTheme: (theme) =>
      set(() => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark')
          localStorage.setItem('theme', theme)
        }
        return { theme }
      }),
  }
})
