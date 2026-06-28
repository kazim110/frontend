export function permissionNames(permissions) {
  return permissions.map((permission) => permission.name)
}

export function toggleValue(values, value) {
  if (values.includes(value)) {
    return values.filter((item) => item !== value)
  }

  return [...values, value]
}
