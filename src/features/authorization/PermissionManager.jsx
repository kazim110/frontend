import { useState } from 'react'
import { getErrorMessage } from '../../services/authApi'
import { createPermission, deletePermission } from '../../services/authorizationApi'

function PermissionManager({ permissions, onChanged }) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState({ loading: false, error: '' })

  async function submit(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '' })

    try {
      await createPermission({ name })
      setName('')
      await onChanged()
      setStatus({ loading: false, error: '' })
    } catch (error) {
      setStatus({ loading: false, error: getErrorMessage(error) })
    }
  }

  async function remove(permissionId) {
    setStatus({ loading: true, error: '' })

    try {
      await deletePermission(permissionId)
      await onChanged()
      setStatus({ loading: false, error: '' })
    } catch (error) {
      setStatus({ loading: false, error: getErrorMessage(error) })
    }
  }

  return (
    <section className="manager-section">
      <div className="section-heading">
        <h2>Permissions</h2>
        <span>{permissions.length}</span>
      </div>

      <form className="inline-form" onSubmit={submit}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="permission name"
          required
        />
        <button className="primary-button compact-button" type="submit" disabled={status.loading}>
          Add
        </button>
      </form>

      {status.error && <p className="error">{status.error}</p>}

      <div className="chip-list">
        {permissions.map((permission) => (
          <span className="chip" key={permission.id}>
            {permission.name}
            <button type="button" onClick={() => remove(permission.id)} aria-label="Delete permission">
              x
            </button>
          </span>
        ))}
      </div>
    </section>
  )
}

export default PermissionManager
