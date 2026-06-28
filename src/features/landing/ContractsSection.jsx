const contracts = [
  {
    title: 'Discovery sprint',
    meta: '2 weeks',
    description: 'Map the product, users, data, and technical risks before development starts.',
  },
  {
    title: 'Build contract',
    meta: 'Monthly',
    description: 'Design and ship frontend, backend, and role-based admin workflows together.',
  },
  {
    title: 'Support retainer',
    meta: 'Ongoing',
    description: 'Keep releases, permissions, integrations, and improvements moving after launch.',
  },
]

function ContractsSection() {
  return (
    <section className="landing-section contracts-section" id="contracts">
      <div className="section-heading landing-heading">
        <div>
          <p className="eyebrow">Contracts</p>
          <h2>Follow these steps to expand your business.</h2>
        </div>
      </div>

      <div className="contract-grid">
        {contracts.map((contract) => (
          <article className="contract-card" key={contract.title}>
            <span>{contract.meta}</span>
            <h3>{contract.title}</h3>
            <p>{contract.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ContractsSection
