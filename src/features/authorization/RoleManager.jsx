import { useState } from 'react'
import { getErrorMessage } from '../../services/authApi'
import { createRole, deleteRole, updateRole } from '../../services/authorizationApi'

function permissionNames(permissions) {
  return permissions.map((permission) => permission.name)
}

function toggleValue(values, value) {
  if (values.includes(value)) {
    return values.filter((item) => item !== value)
  }

  return [...values, value]
}

function PermissionCheckboxes({ permissions, selected, onChange }) {
  if (permissions.length === 0) {
    return <p className="muted small-text">Create permissions first, then assign them to roles.</p>
  }

  return (
    <div className="checkbox-grid">
      {permissions.map((permission) => (
        <label key={permission.id}>
          <input
            type="checkbox"
            checked={selected.includes(permission.name)}
            onChange={() => onChange(toggleValue(selected, permission.name))}
          />
          <span>{permission.name}</span>
        </label>
      ))}
    </div>
  )
}

function RoleEditor({ role, permissions, onChanged, onCancel }) {
  const [name, setName] = useState(role.name)
  const [selectedPermissions, setSelectedPermissions] = useState(permissionNames(role.permissions || []))
  const [status, setStatus] = useState({ loading: false, error: '' })

  async function submit(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '' })

    try {
      await updateRole(role.id, { name, permissions: selectedPermissions })
      await onChanged()
      onCancel()
    } catch (error) {
      setStatus({ loading: false, error: getErrorMessage(error) })
      return
    }

    setStatus({ loading: false, error: '' })
  }

  return (
    <form className="role-editor" onSubmit={submit}>
      <input type="text" value={name} onChange={(event) => setName(event.target.value)} required />
      <PermissionCheckboxes
        permissions={permissions}
        selected={selectedPermissions}
        onChange={setSelectedPermissions}
      />
      {status.error && <p className="error">{status.error}</p>}
      <div className="action-row">
        <button className="primary-button compact-button" type="submit" disabled={status.loading}>
          Save
        </button>
        <button className="text-button compact-button" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function RoleManager({ roles, permissions, onChanged }) {
  const [name, setName] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [editingRoleId, setEditingRoleId] = useState(null)
  const [status, setStatus] = useState({ loading: false, error: '' })

  async function submit(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '' })

    try {
      await createRole({ name, permissions: selectedPermissions })
      setName('')
      setSelectedPermissions([])
      await onChanged()
      setStatus({ loading: false, error: '' })
    } catch (error) {
      setStatus({ loading: false, error: getErrorMessage(error) })
    }
  }

  async function remove(roleId) {
    setStatus({ loading: true, error: '' })

    try {
      await deleteRole(roleId)
      await onChanged()
      setStatus({ loading: false, error: '' })
    } catch (error) {
      setStatus({ loading: false, error: getErrorMessage(error) })
    }
  }

  return (
    <section className="manager-section">
      <div className="section-heading">
        <h2>Roles</h2>
        <span>{roles.length}</span>
      </div>

      <form className="role-editor" onSubmit={submit}>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="role name"
          required
        />
        <PermissionCheckboxes
          permissions={permissions}
          selected={selectedPermissions}
          onChange={setSelectedPermissions}
        />
        <button className="primary-button compact-button" type="submit" disabled={status.loading}>
          Create role
        </button>
      </form>

      {status.error && <p className="error">{status.error}</p>}

      <div className="role-list">
        {roles.map((role) => (
          <article className="role-card" key={role.id}>
            {editingRoleId === role.id ? (
              <RoleEditor
                role={role}
                permissions={permissions}
                onChanged={onChanged}
                onCancel={() => setEditingRoleId(null)}
              />
            ) : (
              <>
                <div className="role-card-header">
                  <h3>{role.name}</h3>
                  <div className="action-row">
                    <button
                      className="text-button compact-button"
                      type="button"
                      onClick={() => setEditingRoleId(role.id)}
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
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export default RoleManager
