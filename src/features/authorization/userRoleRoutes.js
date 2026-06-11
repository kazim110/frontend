const USER_ROLE_BASE_PATH = '/login-success/user-roles'

function normalizePathname(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }

  return pathname
}

export function userRoleListPath() {
  return USER_ROLE_BASE_PATH
}

export function userRoleEditPath(userId = '') {
  return userId ? `${USER_ROLE_BASE_PATH}/${userId}/edit` : `${USER_ROLE_BASE_PATH}/edit`
}

export function userRoleDetailsPath(userId) {
  return `${USER_ROLE_BASE_PATH}/${userId}`
}

export function parseUserRolePath(pathname) {
  const normalizedPath = normalizePathname(pathname)

  if (normalizedPath === USER_ROLE_BASE_PATH) {
    return { page: 'list' }
  }

  if (normalizedPath === `${USER_ROLE_BASE_PATH}/edit`) {
    return { page: 'edit' }
  }

  const editMatch = normalizedPath.match(/^\/login-success\/user-roles\/([^/]+)\/edit$/)
  if (editMatch) {
    return { page: 'edit', userId: editMatch[1] }
  }

  const detailsMatch = normalizedPath.match(/^\/login-success\/user-roles\/([^/]+)$/)
  if (detailsMatch) {
    return { page: 'details', userId: detailsMatch[1] }
  }

  return { page: 'overview' }
}
