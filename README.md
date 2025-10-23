# 🚀 AIx Summit — Event Landing Page

Modern, aesthetic, and fully functional event landing page for an AI conference with responsive layout, smooth motion, accessibility, and a ready registration flow.  

## ✨ Features

- Conversion‑focused hero with sticky nav and clear CTAs.  
-  Live countdown timer with accessible labels.  
-  Speakers carousel (scroll‑snap), schedule tabs, pricing cards.  
-  FAQ accordion with native <details>.  
-  Theme toggle (dark/light) with persistent preference.  
-  Reveal on scroll (IO) + progressive enhancement for native scroll‑driven animations.  
-  One‑click ICS calendar invite generation.  
-  Client‑side validation + localStorage fallback for registration.  

## 🧰 Tech Stack

- HTML5 landmarks (header, nav, main, footer).  
- Modern CSS: variables, gradients, container queries (opt‑in), fluid type, scroll‑driven animations (opt‑in).  
- Vanilla JavaScript: IntersectionObserver, smooth scroll, dialog handling, form validation.  

## 🚀 Quick Start

1) Clone and open index.html directly, or use any static server (e.g., local dev server).  
2) Edit branding, text, speakers, schedule, and tickets in index.html.  
3) Update event date in the countdown: data-event-time="YYYY-MM-DDTHH:MM:SS±TZ".  

## 🔧 Configuration

- FORM_ENDPOINT: set to your API endpoint to store registrations on a backend; when empty, successful submissions are saved in localStorage for testing.  
- Calendar: the ICS file is generated on submit; use the “Add to Calendar” button after success.  

## 🧪 Accessibility

- Landmarks for navigation, :focus-visible rings, high contrast text, and prefers-reduced-motion support.  
- Keyboard‑friendly modal with Escape to close and proper aria attributes.  


## 🖌️ Customization Tips

- Adjust brand colors in :root and gradients for your visual identity.  
- Tweak animation durations and easing for motion personality.  
- Swap speaker avatars with real images or SVG monograms.  

## 📦 Deployment

- Push to your repository and enable any static hosting (e.g., organization Pages or a static host).  
- Ensure asset paths are relative for zero‑config hosting.  

## 🤝 Contributing

- Fork, create a feature branch, commit with clear messages, and open a pull request.  
- Keep sections cohesive: one focused change per PR for easier review.  

## 📝 License

- MIT — free to use, modify, and distribute.  

## 🙌 Acknowledgments

- Built with modern web platform features: container queries, scroll‑driven animations, and view transitions concepts.  


