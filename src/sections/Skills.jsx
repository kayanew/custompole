import { motion, useReducedMotion } from 'framer-motion'
import { FiCode, FiPenTool } from 'react-icons/fi'
import { content } from '../data/content.js'

function Skills() {
  const reduceMotion = useReducedMotion()
  const skills = content.skills

  return (
    <section className="page-section skills-section" id="skills">
      <div className="section-container skills-content">
        <motion.div
          className="section-heading skills-heading"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3 }}
        >
          <p className="eyebrow">
            <span className="eyebrow-index">{skills.number}</span>
            <span className="eyebrow-rule" />
            {skills.eyebrow.replace(/^\d+\s*\/\s*/, '')}
          </p>
          <h2>{skills.title}</h2>
          <p className="section-description">{skills.description}</p>
        </motion.div>

        <div className="skill-grid">
          {skills.groups.map((group, index) => (
            <motion.article
              className={`skill-card${index === 1 ? ' skill-card-forest' : ''}`}
              key={group.title}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
            >
              <div className="skill-card-top">
                <div className="skill-card-heading">
                  <span>{group.number} /</span>
                  <h3>{group.title}</h3>
                </div>
                <span className="skill-card-icon" aria-hidden="true">
                  {index === 0 ? <FiPenTool /> : <FiCode />}
                </span>
              </div>
              <p>{group.description}</p>
              <ul className="tool-list" aria-label={`${group.title} tools`}>
                {group.tools.map((tool) => (
                  <li key={tool}>
                    <span className="tool-dot" aria-hidden="true" />
                    {tool}
                  </li>
                ))}
              </ul>
              <p className="skill-note">{group.note}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
