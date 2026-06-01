import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../../services/authApi'
import { fetchPermissions, fetchRoles } from '../../services/authorizationApi'
import PermissionManager from './PermissionManager'
import RoleManager from './RoleManager'
import UserRoleSyncForm from './UserRoleSyncForm'

function AuthorizationManager() {
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [status, setStatus] = useState({ loading: true, error: '' })

  const loadAuthorization = useCallback(async () => {
    setStatus({ loading: true, error: '' })

    try {
      const [nextRoles, nextPermissions] = await Promise.all([fetchRoles(), fetchPermissions()])
      setRoles(nextRoles)
      setPermissions(nextPermissions)
      setStatus({ loading: false, error: '' })
    } catch (error) {
      setStatus({ loading: false, error: getErrorMessage(error) })
    }
  }, [])

  useEffect(() => {
    let active = true

    async function loadInitialAuthorization() {
      try {
        const [nextRoles, nextPermissions] = await Promise.all([fetchRoles(), fetchPermissions()])

        if (active) {
          setRoles(nextRoles)
          setPermissions(nextPermissions)
          setStatus({ loading: false, error: '' })
        }
      } catch (error) {
        if (active) {
          setStatus({ loading: false, error: getErrorMessage(error) })
        }
      }
    }

    loadInitialAuthorization()

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="authorization-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Spatie permission</p>
          <h2>Authorization</h2>
        </div>
        <button className="secondary-button compact-button" type="button" onClick={loadAuthorization}>
          Refresh
        </button>
      </div>

      {status.loading && <p className="muted">Loading roles and permissions...</p>}
      {status.error && <p className="error">{status.error}</p>}

      {!status.loading && (
        <div className="manager-grid">
          <PermissionManager permissions={permissions} onChanged={loadAuthorization} />
          <RoleManager roles={roles} permissions={permissions} onChanged={loadAuthorization} />
          <UserRoleSyncForm roles={roles} />
        </div>
      )}
    </section>
  )
}

export default AuthorizationManager
