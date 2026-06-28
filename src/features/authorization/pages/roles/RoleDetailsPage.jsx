import { getErrorMessage } from '../../../../services/authApi'
import { deleteRole } from '../../../../services/authorizationApi'
import { roleEditPath, roleListPath } from '../../roleRoutes'
import RolePageLayout from '../../RolePageLayout'

function RoleDetailsPage({ role, onChanged, onNavigate }) {
  if (!role) {
    return (
      <RolePageLayout
        title="Role not found"
        description="This role does not exist anymore or the page URL is stale."
        actions={
          <div className="page-actions">
            <button className="secondary-button compact-button" type="button" onClick={() => onNavigate(roleListPath())}>
              Back to list
            </button>
          </div>
        }
      />
    )
  }

  async function remove() {
    try {
      await deleteRole(role.id)
      await onChanged()
      onNavigate(roleListPath())
    } catch (error) {
      window.alert(getErrorMessage(error))
    }
  }

  return (
    <RolePageLayout
      title={role.name}
      description="Review the role payload and its permissions before editing it."
      actions={
        <div className="page-actions">
          <button className="secondary-button compact-button" type="button" onClick={() => onNavigate(roleListPath())}>
            Back to list
          </button>
          <button className="primary-button compact-button" type="button" onClick={() => onNavigate(roleEditPath(role.id))}>
            Edit role
          </button>
        </div>
      }
    >
      <dl className="role-details-grid">
        <div>
          <dt>ID</dt>
          <dd>{role.id}</dd>
        </div>
        <div>
          <dt>Guard</dt>
          <dd>{role.guard_name || 'web'}</dd>
        </div>
        <div>
          <dt>Permissions</dt>
          <dd>{(role.permissions || []).length}</dd>
        </div>
      </dl>

      <div className="chip-list">
        {(role.permissions || []).length === 0 ? (
          <span className="muted small-text">No permissions assigned.</span>
        ) : (
          (role.permissions || []).map((permission) => (
            <span className="chip muted-chip" key={permission.id || permission.name}>
              {permission.name}
            </span>
          ))
        )}
      </div>

      <div className="page-actions role-detail-actions">
        <button className="text-button danger-button compact-button" type="button" onClick={remove}>
          Delete role
        </button>
      </div>
    </RolePageLayout>
  )
}

export default RoleDetailsPage
