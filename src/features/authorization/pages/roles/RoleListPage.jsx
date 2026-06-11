import { getErrorMessage } from '../../../../services/authApi'
import { deleteRole } from '../../../../services/authorizationApi'
import { roleCreatePath, roleDetailsPath, roleEditPath, roleListPath } from '../../roleRoutes'
import RolePageLayout from '../../RolePageLayout'

function RoleListPage({ roles, onNavigate, onChanged }) {
  async function remove(roleId) {
    try {
      await deleteRole(roleId)
      await onChanged()
    } catch (error) {
      window.alert(getErrorMessage(error))
    }
  }

  return (
    <RolePageLayout
      title="Roles"
      description="List, inspect, create, edit, and delete roles on separate pages."
      actions={
        <div className="page-actions">
          <button className="secondary-button compact-button" type="button" onClick={() => onNavigate(roleListPath())}>
            Refresh list
          </button>
          <button className="primary-button compact-button" type="button" onClick={() => onNavigate(roleCreatePath())}>
            Create role
          </button>
        </div>
      }
    >
      <div className="role-list">
        {roles.map((role) => (
          <article className="role-card" key={role.id}>
            <div className="role-card-header">
              <div>
                <h3>{role.name}</h3>
                <p className="muted small-text">{(role.permissions || []).length} permissions</p>
              </div>
              <div className="action-row">
                <button
                  className="text-button compact-button"
                  type="button"
                  onClick={() => onNavigate(roleDetailsPath(role.id))}
                >
                  Details
                </button>
                <button
                  className="text-button compact-button"
                  type="button"
                  onClick={() => onNavigate(roleEditPath(role.id))}
                >
                  Edit
                </button>
                <button
                  className="text-button danger-button compact-button"
                  type="button"
                  onClick={() => remove(role.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="chip-list">
              {(role.permissions || []).map((permission) => (
                <span className="chip muted-chip" key={permission.id || permission.name}>
                  {permission.name}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </RolePageLayout>
  )
}

export default RoleListPage
