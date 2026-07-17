import { useState, useEffect } from 'react'

/**
 * Persists a piece of React state to localStorage so it survives
 * hard refreshes. Falls back gracefully if localStorage is unavailable
 * (private browsing, storage quota, etc).
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch (err) {
      console.warn(`Could not read "${key}" from localStorage`, err)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn(`Could not write "${key}" to localStorage`, err)
    }
  }, [key, value])

  return [value, setValue]
}
