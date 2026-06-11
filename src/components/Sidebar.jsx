import { useEffect, useMemo, useState } from 'react'

const guestNavigation = [{ label: 'Auth', path: '/' }]

const appNavigation = [
  { label: 'Account', path: '/login-success', exact: true },
  { label: 'Roles', path: '/login-success/roles' },
  { label: 'Permissions', path: '/login-success/permissions' },
  { label: 'User roles', path: '/login-success/user-roles' },
]

function isActivePath(currentPath, item) {
  if (item.exact) {
    return currentPath === item.path
  }

  return currentPath === item.path || currentPath.startsWith(`${item.path}/`)
}

function Sidebar({ auth }) {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname)
  const navigation = useMemo(() => (auth ? appNavigation : guestNavigation), [auth])

  useEffect(() => {
    function handleLocationChange() {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  function handleNavigate(event, path) {
    event.preventDefault()

    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path)
    }

    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <aside className="app-sidebar" aria-label="Page navigation">
      <div className="app-sidebar-title">
        <span>Pages</span>
      </div>

      <nav className="app-sidebar-nav">
        {navigation.map((item) => (
          <a
            key={item.path}
            className={isActivePath(currentPath, item) ? 'active' : undefined}
            href={item.path}
            onClick={(event) => handleNavigate(event, item.path)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
