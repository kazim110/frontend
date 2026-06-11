import AboutSection from './AboutSection'
import ContactSection from './ContactSection'
import ContractsSection from './ContractsSection'
import CustomersSection from './CustomersSection'

function LandingPage({ children }) {
  return (
    <main className="landing-page">
      <header className="landing-nav">
        <a className="landing-logo" href="#home">
          DORNA<span>XT</span>
        </a>
        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#customers">Customers</a>
          <a href="#contracts">Contracts</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="landing-nav-action" href="#contact">Get in touch</a>
      </header>

      <section className="landing-hero" id="home">
        <div className="landing-hero-copy">
          <p className="eyebrow">Digital agency</p>
          <h1>Business Solution by Digital <span>Agency</span></h1>
          <p>
            We craft brand systems, conversion websites, authenticated platforms, and operational
            tools that help teams move faster with confidence.
          </p>
          <div className="landing-actions">
            <a className="primary-button hero-button" href="#contact">
              Get in touch
            </a>
            <a className="secondary-button hero-button" href="#contracts">
              View contracts
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-photo"></div>
          <div className="hero-card hero-card-main">
            <span>Projects</span>
            <strong>240+</strong>
            <small>business people registered</small>
          </div>
          <div className="hero-card hero-card-alt">
            <span>Growth</span>
            <strong>2K+</strong>
            <small>software businesses</small>
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
