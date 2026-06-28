import { useState } from 'react'
import { getErrorMessage } from '../../services/authApi'
import { syncUserRoles } from '../../services/authorizationApi'

function UserRoleSyncForm({ roles }) {
  const [userId, setUserId] = useState('')
  const [selectedRoles, setSelectedRoles] = useState([])
  const [status, setStatus] = useState({ loading: false, error: '', message: '', user: null })

  function toggleRole(roleName) {
    setSelectedRoles((current) => {
      if (current.includes(roleName)) {
        return current.filter((name) => name !== roleName)
      }

      return [...current, roleName]
    })
  }

  async function submit(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '', message: '', user: null })

    try {
      const data = await syncUserRoles(userId, selectedRoles)
      setStatus({ loading: false, error: '', message: data.message, user: data.user })
    } catch (error) {
      setStatus({ loading: false, error: getErrorMessage(error), message: '', user: null })
    }
  }

  return (
    <section className="manager-section">
      <div className="section-heading">
        <h2>User roles</h2>
      </div>

      <form className="role-editor" onSubmit={submit}>
        <input
          type="number"
          min="1"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          placeholder="user id"
          required
        />

        <div className="checkbox-grid">
          {roles.map((role) => (
            <label key={role.id}>
              <input
                type="checkbox"
                checked={selectedRoles.includes(role.name)}
                onChange={() => toggleRole(role.name)}
              />
              <span>{role.name}</span>
            </label>
          ))}
        </div>

        {status.error && <p className="error">{status.error}</p>}
        {status.message && <p className="success">{status.message}</p>}

        {status.user && (
          <div className="token-box">
            <span>Updated user</span>
            <code>{JSON.stringify(status.user, null, 2)}</code>
          </div>
        )}

        <button className="primary-button compact-button" type="submit" disabled={status.loading}>
          {status.loading ? 'Updating...' : 'Update user roles'}
        </button>
      </form>
    </section>
  )
}

export default UserRoleSyncForm
