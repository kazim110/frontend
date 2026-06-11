const customers = ['AnyDesk', 'Alphabet', 'Microsoft', 'Ryzen', 'Puma', 'Nike']

function CustomersSection() {
  return (
    <section className="landing-section customers-section" id="customers">
      <div className="section-heading landing-heading">
        <div>
          <p className="eyebrow">Customers</p>
          <h2>Over 2K+ software businesses growing with our business.</h2>
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
