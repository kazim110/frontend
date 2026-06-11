import { userRoleEditPath, userRoleListPath } from '../../userRoleRoutes'
import RolePageLayout from '../../RolePageLayout'

function UserRoleDetailsPage({ user, onNavigate }) {
  if (!user) {
    return (
      <RolePageLayout
        title="User role details"
        description="No synced user snapshot is available yet. Open the edit page to update a user's roles first."
        actions={
          <div className="page-actions">
            <button className="secondary-button compact-button" type="button" onClick={() => onNavigate(userRoleListPath())}>
              Back to list
            </button>
            <button className="primary-button compact-button" type="button" onClick={() => onNavigate(userRoleEditPath())}>
              Sync user roles
            </button>
          </div>
        }
      />
    )
  }

  return (
    <RolePageLayout
      title={`User ${user.id}`}
      description="Inspect the latest user-role sync result."
      actions={
        <div className="page-actions">
          <button className="secondary-button compact-button" type="button" onClick={() => onNavigate(userRoleListPath())}>
            Back to list
          </button>
          <button className="primary-button compact-button" type="button" onClick={() => onNavigate(userRoleEditPath(user.id))}>
            Edit roles
          </button>
        </div>
      }
    >
      <dl className="role-details-grid">
        <div>
          <dt>Name</dt>
          <dd>{user.name}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>Roles</dt>
          <dd>{(user.roles || []).join(', ') || 'None'}</dd>
        </div>
      </dl>

      <div className="chip-list">
        {(user.roles || []).map((role) => (
          <span className="chip muted-chip" key={role}>
            {role}
          </span>
        ))}
      </div>
    </RolePageLayout>
  )
}

export default UserRoleDetailsPage
