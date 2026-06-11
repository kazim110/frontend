import { getErrorMessage } from '../../../services/authApi'
import { deletePermission } from '../../../services/authorizationApi'
import { permissionCreatePath, permissionDetailsPath, permissionListPath } from '../permissionRoutes'
import RolePageLayout from '../RolePageLayout'

function PermissionListPage({ permissions, onNavigate, onChanged }) {
  async function remove(permissionId) {
    try {
      await deletePermission(permissionId)
      await onChanged()
    } catch (error) {
      window.alert(getErrorMessage(error))
    }
  }

  return (
    <RolePageLayout
      title="Permissions"
      description="List permissions on their own page, then create or inspect one from there."
      actions={
        <div className="page-actions">
          <button className="secondary-button compact-button" type="button" onClick={() => onNavigate(permissionListPath())}>
            Refresh list
          </button>
          <button className="primary-button compact-button" type="button" onClick={() => onNavigate(permissionCreatePath())}>
            Create permission
          </button>
        </div>
      }
    >
      <div className="role-list">
        {permissions.map((permission) => (
          <article className="role-card" key={permission.id}>
            <div className="role-card-header">
              <div>
                <h3>{permission.name}</h3>
                <p className="muted small-text">Guard: {permission.guard_name || 'web'}</p>
              </div>
              <div className="action-row">
                <button
                  className="text-button compact-button"
                  type="button"
                  onClick={() => onNavigate(permissionDetailsPath(permission.id))}
                >
                  Details
                </button>
                <button
                  className="text-button danger-button compact-button"
                  type="button"
                  onClick={() => remove(permission.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </RolePageLayout>
  )
}

export default PermissionListPage
