# Personal portfolio

A responsive React + Vite portfolio using Tailwind CSS, Framer Motion, and React Icons. The layout and palette follow the supplied portfolio references and Vintage Summer palette.

## Run locally

```sh
npm install
npm run dev
```

Create and verify a production build:

```sh
npm run build
npm run preview
```

## Update your content

- Edit your name, bio, education, skills, email, navigation, and social links in [`src/data/content.js`](./src/data/content.js).
- Replace the sample projects, images, categories, and URLs in [`src/data/projects.js`](./src/data/projects.js).
- Replace [`public/cv.pdf`](./public/cv.pdf) with your own resume PDF. It is currently a clearly marked placeholder.
- Replace the portrait URL and responsive image sources in `src/data/content.js` with your own portrait.
- Replace the placeholder metadata and social URLs before publishing.

## Deploy

### Vercel

1. Import this repository in Vercel.
2. Select **Vite** (or use the defaults).
3. Set the build command to `npm run build` and the output directory to `dist`.
4. Deploy. The CV is served from `/cv.pdf`.

### Netlify

1. Import this repository in Netlify.
2. Set the build command to `npm run build` and the publish directory to `dist`.
3. Deploy. The CV is served from `/cv.pdf`.
