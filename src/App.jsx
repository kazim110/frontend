import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

axios.defaults.baseURL = API_BASE_URL
axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = true
axios.defaults.headers.common.Accept = 'application/json'

function getStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem('auth') || 'null')
  } catch {
    return null
  }
}

function storeAuth(auth) {
  if (auth?.token) {
    axios.defaults.headers.common.Authorization = `Bearer ${auth.token}`
  } else {
    delete axios.defaults.headers.common.Authorization
  }

  if (auth) {
    localStorage.setItem('auth', JSON.stringify(auth))
  } else {
    localStorage.removeItem('auth')
  }
}

function getErrorMessage(error) {
  const errors = error.response?.data?.errors

  if (errors) {
    return Object.values(errors).flat().join(' ')
  }

  return error.response?.data?.message || 'Something went wrong. Please try again.'
}

function AuthField({ label, name, type = 'text', value, onChange, autoComplete }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required
      />
    </label>
  )
}

function RegisterForm({ onAuthenticated, onSwitch }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [status, setStatus] = useState({ loading: false, error: '' })

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submit(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '' })

    try {
      await axios.get('/sanctum/csrf-cookie')
      const { data } = await axios.post('/api/register', form)
      onAuthenticated({
        user: data.user,
        token: data.token,
        message: data.message,
        redirectUrl: data.redirect_url,
      })
    } catch (error) {
      setStatus({ loading: false, error: getErrorMessage(error) })
      return
    }

    setStatus({ loading: false, error: '' })
  }

  return (
    <form className="auth-panel" onSubmit={submit}>
      <div className="panel-heading">
        <p className="eyebrow">Create account</p>
        <h1>Register</h1>
      </div>

      <AuthField
        label="Name"
        name="name"
        value={form.name}
        onChange={updateField}
        autoComplete="name"
      />
      <AuthField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={updateField}
        autoComplete="email"
      />
      <AuthField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={updateField}
        autoComplete="new-password"
      />
      <AuthField
        label="Confirm password"
        name="password_confirmation"
        type="password"
        value={form.password_confirmation}
        onChange={updateField}
        autoComplete="new-password"
      />

      {status.error && <p className="error">{status.error}</p>}

      <button className="primary-button" type="submit" disabled={status.loading}>
        {status.loading ? 'Creating account...' : 'Create account'}
      </button>

      <button className="text-button" type="button" onClick={onSwitch}>
        Already have an account? Sign in
      </button>
    </form>
  )
}

function LoginForm({ onAuthenticated, onSwitch }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState({ loading: false, error: '' })

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function submit(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '' })

    try {
      await axios.get('/sanctum/csrf-cookie')
      const { data } = await axios.post('/api/login', form)
      onAuthenticated({
        user: data.user,
        token: data.token,
        message: data.message || 'Signed in successfully.',
        redirectUrl: data.redirect_url,
      })
    } catch (error) {
      setStatus({ loading: false, error: getErrorMessage(error) })
      return
    }

    setStatus({ loading: false, error: '' })
  }

  return (
    <form className="auth-panel" onSubmit={submit}>
      <div className="panel-heading">
        <p className="eyebrow">Welcome back</p>
        <h1>Login</h1>
      </div>

      <AuthField
        label="Email"
        name="email"
        type="email"
        value={form.email}
        onChange={updateField}
        autoComplete="email"
      />
      <AuthField
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={updateField}
        autoComplete="current-password"
      />

      {status.error && <p className="error">{status.error}</p>}

      <button className="primary-button" type="submit" disabled={status.loading}>
        {status.loading ? 'Signing in...' : 'Sign in'}
      </button>

      <button className="text-button" type="button" onClick={onSwitch}>
        Need an account? Register
      </button>
    </form>
  )
}

function Dashboard({ auth, onLogout }) {
  return (
    <section className="dashboard">
      <div className="status-pill">Authenticated</div>
      <h1>Login success</h1>
      <p className="muted">{auth.message || 'Your frontend is connected to the backend.'}</p>

      <dl className="account-list">
        <div>
          <dt>Name</dt>
          <dd>{auth.user?.name || 'Not provided'}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{auth.user?.email || 'Not provided'}</dd>
        </div>
        <div>
          <dt>Redirect URL</dt>
          <dd>{auth.redirectUrl || '/login-success'}</dd>
        </div>
      </dl>

      {auth.token && (
        <div className="token-box">
          <span>API token</span>
          <code>{auth.token}</code>
        </div>
      )}

      <button className="secondary-button" type="button" onClick={onLogout}>
        Logout
      </button>
    </section>
  )
}

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

  useEffect(() => {
    if (auth?.token) {
      axios.defaults.headers.common.Authorization = `Bearer ${auth.token}`
    }
  }, [auth])

  function handleAuthenticated(nextAuth) {
    setAuth(nextAuth)
    storeAuth(nextAuth)
    window.history.replaceState(null, '', '/login-success')
  }

  async function handleLogout() {
    try {
      await axios.post('/api/logout')
    } catch {
      // The local session still needs to be cleared if the backend is unavailable.
    }

    setAuth(null)
    storeAuth(null)
    window.history.replaceState(null, '', '/')
  }

  return (
    <main className="auth-shell">
      <section className="brand-panel" aria-label="Authentication">
        <div>
          <p className="eyebrow">Laravel Sanctum</p>
          <h2>Frontend auth flow</h2>
          <p>
            Register a user, receive the backend response, and keep the session ready for protected
            API requests.
          </p>
        </div>
      </section>

      {auth ? (
        <Dashboard auth={auth} onLogout={handleLogout} />
      ) : mode === 'register' ? (
        <RegisterForm onAuthenticated={handleAuthenticated} onSwitch={() => setMode('login')} />
      ) : (
        <LoginForm onAuthenticated={handleAuthenticated} onSwitch={() => setMode('register')} />
      )}
    </main>
  )
}

export default App
