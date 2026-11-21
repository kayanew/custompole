import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowUpRight, FiMail } from 'react-icons/fi'
import { content } from '../data/content.js'
import { SocialLinks } from '../components/SocialLinks.jsx'

const currentYear = new Date().getFullYear()

function Contact() {
  const reduceMotion = useReducedMotion()
  const contact = content.contact

  return (
    <section className="page-section contact-section" id="contact">
      <div className="section-container contact-content">
        <div className="contact-main">
          <motion.div
            className="contact-copy"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.3 }}
          >
            <p className="eyebrow">
              <span className="eyebrow-index">{contact.number}</span>
              <span className="eyebrow-rule" />
              {contact.eyebrow.replace(/^\d+\s*\/\s*/, '')}
            </p>
            <h2>{contact.title}</h2>
            <p className="section-description">
              {contact.description}
              <br />
              {contact.supportingText}
            </p>
          </motion.div>

          <motion.div
            className="contact-card"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.3, delay: 0.06 }}
          >
            <p className="contact-card-eyebrow">{contact.cardEyebrow}</p>
            <h3>{contact.cardTitle}</h3>
            <a className="contact-email" href={`mailto:${content.email}`}>
              {content.email} <FiArrowUpRight aria-hidden="true" />
            </a>
            <p className="contact-availability">
              <span aria-hidden="true" />
              {contact.availability}
            </p>
            <a className="contact-mail-button" href={`mailto:${content.email}`}>
              <FiMail aria-hidden="true" /> {content.ui.sayHello}
            </a>
          </motion.div>
        </div>

        <footer className="site-footer">
          <div className="contact-social">
            <p className="contact-social-heading">{contact.socialHeading}</p>
            <SocialLinks />
          </div>
          <div className="footer-meta">
            <p>© {currentYear} {content.name} · {contact.footerNote}</p>
            <span>{contact.footerCredit}</span>
          </div>
        </footer>
      </div>
    </section>
  )
}

export default Contact
