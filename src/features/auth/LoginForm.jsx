import { useState } from 'react'
import AuthField from '../../components/AuthField'
import { getErrorMessage, loginUser } from '../../services/authApi'

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
      const auth = await loginUser(form)
      onAuthenticated(auth)
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

export default LoginForm
