function ContactSection({ children }) {
  return (
    <section className="landing-section contact-section" id="contact">
      <div className="contact-copy">
        <p className="eyebrow">Contact us</p>
        <h2>Start a workspace or talk to the team.</h2>
        <p>
          Create an account to enter the protected dashboard, or send a project note and we will
          shape the next step with you.
        </p>
        <a className="contact-link" href="mailto:hello@dorna.local">
          hello@dorna.local
        </a>
      </div>

      <div className="contact-auth" id="auth">
        {children}
      </div>
    </section>
  )
}

export default ContactSection
