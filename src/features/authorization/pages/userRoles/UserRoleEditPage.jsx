import { useState } from 'react'
import { getErrorMessage } from '../../../../services/authApi'
import { syncUserRoles } from '../../../../services/authorizationApi'
import { userRoleDetailsPath, userRoleListPath } from '../../userRoleRoutes'
import RolePageLayout from '../../RolePageLayout'

function UserRoleEditPage({ roles, onNavigate, onChanged, onSynced }) {
  const [userId, setUserId] = useState('')
  const [selectedRoles, setSelectedRoles] = useState([])
  const [status, setStatus] = useState({ loading: false, error: '' })

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
    setStatus({ loading: true, error: '' })

    try {
      const data = await syncUserRoles(userId, selectedRoles)
      onSynced(data.user)
      await onChanged()
      onNavigate(userRoleDetailsPath(userId))
    } catch (error) {
      setStatus({ loading: false, error: getErrorMessage(error) })
      return
    }

    setStatus({ loading: false, error: '' })
  }

  return (
    <RolePageLayout
      title="Sync user roles"
      description="Update a user's role assignment on its own page."
      actions={
        <div className="page-actions">
          <button className="secondary-button compact-button" type="button" onClick={() => onNavigate(userRoleListPath())}>
            Back to list
          </button>
        </div>
      }
    >
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
              <input type="checkbox" checked={selectedRoles.includes(role.name)} onChange={() => toggleRole(role.name)} />
              <span>{role.name}</span>
            </label>
          ))}
        </div>

        {status.error && <p className="error">{status.error}</p>}

        <button className="primary-button compact-button" type="submit" disabled={status.loading}>
          {status.loading ? 'Updating...' : 'Update user roles'}
        </button>
      </form>
    </RolePageLayout>
  )
}

export default UserRoleEditPage
