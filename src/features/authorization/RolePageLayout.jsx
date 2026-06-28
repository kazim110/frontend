function RolePageLayout({ title, description, actions, children }) {
  return (
    <section className="manager-section role-page">
      <div className="section-heading page-heading">
        <div>
          <p className="eyebrow">Spatie permission</p>
          <h2>{title}</h2>
        </div>
        {actions}
      </div>

      {description && <p className="muted role-page-description">{description}</p>}
      {children}
    </section>
  )
}

export default RolePageLayout
