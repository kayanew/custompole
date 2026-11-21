import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FiGithub } from 'react-icons/fi'
import { content } from '../data/content.js'
import { projects } from '../data/projects.js'

function ProjectCard({ project, index, reduceMotion }) {
  const isFeatured = project.featured

  return (
    <motion.article
      className={`project-card${isFeatured ? ' project-card-featured' : ''}`}
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.26, delay: index * 0.03 }}
    >
      <div className="project-image-link">
        <img
          className="project-image"
          src={project.image}
          width={isFeatured ? '1632' : '900'}
          height={isFeatured ? '688' : '600'}
          loading="lazy"
          decoding="async"
          alt={project.imageAlt}
        />
        <span className="project-image-index">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="project-card-content">
        <div className="project-card-copy">
          <p className="project-category">{project.category} / {content.projects.categorySuffix}</p>
          <h3>{project.title}</h3>
          <p className="project-description">{project.description}</p>
          <ul className="project-tags" aria-label="Project tags">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
        <div className="project-actions">
          <a
            className="project-action project-action-primary"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${project.title} on GitHub`}
          >
            <FiGithub aria-hidden="true" /> {content.ui.projectLink}
          </a>
        </div>
      </div>
    </motion.article>
  )
}

function Projects() {
  const reduceMotion = useReducedMotion()
  const projectCopy = content.projects

  return (
    <section className="page-section projects-section" id="projects">
      <div className="section-container projects-content">
        <div className="projects-heading">
          <div className="section-heading">
            <p className="eyebrow">
              <span className="eyebrow-index">{projectCopy.number}</span>
              <span className="eyebrow-rule" />
              {projectCopy.eyebrow.replace(/^\d+\s*\/\s*/, '')}
            </p>
            <h2>{projectCopy.title}</h2>
          </div>
          <p className="project-count">
            {String(projects.length).padStart(2, '0')} {projectCopy.count}
          </p>
        </div>

        <motion.div className="project-grid" layout>
          <AnimatePresence mode="popLayout">
            {projects.map((project, index) => (
              <ProjectCard
                project={project}
                index={index}
                key={project.title}
                reduceMotion={reduceMotion}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
