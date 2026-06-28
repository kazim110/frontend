function Header({ auth }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Dorna</p>
        <h1>{auth ? 'Access control workspace' : 'Digital agency studio'}</h1>
      </div>
      <div className="app-header-meta">
        <span className="status-pill">{auth ? 'Signed in' : 'Guest view'}</span>
        <span className="app-header-note">
          {auth ? 'Separate pages for auth, roles, permissions, and user roles.' : 'Websites, products, contracts, and secure client portals.'}
        </span>
      </div>
    </header>
  )
}

export default Header
