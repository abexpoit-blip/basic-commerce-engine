import { BotSensitivity, DetectionResult } from './types';

// Meta / Facebook crawler & automated reviewer signatures
const FB_BOT_SIGNATURES = [
  'facebookexternalhit',
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
];

// Datacenter & cloud IP range indicators / headers
const DATACENTER_INDICATORS = [
  'amazon',
  'aws',
  'googlecloud',
  'digitalocean',
  'microsoft azure',
  'oracle cloud',
  'hetzner',
  'ovh sas',
  'leaseweb',
  'linode',
  'vultr',
  'choopa',
  'm247',
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

  // Check 4: Other Ad Network / Web Indexing Crawlers
  if (!isBot) {
    for (const bot of AD_REVIEW_BOTS) {
      if (ua.includes(bot)) {
        isBot = true;
        reasons.push(`Advertising & Compliance Crawler (${bot})`);
        break;
      }
    }
  }

  // Check 5: Header Integrity & Missing Browser Signals
  if (!isBot && sensitivity !== 'standard') {
    if (!acceptLanguage) {
      reasons.push('Missing Accept-Language Header (Common in review bots)');
      if (sensitivity === 'paranoid') {
        isBot = true;
      }
    }
  }

  // Check 6: Facebook Ad Click ID (fbclid) Validation
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
    }
    return url.toString();
  } catch {
    return targetUrl;
  }
}

/**
 * Universal Serverless Slug Codec (Dual Browser & Node.js Safe):
 * Encodes targetUrl + routing profile into a compact, URL-safe slug token
 * so every Vercel Lambda across the globe can resolve the target destination
 * instantly without database dependencies.
 */
export function encodeLinkSlug(
  targetUrl: string,
  safePageType: string = 'tech-editorial',
  preset: string = 'fb-strict'
): string {
  try {
    const payload = JSON.stringify({
      u: targetUrl.trim(),
      s: safePageType,
      p: preset,
    });
    
    let base64 = '';
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      // Browser environment (btoa safe utf-8)
      base64 = window.btoa(unescape(encodeURIComponent(payload)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    } else {
      // Node.js runtime
      base64 = Buffer.from(payload, 'utf-8')
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
    return `v-${base64}`;
  } catch (err) {
    console.error('encodeLinkSlug error:', err);
    return `ad-${Math.random().toString(36).substring(2, 7)}`;
  }
}

export function decodeLinkSlug(slug: string): { targetUrl: string; safePageType: any } | null {
  try {
    if (slug.startsWith('v-')) {
      const raw = slug.substring(2).replace(/-/g, '+').replace(/_/g, '/');
      let json = '';
      if (typeof window !== 'undefined' && typeof window.atob === 'function') {
        json = decodeURIComponent(escape(window.atob(raw)));
      } else {
        json = Buffer.from(raw, 'base64').toString('utf-8');
      }
      const data = JSON.parse(json);
      if (data && data.u) {
        return {
          targetUrl: data.u,
          safePageType: data.s || 'tech-editorial',
        };
      }
    }
  } catch (err) {
    // If not a token slug, return null
  }
  return null;
}
