import AboutSection from './AboutSection'
import ContactSection from './ContactSection'
import ContractsSection from './ContractsSection'
import CustomersSection from './CustomersSection'

function LandingPage({ children }) {
  return (
    <main className="landing-page">
      <section className="landing-hero" id="home">
        <div className="landing-hero-copy">
          <p className="eyebrow">Digital agency</p>
          <h1>Building digital products, brands, and secure workspaces.</h1>
          <p>
            Dorna helps teams launch polished websites, authenticated platforms, and operational
            tools with role-based access from day one.
          </p>
          <div className="landing-actions">
            <a className="primary-button hero-button" href="#contact">
              Start project
            </a>
            <a className="secondary-button hero-button" href="#about">
              Explore agency
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-card hero-card-main">
            <span>Strategy</span>
            <strong>92%</strong>
            <small>delivery confidence</small>
          </div>
          <div className="hero-card hero-card-alt">
            <span>Access</span>
            <strong>Roles</strong>
            <small>permissions ready</small>
          </div>
        </div>
      </section>

      <AboutSection />
      <CustomersSection />
      <ContractsSection />
      <ContactSection>{children}</ContactSection>
    </main>
  )
}

export default LandingPage
