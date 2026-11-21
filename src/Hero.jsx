import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowDownRight, FiArrowUpRight } from 'react-icons/fi'
import { content } from './data/content.js'

function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="page-section hero-section" id="home">
      <div className="section-container hero-layout">
        <motion.div
          className="hero-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
        >
          <p className="eyebrow">
            <span className="eyebrow-index">01</span>
            <span className="eyebrow-rule" />
            {content.hero.eyebrow}
          </p>

          <p className="hero-byline">
            {content.name} <span>·</span> {content.role}
          </p>

          <h1>
            {content.hero.titleLead}
            <br />
            <span>{content.hero.titleAccent}</span>
          </h1>

          <p className="hero-description">{content.hero.description}</p>

          <div className="hero-actions">
            <a className="button button-primary button-download-cv" href={content.cvUrl} download={content.cvFileName}>
              {content.ui.downloadCv} <FiArrowDownRight aria-hidden="true" />
            </a>
            <a className="button button-secondary" href="#projects">
              {content.ui.viewProjects} <FiArrowDownRight aria-hidden="true" />
            </a>
            <a className="text-link" href={content.cvUrl} target="_blank" rel="noopener noreferrer">
              {content.ui.viewCv} <FiArrowUpRight aria-hidden="true" />
            </a>
          </div>

          <p className="availability-note">
            <span aria-hidden="true" />
            {content.hero.availability}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero