import { toggleValue } from './roleFormUtils'

export function PermissionCheckboxes({ permissions, selected, onChange, emptyMessage }) {
  if (permissions.length === 0) {
    return <p className="muted small-text">{emptyMessage}</p>
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

function RoleFormFields({
  name,
  onNameChange,
  permissions,
  selectedPermissions,
  onSelectedPermissionsChange,
  namePlaceholder = 'role name',
  emptyMessage = 'Create permissions first, then assign them to roles.',
}) {
  return (
    <>
      <input
        type="text"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        placeholder={namePlaceholder}
        required
      />
      <PermissionCheckboxes
        permissions={permissions}
        selected={selectedPermissions}
        onChange={onSelectedPermissionsChange}
        emptyMessage={emptyMessage}
      />
    </>
  )
}

export { RoleFormFields }
export default RoleFormFields
