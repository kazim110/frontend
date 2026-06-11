function Header({ auth }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Dorna</p>
        <h1>Access control workspace</h1>
      </div>
      <div className="app-header-meta">
        <span className="status-pill">{auth ? 'Signed in' : 'Guest view'}</span>
        <span className="app-header-note">Separate pages for auth, roles, permissions, and user roles.</span>
      </div>
    </header>
  )
}

export default Header
