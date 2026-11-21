import { content } from '../data/content.js'
import facebookLight from '../assets/fb-white.png'
import facebookDark from '../assets/fb-black.png'
import githubLight from '../assets/github-white.png'
import githubDark from '../assets/github-black.png'
import linkedinLight from '../assets/linkedin-white.png'
import linkedinDark from '../assets/linkedin-black.png'
import emailLogo from '../assets/gmail-white.png'

const logos = {
  facebook: { light: facebookLight, dark: facebookDark },
  github: { light: githubLight, dark: githubDark },
  linkedin: { light: linkedinLight, dark: linkedinDark },
  email: { light: emailLogo, dark: emailLogo },
}

export function SocialLinks({ className = '', onLinkClick }) {
  return (
    <div className={`social-links ${className}`.trim()}>
      {content.socialLinks.map(({ id, label, href }) => {
        const logo = logos[id]

        if (!logo) return null

        return (
          <a
            className={`social-link social-link--${id}`}
            href={href}
            key={id}
            aria-label={label}
            title={label}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onLinkClick}
          >
            <img className="social-icon social-icon--light" src={logo.light} alt="" />
            <img
              className={`social-icon social-icon--dark${id === 'email' ? ' social-icon--email-dark' : ''}`}
              src={logo.dark}
              alt=""
            />
          </a>
        )
      })}
    </div>
  )
}
