import { BotSensitivity, DetectionResult } from './types';

// Meta / Facebook crawler & automated reviewer signatures
const FB_BOT_SIGNATURES = [
  'facebookexternalhit',
  'facebookexternalhit/1.1',
  'facebookexternalhit/1.0',
  'facebot',
  'meta-externalagent',
  'meta-externalfetcher',
  'facebookcatalog',
  'facebookbot',
  'meta-crawler',
  'facebookplatform',
  'facebooksecurity',
  'meta-reviewer',
  'facebook-external-image',
  'facebook-ads-reviewer',
  'meta-ad-inspector',
  'fbmessenger',
  'fb_ad_review',
  'meta-pixel-checker',
];

// Cloud & Datacenter ASNs, Proxies and Hosting IP Header Signatures
const DATACENTER_INDICATORS = [
  'amazon',
  'aws',
  'googlecloud',
  'google-cloud',
  'digitalocean',
  'microsoft azure',
  'msft',
  'oracle cloud',
  'hetzner',
  'ovh sas',
  'ovh',
  'leaseweb',
  'linode',
  'vultr',
  'choopa',
  'm247',
  'datacenter',
  'server',
  'hosting',
  'crawler',
  'proxy',
];

// Automated scrapers, headless browsers & review emulators
const SCRAPER_SIGNATURES = [
  'headlesschrome',
  'phantomjs',
  'puppeteer',
  'selenium',
  'playwright',
  'webdriver',
  'nightwatch',
  'cypress',
  'chrome-lighthouse',
  'lighthouse',
  'python-requests',
  'python-urllib',
  'aiohttp',
  'httpx',
  'go-http-client',
  'curl',
  'wget',
  'libwww-perl',
  'postmanruntime',
  'insomnia',
  'apache-httpclient',
  'okhttp',
  'axios',
  'node-fetch',
  'got',
  'undici',
  'http_request',
  'scrapy',
  'splash',
  'prerender',
  'browserless',
  'headless',
];

// General search engine & ad network inspection crawlers
const AD_REVIEW_BOTS = [
  'googlebot',
  'adsbot-google',
  'mediapartners-google',
  'google-read-aloud',
  'google-safety',
  'bingbot',
  'adidxbot',
  'bingpreview',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'sogou',
  'exabot',
  'bytespider',
  'tiktokbot',
  'bytedance',
  'twitterbot',
  'telegrambot',
  'discordbot',
  'slackbot',
  'pinterestbot',
  'ahrefsbot',
  'semrushbot',
  'dotbot',
  'petalbot',
  'screaming frog',
  'mj12bot',
  'seznambot',
  'linkedinbot',
  'quora link preview',
  'applebot',
];

// Genuine Facebook In-App Browser signatures (Meta Mobile App Feed)
const FB_GENUINE_APP_SIGNATURES = [
  'fban/fbios',
  'fban/fb4a',
  'fbav/',
  'fb_iab',
  'instagram',
  'threads',
  'messenger',
];

export function detectBot(
  userAgent: string = '',
  headers: Headers | Record<string, string | string[] | undefined>,
  sensitivity: BotSensitivity = 'strict-fb',
  requireFbclid: boolean = false,
  urlParams: Record<string, string> = {}
): DetectionResult {
  const ua = userAgent.toLowerCase();
  const reasons: string[] = [];
  let isBot = false;

  const getHeader = (name: string): string => {
    if (headers instanceof Headers) {
      return headers.get(name) || '';
    }
    const val = headers[name] || headers[name.toLowerCase()];
    return Array.isArray(val) ? val[0] : (val || '');
  };

  const acceptLanguage = getHeader('accept-language');
  const via = getHeader('via');

  // Check 1: Empty or Suspiciously Short User Agent
  if (!ua || ua.trim().length < 12) {
    isBot = true;
    reasons.push('Anomalous or Empty User-Agent string');
  }

  // Check 2: Facebook / Meta Review Crawler Identification
  for (const botSig of FB_BOT_SIGNATURES) {
    if (ua.includes(botSig)) {
      isBot = true;
      reasons.push(`Meta Review Crawler Signature (${botSig})`);
      break;
    }
  }

  // Check 3: Automated Scrapers & Headless Testing Tools
  if (!isBot) {
    for (const scraper of SCRAPER_SIGNATURES) {
      if (ua.includes(scraper)) {
        isBot = true;
        reasons.push(`Automated Headless / Review Engine (${scraper})`);
        break;
      }
    }
  }

  // Check 4: Datacenter & Proxy Header Inspection
  if (!isBot && sensitivity !== 'standard') {
    const viaLower = via.toLowerCase();
    for (const dc of DATACENTER_INDICATORS) {
      if (viaLower.includes(dc) || ua.includes(dc)) {
        isBot = true;
        reasons.push(`Datacenter Proxy Cluster Detected (${dc})`);
        break;
      }
    }
  }

  // Check 5: Other Ad Network / Web Indexing Crawlers
  if (!isBot) {
    for (const bot of AD_REVIEW_BOTS) {
      if (ua.includes(bot)) {
        isBot = true;
        reasons.push(`Ad Compliance Scanner (${bot})`);
        break;
      }
    }
  }

  // Check 6: Header Integrity & Missing Browser Signals
  if (!isBot && sensitivity !== 'standard') {
    if (!acceptLanguage) {
      reasons.push('Missing Accept-Language Header (Review Node Signature)');
      if (sensitivity === 'paranoid' || sensitivity === 'strict-fb') {
        isBot = true;
      }
    }
  }

  // Check 7: Facebook Ad Click ID (fbclid) Validation
  const hasFbclid = Boolean(urlParams.fbclid || urlParams.FBCLID);
  const isFbInApp = FB_GENUINE_APP_SIGNATURES.some(sig => ua.includes(sig));

  if (requireFbclid && !hasFbclid && !isFbInApp) {
    isBot = true;
    reasons.push('Strict Rule Triggered: Missing verified Facebook Click ID (fbclid)');
  }

  // Determine Client Environment
  let device: 'mobile' | 'desktop' | 'tablet' | 'bot' = 'desktop';
  let os = 'Unknown OS';
  let browser = 'Modern Browser';

  if (isBot) {
    device = 'bot';
  } else if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    device = 'tablet';
  } else if (/iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/i.test(ua)) {
    device = 'mobile';
  }

  // OS Mapping
  if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS (Apple)';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/windows nt/i.test(ua)) os = 'Windows PC';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  // Browser Mapping
  if (isFbInApp) {
    browser = 'Facebook Mobile In-App Browser';
  } else if (ua.includes('instagram')) {
    browser = 'Instagram In-App Browser';
  } else if (/edg/i.test(ua)) {
    browser = 'Microsoft Edge';
  } else if (/chrome|crios/i.test(ua)) {
    browser = 'Google Chrome';
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    browser = 'Apple Safari';
  } else if (/firefox|fxios/i.test(ua)) {
    browser = 'Mozilla Firefox';
  }

  return {
    isBot,
    reasons,
    device,
    browser,
    os,
  };
}

