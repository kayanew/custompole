
import portrait from '../assets/portrait.jpg'
import cv from '../assets/jameskarki_cv.pdf'

export const content = {
  brand: 'Portfolio',
  name: 'James Karki',
  role: 'Graphic designer and web developer',
  location: 'Kathmandu, Nepal',
  email: 'karkijames@gmail.com',
  cvUrl: cv,
  cvFileName: 'James-Karki-CV.pdf',

  seo: {
    title: 'James Karki - Portfolio',
    description:
      'Graphic designer and web developer from Kathmandu, creating clean, user-friendly digital experiences.',
  },

  navigation: [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ],

  hero: {
    eyebrow: 'Open to new opportunities',
    titleLead: 'Design meets',
    titleAccent: ' possibility.',
    description: 'I design visuals and develop websites.',
    availability: 'Available for junior software engineer roles and design internships',
  },

  about: {
    number: '02',
    eyebrow: '02 / A little about me',
    title: 'Curious by nature. Creative by choice.',
    introduction:
      "Hi, I'm James Karki. I enjoy combining design and programming to create things that look good and work well.",
    description:
      "I'm a BCA student currently in my 6th semester with a good understanding of graphic design and web development. I enjoy designing creative visuals and building websites, always focusing on simplicity, usability, and detail.",
    portrait,
    portraitAlt: 'Abstract layered purple artwork',
    portraitCaption: 'Portrait',

    details: [
      { label: 'Education', value: 'BCA · 6th Semester' },
      { label: 'Focus', value: 'Branding & digital' },
      { label: 'Tools', value: 'Figma + React' },
      { label: 'Currently', value: 'Open to remote work' },
    ],

    note: 'Outside the screen: personal growth books, hand drawings, and meeting new people.',
  },

  skills: {
    number: '03',
    eyebrow: '03 / The toolkit',
    title: 'Two disciplines. One creative mindset.',
    description:
      'From the first sketch to the final commit — I bring both sides to the table.',

    groups: [
      {
        number: '01',
        title: 'Design',
        description: 'Visual identities with character. Interfaces with clarity.',
        tools: ['Figma', 'Photoshop', 'Canva'],
        note: 'Brand identity / UI/UX / Editorial design',
      },
      {
        number: '02',
        title: 'Development',
        description: 'Considered interfaces. Clean, maintainable builds.',
        tools: ['C', 'React', 'Java', 'PHP'],
        note: 'Frontend development / Responsive design',
      },
    ],
  },

  projects: {
    number: '04',
    eyebrow: '04 / Selected work',
    title: 'Projects',
    count: 'Project',
    categorySuffix: 'Selected work',
  },

  contact: {
    number: '05',
    eyebrow: '05 / Say hello',
    title: 'Good work starts with hello.',
    description: 'A project, an internship, or just a good idea.',
    supportingText: "I'd love to hear from you.",
    cardEyebrow: "Let's build something",
    cardTitle: 'Your next creative teammate?',
    availability: 'Usually replies instantly',
    socialHeading: 'Elsewhere on the internet',
    footerNote: 'Designed with purpose. Built with care.',
    footerCredit: 'Design + development · Icons by: Flaticon',
  },

  ui: {
    downloadCv: 'Download CV',
    viewCv: 'View CV',
    viewProjects: 'View projects',
    projectLink: 'View on GitHub',
    appearance: 'Appearance',
    mobileMenuLabel: 'Explore / portfolio',
    sayHello: 'Say hello',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    openMenu: 'Open navigation menu',
    closeMenu: 'Close navigation menu',
  },

  socialLinks: [
    {
      id: 'facebook',
      label: 'Facebook',
      href: 'https://www.facebook.com/Jameskarki007',
    },
    {
      id: 'github',
      label: 'GitHub',
      href: 'https://github.com/its-james07',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/james-karki-585631326/',
    },
    {
      id: 'email',
      label: 'Email',
      href: 'mailto:karkijames@gmail.com',
    },
  ],
}
