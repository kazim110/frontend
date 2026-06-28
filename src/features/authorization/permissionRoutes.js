const PERMISSION_BASE_PATH = '/login-success/permissions'

function normalizePathname(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }

  return pathname
}

export function permissionListPath() {
  return PERMISSION_BASE_PATH
}

export function permissionCreatePath() {
  return `${PERMISSION_BASE_PATH}/create`
}

export function permissionDetailsPath(permissionId) {
  return `${PERMISSION_BASE_PATH}/${permissionId}`
}

export function parsePermissionPath(pathname) {
  const normalizedPath = normalizePathname(pathname)

  if (normalizedPath === PERMISSION_BASE_PATH) {
    return { page: 'list' }
  }

  if (normalizedPath === `${PERMISSION_BASE_PATH}/create`) {
    return { page: 'create' }
  }

  const detailsMatch = normalizedPath.match(/^\/login-success\/permissions\/([^/]+)$/)
  if (detailsMatch) {
    return { page: 'details', permissionId: detailsMatch[1] }
  }

  return { page: 'overview' }
}
