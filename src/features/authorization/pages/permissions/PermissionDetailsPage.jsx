import { getErrorMessage } from '../../../../services/authApi'
import { deletePermission } from '../../../../services/authorizationApi'
import { permissionListPath } from '../../permissionRoutes'
import RolePageLayout from '../../RolePageLayout'

function PermissionDetailsPage({ permission, onChanged, onNavigate }) {
  if (!permission) {
    return (
      <RolePageLayout
        title="Permission not found"
        description="This permission is missing from the latest list or the URL is stale."
        actions={
          <div className="page-actions">
            <button className="secondary-button compact-button" type="button" onClick={() => onNavigate(permissionListPath())}>
              Back to list
            </button>
          </div>
        }
      />
    )
  }

  async function remove() {
    try {
      await deletePermission(permission.id)
      await onChanged()
      onNavigate(permissionListPath())
    } catch (error) {
      window.alert(getErrorMessage(error))
    }
  }

  return (
    <RolePageLayout
      title={permission.name}
      description="Review the permission payload before deleting it."
      actions={
        <div className="page-actions">
          <button className="secondary-button compact-button" type="button" onClick={() => onNavigate(permissionListPath())}>
            Back to list
          </button>
        </div>
      }
    >
      <dl className="role-details-grid">
        <div>
          <dt>ID</dt>
          <dd>{permission.id}</dd>
        </div>
        <div>
          <dt>Guard</dt>
          <dd>{permission.guard_name || 'web'}</dd>
        </div>
        <div>
          <dt>Name</dt>
          <dd>{permission.name}</dd>
        </div>
      </dl>

      <div className="page-actions role-detail-actions">
        <button className="text-button danger-button compact-button" type="button" onClick={remove}>
          Delete permission
        </button>
      </div>
    </RolePageLayout>
  )
}

export default PermissionDetailsPage
