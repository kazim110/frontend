function ContactSection({ children }) {
  return (
    <section className="landing-section contact-section" id="contact">
      <div className="contact-copy">
        <p className="eyebrow">Contact us</p>
        <h2>Ready to craft solid digital products and services?</h2>
        <p>
          Create an account to enter your protected client workspace, or contact the team to plan a
          strategy call.
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
