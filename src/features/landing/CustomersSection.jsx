const customers = ['Nexa Labs', 'Orbit Studio', 'Apex Finance', 'Helio Group']

function CustomersSection() {
  return (
    <section className="landing-section customers-section" id="customers">
      <div className="section-heading landing-heading">
        <div>
          <p className="eyebrow">Customers</p>
          <h2>Trusted by teams building serious digital products.</h2>
        </div>
        <span>24+ active partners</span>
      </div>

      <div className="customer-grid">
        {customers.map((customer) => (
          <article className="customer-card" key={customer}>
            <strong>{customer}</strong>
            <span>Product strategy, secure workflows, and delivery support.</span>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CustomersSection
