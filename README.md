# LinkShield Pro - Facebook Ads Smart Shortener & Link Protection Engine

A production-ready smart URL shortener and traffic routing defense platform designed for media buying agencies, affiliate marketers, and Facebook ad campaigns.

---

## 🎯 What it does

When running ads on Meta (Facebook & Instagram) to affiliate offers (like Adsterra), CPA networks, or high-velocity sales pages, automated review bots or policy crawlers may trigger false rejections.

**LinkShield Pro** provides automated dual-route traffic intelligence:
1. **Facebook/Meta Review Bots & Crawlers** \(\rightarrow\) Automatically served a **100% Policy-Compliant Safe Page** (Tech Editorial, E-commerce Store, or Business Advisory showcase) with verified terms, privacy policy, and disclaimers.
2. **Real Targeted Humans (from FB Ad clicks)** \(\rightarrow\) Seamlessly forwarded straight to your **Target Sales Page / Adsterra Direct Link** with full UTM & `fbclid` query parameter passthrough.

---

## 🚀 Key Features

- **Multi-Vector Bot & Reviewer Defense Engine**:
  - Detects Meta review bots (`facebookexternalhit`, `Facebot`, Meta crawl agents), Headless Chrome / Puppeteer / Playwright, datacenter user-agents, and automated scrapers.
  - Recognizes legitimate Facebook In-App Browsers (`FBAN`, `FBIOS`, `FB_IAB`, `Instagram`), touch environments, and active query trackers.
- **Agency Management Dashboard**:
  - Create and manage short links with custom slugs (`/r/your-slug`).
  - Configure Safe Page templates (Tech Editorial Guide, E-commerce Store, Agency Advisory, or Custom Safe URL).
  - Configurable sensitivity (`Strict Meta Defense`, `Standard Filter`, `Paranoid Mode`).
  - Device filters (Mobile-only, Desktop, Tablet) and Geo allowlists.
  - UTM & `fbclid` parameter passthrough.
- **Built-in Facebook Ad Bot Simulator Tool**:
  - Test any link live pretending to be Meta Crawler vs Real iPhone FB ad clicks before submitting your campaign to Meta Ads Manager.
- **Live Real-time Traffic Stream**:
  - Live inspection stream showing IP, Country, Device, Browser, Detection triggers, and Routing outcomes.
- **1-Click Deployable to Vercel & Netlify**:
  - Built with Next.js 14 App Router and Edge API routes.

---

## 🛠️ Quick Local Setup

1. Open a terminal in this directory:
   ```bash
   npm install
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel or Netlify & Add Custom Domain

### Deploy on Vercel:
1. Push this folder to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Click **Deploy** (No special environment variables required).

### Add Your Custom Domain:
1. In Vercel Project Settings \(\rightarrow\) **Domains**, add your custom domain (e.g. `promo-deals-2026.com`).
2. Point your DNS records as instructed by Vercel (CNAME to `cname.vercel-dns.com` or A record to `76.76.21.21`).
3. Your short links will now run on `https://promo-deals-2026.com/r/your-slug`!

---

## 📋 Best Practices for Media Buyers

1. **Test Before Submitting**: Use the built-in **FB Bot Simulator** tab to ensure the crawler sees the safe page and real mobile users get forwarded.
2. **Preserve UTMs**: Keep "Preserve UTM Parameters" enabled so your tracking IDs and conversion pixels in your destination sales page receive the complete ad attribution data.
