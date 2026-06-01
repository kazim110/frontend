import { setAuthToken } from './http'

const STORAGE_KEY = 'auth'

export function getStoredAuth() {
  try {
    const auth = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    setAuthToken(auth?.token)
    return auth
  } catch {
    return null
  }
}

export function storeAuth(auth) {
  setAuthToken(auth?.token)

  if (auth) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}
