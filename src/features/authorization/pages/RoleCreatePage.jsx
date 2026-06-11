import { useState } from 'react'
import { getErrorMessage } from '../../../services/authApi'
import { createRole } from '../../../services/authorizationApi'
import { roleListPath } from '../roleRoutes'
import RolePageLayout from '../RolePageLayout'
import RoleFormFields from '../RoleFormFields'

function RoleCreatePage({ permissions, onChanged, onNavigate }) {
  const [name, setName] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [status, setStatus] = useState({ loading: false, error: '' })

  async function submit(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '' })

    try {
      await createRole({ name, permissions: selectedPermissions })
      setName('')
      setSelectedPermissions([])
      await onChanged()
      onNavigate(roleListPath())
    } catch (error) {
      setStatus({ loading: false, error: getErrorMessage(error) })
      return
    }

    setStatus({ loading: false, error: '' })
  }

  return (
    <RolePageLayout
      title="Create role"
      description="Create a new role and assign permissions on a dedicated page."
      actions={
        <div className="page-actions">
          <button className="secondary-button compact-button" type="button" onClick={() => onNavigate(roleListPath())}>
            Back to list
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
        />
        {status.error && <p className="error">{status.error}</p>}
        <button className="primary-button compact-button" type="submit" disabled={status.loading}>
          {status.loading ? 'Creating...' : 'Create role'}
        </button>
      </form>
    </RolePageLayout>
  )
}

export default RoleCreatePage
