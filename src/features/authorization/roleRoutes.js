const ROLE_BASE_PATH = '/login-success/roles'

function normalizePathname(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }

  return pathname
}

export function roleListPath() {
  return ROLE_BASE_PATH
}

export function roleCreatePath() {
  return `${ROLE_BASE_PATH}/create`
}

export function roleDetailsPath(roleId) {
  return `${ROLE_BASE_PATH}/${roleId}`
}

export function roleEditPath(roleId) {
  return `${ROLE_BASE_PATH}/${roleId}/edit`
}

export function parseRolePath(pathname) {
  const normalizedPath = normalizePathname(pathname)

  if (normalizedPath === ROLE_BASE_PATH) {
    return { page: 'list' }
  }

  if (normalizedPath === `${ROLE_BASE_PATH}/create`) {
    return { page: 'create' }
  }

  const editMatch = normalizedPath.match(/^\/login-success\/roles\/([^/]+)\/edit$/)
  if (editMatch) {
    return { page: 'edit', roleId: editMatch[1] }
  }

  const detailsMatch = normalizedPath.match(/^\/login-success\/roles\/([^/]+)$/)
  if (detailsMatch) {
    return { page: 'details', roleId: detailsMatch[1] }
  }

  return { page: 'overview' }
}
