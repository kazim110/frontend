import { parsePermissionPath } from './permissionRoutes'
import { parseRolePath } from './roleRoutes'
import { parseUserRolePath } from './userRoleRoutes'

function normalizePathname(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }

  return pathname
}

export function parseAuthorizationPath(pathname) {
  const normalizedPath = normalizePathname(pathname)

  if (normalizedPath === '/login-success') {
    return { section: 'overview', page: 'overview' }
  }

  if (normalizedPath.startsWith('/login-success/roles')) {
    return { section: 'roles', ...parseRolePath(normalizedPath) }
  }

  if (normalizedPath.startsWith('/login-success/permissions')) {
    return { section: 'permissions', ...parsePermissionPath(normalizedPath) }
  }

  if (normalizedPath.startsWith('/login-success/user-roles')) {
    return { section: 'userRoles', ...parseUserRolePath(normalizedPath) }
  }

  return { section: 'overview', page: 'overview' }
}