/**
 * Meta Pixel & Adsterra Precision Parameter Mapper:
 * Ensures 100% of Facebook Pixel events, conversions, fbclid, and UTM tracking
 * are transferred seamlessly to destination URLs with zero data loss.
 */
export function buildTargetUrlWithParams(
  targetUrl: string,
  incomingParams: Record<string, string>,
  preserveUtms: boolean = true
): string {
  try {
    const url = new URL(targetUrl);
    
    if (preserveUtms) {
      for (const [key, value] of Object.entries(incomingParams)) {
        if (key !== 'slug' && value) {
          url.searchParams.set(key, value);
        }
      }

      // Meta Pixel & Adsterra Smart SubID Forwarding
      const fbclid = incomingParams.fbclid || incomingParams.FBCLID;
      if (fbclid) {
        if (!url.searchParams.has('subid')) {
          url.searchParams.set('subid', fbclid.substring(0, 48));
        }
        if (!url.searchParams.has('click_id')) {
          url.searchParams.set('click_id', fbclid);
        }
      }

      const campaign = incomingParams.utm_campaign || incomingParams.campaign;
      if (campaign && !url.searchParams.has('subid2')) {
        url.searchParams.set('subid2', campaign);
      }
    }
    return url.toString();
  } catch {
    return targetUrl;
  }
}

/**
 * Clean Compact Short Slug Generator:
 * Generates clean, short, high-converting 6-character URLs (e.g. ad-8f92, deal-3k9x)
 * that look authentic and clean on Facebook Ads.
 */
export function encodeLinkSlug(
  targetUrl: string,
  safePageType: string = 'tech-editorial',
  preset: string = 'fb-strict'
): string {
  // Generate short, clean, authentic 6-7 character slug
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let rand = '';
  for (let i = 0; i < 5; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `go-${rand}`;
}

export function decodeLinkSlug(slug: string): { targetUrl: string; safePageType: any } | null {
  try {
    if (!slug) return null;
    const clean = slug.trim();
    
    if (clean.startsWith('v-')) {
      const raw = clean.substring(2);
      
      // 1. Try Hex Decoding
      if (/^[0-9a-fA-F]+$/.test(raw) && raw.length % 2 === 0) {
        try {
          let json = '';
          for (let i = 0; i < raw.length; i += 2) {
            json += String.fromCharCode(parseInt(raw.substr(i, 2), 16));
          }
          const data = JSON.parse(json);
          if (data && data.u) {
            return {
              targetUrl: data.u,
              safePageType: data.s || 'tech-editorial',
            };
          }
        } catch {}
      }

      // 2. Base64 fallback
      try {
        const normalized = raw.replace(/-/g, '+').replace(/_/g, '/');
        let json = '';
        if (typeof window !== 'undefined' && typeof window.atob === 'function') {
          json = decodeURIComponent(escape(window.atob(normalized)));
        } else {
          json = Buffer.from(normalized, 'base64').toString('utf-8');
        }
        const data = JSON.parse(json);
        if (data && data.u) {
          return {
            targetUrl: data.u,
            safePageType: data.s || 'tech-editorial',
          };
        }
      } catch {}
    }
  } catch (err) {
    // If not a token slug, return null
  }
  return null;
}
