# Aecure — Ice Cap Pro

Official marketing website for **Ice Cap Pro**, a reusable, refillable 360° ice therapy cap by Aecure.

🔗 Live site: https://www.aecure.com

## Structure

```
/
├── index.html              Homepage — product overview, features, how-to-use, comparison, FAQ
├── contact.html             Contact page
├── terms.html                Terms & Conditions + 15-day refund policy
├── styles.css                 Shared stylesheet
├── script.js                   Shared interactivity (nav, FAQ accordion, zone diagram, image lightbox)
├── images/                    Product photography and diagrams
├── sitemap.xml               Search engine sitemap
├── robots.txt                  Crawler rules
├── CNAME                      GitHub Pages custom domain config (www.aecure.com)
└── googleb4fe85c90f46bcd5.html   Google Search Console verification — do not remove or edit
```

## Deployment

This site is hosted via **GitHub Pages** on the custom domain `www.aecure.com` (see `CNAME`). Pushing to the deployed branch automatically publishes changes — no build step required, it's plain static HTML/CSS/JS.

## Before going fully live, update:

- [ ] Replace every `href="#"` "Buy Now" button with the real Amazon product link
- [ ] Add the registered business address in `contact.html` and `terms.html` (currently flagged as placeholders)
