import { useState } from 'react'
import { getErrorMessage } from '../../../services/authApi'
import { updateRole } from '../../../services/authorizationApi'
import { roleDetailsPath, roleListPath } from '../roleRoutes'
import RolePageLayout from '../RolePageLayout'
import RoleFormFields from '../RoleFormFields'
import { permissionNames } from '../roleFormUtils'

function RoleEditPage({ role, permissions, onChanged, onNavigate }) {
  const [name, setName] = useState(role?.name || '')
  const [selectedPermissions, setSelectedPermissions] = useState(permissionNames(role?.permissions || []))
  const [status, setStatus] = useState({ loading: false, error: '' })

  if (!role) {
    return (
      <RolePageLayout
        title="Role not found"
        description="This role cannot be edited because it is missing from the latest list."
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

  async function submit(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '' })

    try {
      await updateRole(role.id, { name, permissions: selectedPermissions })
      await onChanged()
      onNavigate(roleDetailsPath(role.id))
    } catch (error) {
      setStatus({ loading: false, error: getErrorMessage(error) })
      return
    }

    setStatus({ loading: false, error: '' })
  }

  return (
    <RolePageLayout
      title={`Edit ${role.name}`}
      description="Update the role name and permissions on its own page."
      actions={
        <div className="page-actions">
          <button className="secondary-button compact-button" type="button" onClick={() => onNavigate(roleListPath())}>
            Back to list
          </button>
          <button className="secondary-button compact-button" type="button" onClick={() => onNavigate(roleDetailsPath(role.id))}>
            Details
          </button>
        </div>
      }
    >
      <form className="role-editor" onSubmit={submit}>
        <RoleFormFields
          name={name}
          onNameChange={setName}
          permissions={permissions}
          selectedPermissions={selectedPermissions}
          onSelectedPermissionsChange={setSelectedPermissions}
          namePlaceholder="role name"
        />
        {status.error && <p className="error">{status.error}</p>}
        <button className="primary-button compact-button" type="submit" disabled={status.loading}>
          {status.loading ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </RolePageLayout>
  )
}

export default RoleEditPage
