# PlayStudy — Landing Page

Animated, Framer-style landing page for the PlayStudy mobile app.

Pure HTML/CSS/JS — no build step. Open `index.html` in a browser or serve the folder with any static host (Vercel, Netlify, GitHub Pages, `python -m http.server`).

## What's in it

- Hero with animated gradient blobs, grid backdrop, gradient typography and a tilting 3D phone mockup
- Phone cycles through four app screens (Input → Summary → Quiz → Game) and is surrounded by floating "achievement" cards
- Cursor-follow glow, scroll-reveal sections, parallax on the hero blobs
- Marquee of supported subjects
- Feature cards with hover micro-interactions, animated step orbit, and bobbling mode pills
- **Fully playable Guess-the-Word game** in the page itself, with confetti on win
- Dark CTA card with App Store / Google Play buttons (placeholders — wire them up to your store links)

## Theme

Matches the Flutter app's design system in `playstudy-mb-ui/lib/core/theme/app_theme.dart`:

- Primary `#007AFF` · Secondary `#5856D6` · Accent `#22C55E`
- Inter typography, 16/12px rounded surfaces, white background

## Hooking up store links

Replace the `href="#"` on the two App Store / Google Play `<a>` tags in `index.html` (inside `#download`) with your real store URLs.
