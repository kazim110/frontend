import { useState } from 'react'
import AuthField from '../../components/AuthField'
import { getErrorMessage, registerUser } from '../../services/authApi'

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
      const auth = await registerUser(form)
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

export default RegisterForm
