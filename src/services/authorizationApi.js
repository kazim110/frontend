import http from './http'

export async function fetchRoles() {
  const { data } = await http.get('/api/roles')
  return data.roles || []
}

export async function createRole(payload) {
  const { data } = await http.post('/api/roles', payload)
  return data
}

export async function updateRole(roleId, payload) {
  const { data } = await http.put(`/api/roles/${roleId}`, payload)
  return data
}

export async function deleteRole(roleId) {
  const { data } = await http.delete(`/api/roles/${roleId}`)
  return data
}

export async function fetchPermissions() {
  const { data } = await http.get('/api/permissions')
  return data.permissions || []
}

export async function createPermission(payload) {
  const { data } = await http.post('/api/permissions', payload)
  return data
}

export async function deletePermission(permissionId) {
  const { data } = await http.delete(`/api/permissions/${permissionId}`)
  return data
}

export async function syncUserRoles(userId, roles) {
  const { data } = await http.put(`/api/users/${userId}/roles`, { roles })
  return data
}
