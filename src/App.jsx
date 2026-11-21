import './App.css'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Navbar } from './Navbar.jsx'
import Hero from './Hero.jsx'
import { content } from './data/content.js'

const About = lazy(() => import('./sections/About.jsx'))
const Skills = lazy(() => import('./sections/Skills.jsx'))
const Projects = lazy(() => import('./sections/Projects.jsx'))
const Contact = lazy(() => import('./sections/Contact.jsx'))

function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    const savedTheme = window.localStorage.getItem('portfolio-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#0C1618' : '#FFFFFF',
    )
  }, [theme])

  useEffect(() => {
    document.title = content.seo.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', content.seo.description)
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute('content', content.seo.title)
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute('content', content.seo.description)
  }, [])

  useEffect(() => {
    let frameId = 0

    const updateActiveSection = () => {
      frameId = 0
      const marker = window.innerHeight * 0.35
      let nextSection = 'home'

      content.navigation.forEach(({ id }) => {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= marker) {
          nextSection = id
        }
      })

      setActiveSection(nextSection)
    }

    const scheduleUpdate = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateActiveSection)
    }

    updateActiveSection()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('hashchange', scheduleUpdate)

    const mutationObserver = new MutationObserver(scheduleUpdate)
    mutationObserver.observe(document.querySelector('main'), {
      childList: true,
      subtree: true,
    })

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('hashchange', scheduleUpdate)
      mutationObserver.disconnect()
    }
  }, [])

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === 'light' ? 'dark' : 'light'
      window.localStorage.setItem('portfolio-theme', next)
      return next
    })
  }

  return (
    <div className="portfolio-shell min-h-screen">
      <Navbar
        activeSection={activeSection}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
      <main>
        <Hero />
        <Suspense fallback={<div className="section-loading" aria-hidden="true" />}>
          <About />
          <Skills />
          <Projects />
          <Contact />
        </Suspense>
      </main>
    </div>
  )
}

export default App
