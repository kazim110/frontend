import AuthorizationManager from '../authorization/AuthorizationManager'

function Dashboard({ auth, onLogout }) {
  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <div>
          <div className="status-pill">Authenticated</div>
          <h1>Login success</h1>
          <p className="muted">{auth.message || 'Your frontend is connected to the backend.'}</p>
        </div>
        <button className="secondary-button compact-button" type="button" onClick={onLogout}>
          Logout
        </button>
      </div>

      <dl className="account-list">
        <div>
          <dt>Name</dt>
          <dd>{auth.user?.name || 'Not provided'}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{auth.user?.email || 'Not provided'}</dd>
        </div>
        <div>
          <dt>Redirect URL</dt>
          <dd>{auth.redirectUrl || '/login-success'}</dd>
        </div>
      </dl>

      {auth.token && (
        <div className="token-box">
          <span>API token</span>
          <code>{auth.token}</code>
        </div>
      )}

      <AuthorizationManager />
    </section>
  )
}

export default Dashboard
