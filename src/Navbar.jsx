import { useEffect, useRef, useState } from 'react'
import { FiArrowUpRight } from 'react-icons/fi'
import { content } from './data/content.js'
import { SocialLinks } from './components/SocialLinks.jsx'
import { ThemeToggle } from './components/ThemeToggle.jsx'

export function Navbar({ activeSection, theme, onThemeToggle }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const menuPanelRef = useRef(null)
  const wasOpenRef = useRef(false)
  const previousOverflowRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) {
      if (wasOpenRef.current) {
        const menuButton = menuButtonRef.current
        if (menuButton?.getClientRects().length) {
          menuButton.focus({ preventScroll: true })
        } else {
          document
            .querySelector('.desktop-navigation a')
            ?.focus({ preventScroll: true })
        }
      }
      wasOpenRef.current = false
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    previousOverflowRef.current = previousOverflow
    wasOpenRef.current = true
    document.body.style.overflow = 'hidden'

    const focusFirstItem = window.requestAnimationFrame(() => {
      menuPanelRef.current
        ?.querySelector('button, a[href]')
        ?.focus()
    })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMenuOpen(false)
        return
      }

      if (event.key !== 'Tab' || !menuPanelRef.current) return

      const focusable = [
        ...menuPanelRef.current.querySelectorAll(
          'a[href], button:not(:disabled)',
        ),
      ].filter((element) => element.getClientRects().length > 0)

      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const closeOnDesktopResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', closeOnDesktopResize)

    return () => {
      window.cancelAnimationFrame(focusFirstItem)
      document.body.style.overflow = previousOverflow
      previousOverflowRef.current = null
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', closeOnDesktopResize)
    }
  }, [menuOpen])

  const closeMenu = () => {
    if (previousOverflowRef.current !== null) {
      document.body.style.overflow = previousOverflowRef.current
    }
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="site-nav">
        <div className="nav-inner">
          <a
            className="brand-mark"
            href="#home"
            aria-label={`${content.brand} home`}
            onClick={closeMenu}
          >
            {content.brand}
          </a>

          <nav className="desktop-navigation" aria-label="Main navigation">
            {content.navigation.map(({ id, label }) => (
              <a
                className={activeSection === id ? 'nav-link is-active' : 'nav-link'}
                href={`#${id}`}
                key={id}
                aria-current={activeSection === id ? 'location' : undefined}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="desktop-nav-actions">
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            <a className="button button-primary button-download-cv nav-cv" href={content.cvUrl} download={content.cvFileName}>
              {content.ui.downloadCv} <FiArrowUpRight aria-hidden="true" />
            </a>
          </div>

          <button
            className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
            type="button"
            ref={menuButtonRef}
            aria-label={menuOpen ? content.ui.closeMenu : content.ui.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="menu-lines" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`mobile-overlay${menuOpen ? ' is-open' : ''}`}
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeMenu()
        }}
      >
        <div
          className="mobile-menu-panel"
          ref={menuPanelRef}
          role="dialog"
          aria-modal={menuOpen ? 'true' : undefined}
          aria-label="Site navigation"
        >
          <div className="mobile-menu-top">
            <a className="brand-mark" href="#home" onClick={closeMenu}>
              {content.brand}
            </a>
            <button
              className="menu-toggle menu-close is-open"
              type="button"
              aria-label={content.ui.closeMenu}
              onClick={closeMenu}
            >
              <span className="menu-lines" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>

          <p className="mobile-menu-label">{content.ui.mobileMenuLabel}</p>
          <nav className="mobile-navigation" aria-label="Mobile navigation">
            {content.navigation.map(({ id, label }, index) => (
              <a
                className={activeSection === id ? 'mobile-nav-link is-active' : 'mobile-nav-link'}
                href={`#${id}`}
                key={id}
                onClick={closeMenu}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                {label}
              </a>
            ))}
          </nav>

          <a className="button button-primary button-download-cv mobile-cv" href={content.cvUrl} download={content.cvFileName} onClick={closeMenu}>
            {content.ui.downloadCv} <FiArrowUpRight aria-hidden="true" />
          </a>

          <div className="mobile-menu-bottom">
            <span className="mobile-menu-label">{content.ui.appearance}</span>
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            <SocialLinks className="mobile-socials" onLinkClick={closeMenu} />
          </div>
        </div>
      </div>
    </header>
  )
}
