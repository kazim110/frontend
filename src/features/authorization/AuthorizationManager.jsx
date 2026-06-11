import { useCallback, useEffect, useMemo, useState } from 'react'
import { getErrorMessage } from '../../services/authApi'
import { fetchPermissions, fetchRoles } from '../../services/authorizationApi'
import PermissionCreatePage from './pages/permissions/PermissionCreatePage'
import PermissionDetailsPage from './pages/permissions/PermissionDetailsPage'
import PermissionListPage from './pages/permissions/PermissionListPage'
import RoleCreatePage from './pages/roles/RoleCreatePage'
import RoleDetailsPage from './pages/roles/RoleDetailsPage'
import RoleEditPage from './pages/roles/RoleEditPage'
import RoleListPage from './pages/roles/RoleListPage'
import RolePageLayout from './RolePageLayout'
import { parseAuthorizationPath } from './authorizationRoutes'
import { permissionCreatePath, permissionListPath } from './permissionRoutes'
import { parseRolePath, roleCreatePath, roleListPath } from './roleRoutes'
import UserRoleDetailsPage from './pages/userRoles/UserRoleDetailsPage'
import UserRoleEditPage from './pages/userRoles/UserRoleEditPage'
import UserRoleListPage from './pages/userRoles/UserRoleListPage'
import { userRoleEditPath, userRoleListPath } from './userRoleRoutes'

function AuthorizationOverview({ roles, permissions, onNavigate }) {
  return (
    <div className="manager-grid">
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

      <RolePageLayout
        title="Permissions"
        description="Open permission management on dedicated pages for listing, details, and creation."
        actions={
          <div className="page-actions">
            <button className="secondary-button compact-button" type="button" onClick={() => onNavigate(permissionListPath())}>
              Open list
            </button>
            <button className="primary-button compact-button" type="button" onClick={() => onNavigate(permissionCreatePath())}>
              Create permission
            </button>
          </div>
        }
      >
        <div className="role-summary-grid">
          <div>
            <strong>{permissions.length}</strong>
            <span>permissions available</span>
          </div>
          <div>
            <strong>{roles.length}</strong>
            <span>roles using permissions</span>
          </div>
        </div>
      </RolePageLayout>

      <RolePageLayout
        title="User roles"
        description="Open user-role syncing on dedicated pages for the form and the latest result."
        actions={
          <div className="page-actions">
            <button className="secondary-button compact-button" type="button" onClick={() => onNavigate(userRoleListPath())}>
              Open list
            </button>
            <button className="primary-button compact-button" type="button" onClick={() => onNavigate(userRoleEditPath())}>
              Sync user roles
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
            <strong>1</strong>
            <span>sync form</span>
          </div>
        </div>
      </RolePageLayout>
    </div>
  )
}

function AuthorizationManager() {
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [lastUserSnapshot, setLastUserSnapshot] = useState(null)
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
  const authorizationRoute = useMemo(() => parseAuthorizationPath(pathname), [pathname])

  function navigate(nextPath) {
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath)
    }

    setPathname(nextPath)
  }

  const currentRole = roles.find((role) => String(role.id) === String(route.roleId))
  const currentPermission = permissions.find((permission) => String(permission.id) === String(authorizationRoute.permissionId))
  const currentUserSnapshot =
    lastUserSnapshot && String(lastUserSnapshot.id) === String(authorizationRoute.userId) ? lastUserSnapshot : null

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

  function renderPermissionPage() {
    if (authorizationRoute.page === 'create') {
      return <PermissionCreatePage onChanged={loadAuthorization} onNavigate={navigate} />
    }

    if (authorizationRoute.page === 'details') {
      return <PermissionDetailsPage permission={currentPermission} onChanged={loadAuthorization} onNavigate={navigate} />
    }

    return <PermissionListPage permissions={permissions} onChanged={loadAuthorization} onNavigate={navigate} />
  }

  function renderUserRolePage() {
    if (authorizationRoute.page === 'details') {
      return <UserRoleDetailsPage user={currentUserSnapshot} onNavigate={navigate} />
    }

    if (authorizationRoute.page === 'edit') {
      return (
        <UserRoleEditPage
          roles={roles}
          onChanged={loadAuthorization}
          onNavigate={navigate}
          onSynced={setLastUserSnapshot}
        />
      )
    }

    return <UserRoleListPage roles={roles} lastUpdate={lastUserSnapshot} onNavigate={navigate} />
  }

  function renderSectionPage() {
    if (authorizationRoute.section === 'roles') {
      return renderRolePage()
    }

    if (authorizationRoute.section === 'permissions') {
      return renderPermissionPage()
    }

    if (authorizationRoute.section === 'userRoles') {
      return renderUserRolePage()
    }

    return <AuthorizationOverview roles={roles} permissions={permissions} onNavigate={navigate} />
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
        <>{authorizationRoute.section === 'overview' ? <AuthorizationOverview roles={roles} permissions={permissions} onNavigate={navigate} /> : renderSectionPage()}</>
      )}
    </section>
  )
}

export default AuthorizationManager
