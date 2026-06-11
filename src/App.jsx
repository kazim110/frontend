import { useEffect, useMemo, useState } from 'react'
import BrandPanel from './features/auth/BrandPanel'
import Dashboard from './features/auth/Dashboard'
import LoginForm from './features/auth/LoginForm'
import RegisterForm from './features/auth/RegisterForm'
import AppLayout from './components/AppLayout'
import { logoutUser } from './services/authApi'
import { getStoredAuth, storeAuth } from './services/authStorage'
import './App.css'

function App() {
  const [mode, setMode] = useState('register')
  const [auth, setAuth] = useState(() => getStoredAuth())

  const title = useMemo(() => {
    if (auth) return 'Account'
    return mode === 'register' ? 'Register' : 'Login'
  }, [auth, mode])

  useEffect(() => {
    document.title = `${title} | Auth`
  }, [title])

  function handleAuthenticated(nextAuth) {
    setAuth(nextAuth)
    storeAuth(nextAuth)
    window.history.replaceState(null, '', '/login-success')
  }

  async function handleLogout() {
    try {
      await logoutUser()
    } catch {
      // The local session still needs to be cleared if the backend is unavailable.
    }

    setAuth(null)
    storeAuth(null)
    window.history.replaceState(null, '', '/')
  }

  return (
    <AppLayout auth={auth}>
      {auth ? (
        <main className="auth-shell dashboard-shell">
          <Dashboard auth={auth} onLogout={handleLogout} />
        </main>
      ) : (
        <main className="auth-shell">
          <BrandPanel />

          {mode === 'register' ? (
            <RegisterForm onAuthenticated={handleAuthenticated} onSwitch={() => setMode('login')} />
          ) : (
            <LoginForm onAuthenticated={handleAuthenticated} onSwitch={() => setMode('register')} />
          )}
        </main>
      )}
    </AppLayout>
  )
}

export default App
