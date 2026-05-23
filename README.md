# PlayStudy — Landing Page

A Vue 3 + Vite landing page for the PlayStudy mobile app, animated with [**motion-v**](https://motion.unovue.com/) (the Vue port of Framer Motion).

## Stack

- **Vue 3** with `<script setup>` SFCs
- **Vite** for dev/build
- **motion-v** for `<motion.*>` components, `whileHover`, `whileTap`, `whileInView`, `AnimatePresence`
- Plain CSS with the iOS-inspired palette from the Flutter app (`#007AFF`, `#5856D6`, `#22C55E`, Inter)

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

For a production bundle:

```bash
npm run build        # outputs to dist/
npm run preview      # serve the production build locally
```

Deploy `dist/` to Vercel, Netlify, Cloudflare Pages, GitHub Pages — any static host.

## Project structure

```
src/
├── main.js
├── styles.css                 # global theme + reset
├── App.vue
└── components/
    ├── CursorGlow.vue         # cursor-follow radial glow
    ├── NavBar.vue             # floating pill nav
    ├── Hero.vue               # gradient blobs, grid, copy
    ├── PhoneMockup.vue        # 3D-tilt phone, cycles 4 screens
    ├── Trust.vue              # subject marquee
    ├── Features.vue           # 3-up feature grid
    ├── HowItWorks.vue         # 3-step timeline
    ├── GameShowcase.vue       # PLAYABLE Guess-the-Word with confetti
    ├── CTA.vue                # App Store / Play Store buttons
    └── Footer.vue
```

## Animations used

- `motion.div` with `initial` / `animate` / `transition` for hero entrance and reveal sections
- `whileInView` for scroll-triggered fade-up on every section/card
- `whileHover` + `whileTap` micro-interactions on buttons, feature cards and game keys
- `AnimatePresence` with `mode="wait"` for the phone's screen-cycle
- Looping `animate: { y: [0, -10, 0] }` for the floating achievement cards
- Vanilla canvas confetti on a successful word guess

## Hooking up the store links

Replace `href="#"` on the two `<motion.a>` tags inside `src/components/CTA.vue` (App Store + Google Play) with your real store URLs.
