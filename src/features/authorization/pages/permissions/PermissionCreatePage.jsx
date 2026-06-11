import { useState } from 'react'
import { getErrorMessage } from '../../../../services/authApi'
import { createPermission } from '../../../../services/authorizationApi'
import { permissionDetailsPath, permissionListPath } from '../../permissionRoutes'
import RolePageLayout from '../../RolePageLayout'

function PermissionCreatePage({ onChanged, onNavigate }) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState({ loading: false, error: '' })

  async function submit(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '' })

    try {
      const data = await createPermission({ name })
      setName('')
      await onChanged()
      onNavigate(permissionDetailsPath(data.permission.id))
    } catch (error) {
      setStatus({ loading: false, error: getErrorMessage(error) })
      return
    }

    setStatus({ loading: false, error: '' })
  }

  return (
    <RolePageLayout
      title="Create permission"
      description="Add a new permission on its own page."
      actions={
        <div className="page-actions">
          <button className="secondary-button compact-button" type="button" onClick={() => onNavigate(permissionListPath())}>
            Back to list
          </button>
        </div>
      }
    >
      <form className="role-editor" onSubmit={submit}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="permission name"
          required
        />
        {status.error && <p className="error">{status.error}</p>}
        <button className="primary-button compact-button" type="submit" disabled={status.loading}>
          {status.loading ? 'Creating...' : 'Create permission'}
        </button>
      </form>
    </RolePageLayout>
  )
}

export default PermissionCreatePage
