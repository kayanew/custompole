# James Karki — Portfolio

A personal portfolio for James Karki, a graphic designer and web developer based in Kathmandu, Nepal. It presents his background, design and development skills, selected work, CV, and contact links.

## Built with

- React and Vite
- Tailwind CSS
- Framer Motion
- React Icons

## Run locally

Install dependencies and start the development server:

```sh
npm ci
npm run dev
```

Create and preview a production build:

```sh
npm run build
npm run preview
```

Run the linter with `npm run lint`.

## Update portfolio content

- Edit the profile, biography, skills, contact details, and social links in [`src/data/content.js`](./src/data/content.js).
- Edit the project cards in [`src/data/projects.js`](./src/data/projects.js).
- Replace the CV at [`src/assets/jameskarki_cv.pdf`](./src/assets/jameskarki_cv.pdf). If you change its filename or location, update the import in `src/data/content.js`.
- Replace the optimized portrait at [`src/assets/portrait.jpg`](./src/assets/portrait.jpg) and update its alt text in `src/data/content.js`. If you change its filename or format, update the import in `src/data/content.js`.
- Update the page title and description in [`index.html`](./index.html).

## Deploy to GitHub Pages

The workflow at [`.github/workflows/jekyll-gh-pages.yml`](./.github/workflows/jekyll-gh-pages.yml) builds and deploys the site when changes are pushed to `main`. It installs dependencies with `npm ci`, builds the `dist` directory, and deploys it to GitHub Pages.

Set the repository's Pages source to **GitHub Actions**. The workflow copies [`CNAME`](./CNAME) into the build output to preserve the configured custom domain.
