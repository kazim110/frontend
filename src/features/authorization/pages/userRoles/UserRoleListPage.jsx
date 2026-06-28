import { userRoleEditPath, userRoleListPath } from '../../userRoleRoutes'
import RolePageLayout from '../../RolePageLayout'

function UserRoleListPage({ roles, lastUpdate, onNavigate }) {
  return (
    <RolePageLayout
      title="User roles"
      description="Use a dedicated page to update a user's roles, then inspect the latest synced result."
      actions={
        <div className="page-actions">
          <button className="secondary-button compact-button" type="button" onClick={() => onNavigate(userRoleListPath())}>
            Refresh list
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
          <span>available roles</span>
        </div>
        <div>
          <strong>{lastUpdate?.id || '—'}</strong>
          <span>last synced user</span>
        </div>
      </div>

      <div className="chip-list">
        {roles.map((role) => (
          <span className="chip muted-chip" key={role.id}>
            {role.name}
          </span>
        ))}
      </div>
    </RolePageLayout>
  )
}

export default UserRoleListPage
