import { useCallback, useEffect, useMemo, useState } from 'react'
import { getErrorMessage } from '../../services/authApi'
import { fetchPermissions, fetchRoles } from '../../services/authorizationApi'
import PermissionManager from './PermissionManager'
import UserRoleSyncForm from './UserRoleSyncForm'
import RoleCreatePage from './pages/RoleCreatePage'
import RoleDetailsPage from './pages/RoleDetailsPage'
import RoleEditPage from './pages/RoleEditPage'
import RoleListPage from './pages/RoleListPage'
import RolePageLayout from './RolePageLayout'
import { parseRolePath, roleCreatePath, roleListPath } from './roleRoutes'

function AuthorizationOverview({ roles, permissions, onChanged, onNavigate }) {
  return (
    <div className="manager-grid">
      <PermissionManager permissions={permissions} onChanged={onChanged} />
      <UserRoleSyncForm roles={roles} />
      <RolePageLayout
        title="Roles"
        description="Open role management on dedicated pages for listing, details, creation, and edits."
        actions={
          <div className="page-actions">
            <button className="secondary-button compact-button" type="button" onClick={() => onNavigate(roleListPath())}>
              Open list
            </button>
            <button className="primary-button compact-button" type="button" onClick={() => onNavigate(roleCreatePath())}>
              Create role
            </button>
          </div>
        }
      >
        <div className="role-summary-grid">
          <div>
            <strong>{roles.length}</strong>
            <span>roles available</span>
          </div>
          <div>
            <strong>{permissions.length}</strong>
            <span>permissions available</span>
          </div>
        </div>
        <button className="text-button compact-button" type="button" onClick={() => onNavigate(roleListPath())}>
          Go to the role list
        </button>
      </RolePageLayout>
    </div>
  )
}

function AuthorizationManager() {
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [status, setStatus] = useState({ loading: true, error: '' })
  const [pathname, setPathname] = useState(() => window.location.pathname)

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

  useEffect(() => {
    function handlePopState() {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const route = useMemo(() => parseRolePath(pathname), [pathname])

  function navigate(nextPath) {
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath)
    }

    setPathname(nextPath)
  }

  const currentRole = roles.find((role) => String(role.id) === String(route.roleId))

  function renderRolePage() {
    if (route.page === 'create') {
      return <RoleCreatePage permissions={permissions} onChanged={loadAuthorization} onNavigate={navigate} />
    }

    if (route.page === 'details') {
      return <RoleDetailsPage role={currentRole} onChanged={loadAuthorization} onNavigate={navigate} />
    }

    if (route.page === 'edit') {
      return (
        <RoleEditPage
          key={currentRole?.id || route.roleId}
          role={currentRole}
          permissions={permissions}
          onChanged={loadAuthorization}
          onNavigate={navigate}
        />
      )
    }

    return <RoleListPage roles={roles} onChanged={loadAuthorization} onNavigate={navigate} />
  }

  return (
    <section className="authorization-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Spatie permission</p>
          <h2>Authorization</h2>
        </div>
        <div className="page-actions">
          <button className="secondary-button compact-button" type="button" onClick={loadAuthorization}>
            Refresh
          </button>
          {route.page !== 'overview' && (
            <button className="text-button compact-button" type="button" onClick={() => navigate('/login-success')}>
              Back to overview
            </button>
          )}
        </div>
      </div>

      {status.loading && <p className="muted">Loading roles and permissions...</p>}
      {status.error && <p className="error">{status.error}</p>}

      {!status.loading && (
        <>{route.page === 'overview' ? <AuthorizationOverview roles={roles} permissions={permissions} onChanged={loadAuthorization} onNavigate={navigate} /> : renderRolePage()}</>
      )}
    </section>
  )
}

export default AuthorizationManager
