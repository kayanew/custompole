import { motion, useReducedMotion } from 'framer-motion'
import { content } from '../data/content.js'

function About() {
  const reduceMotion = useReducedMotion()
  const about = content.about

  return (
    <section className="page-section about-section" id="about">
      <div className="section-container about-layout">
        <motion.div
          className="about-photo-wrap"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.3 }}
        >
          <img
            className="about-photo"
            src={about.portrait}
            sizes="(max-width: 767px) 90vw, 42vw"
            width="343"
            height="361"
            loading="lazy"
            decoding="async"
            alt={about.portraitAlt}
          />
          <span className="photo-caption">{about.portraitCaption}</span>
        </motion.div>

        <motion.div
          className="about-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <p className="eyebrow">
            <span className="eyebrow-index">{about.number}</span>
            <span className="eyebrow-rule" />
            {about.eyebrow.replace(/^\d+\s*\/\s*/, '')}
          </p>
          <h2>{about.title}</h2>
          <p className="about-introduction">{about.introduction}</p>
          <p className="section-description">{about.description}</p>

          <dl className="about-details">
            {about.details.map(({ label, value }) => (
              <div className="about-detail" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <p className="about-note">{about.note}</p>
        </motion.div>
      </div>
    </section>
  )
}

export default About
