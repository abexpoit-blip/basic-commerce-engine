export type SafePageTemplateType = 
  | 'tech-editorial' 
  | 'ecommerce-showcase' 
  | 'agency-services' 
  | 'custom-url';

export type RedirectMethod = 'meta-refresh' | 'js-instant' | 'direct-302' | 'safe-bridge';

export type BotSensitivity = 'standard' | 'strict-fb' | 'paranoid';

export type LeakRiskLevel = 'safe' | 'low-risk' | 'moderate-risk' | 'high-risk';

export interface LinkHealth {
  score: number; // 0 to 100
  riskLevel: LeakRiskLevel;
  crawlerScanSurge: boolean;
  metaReviewFrequency: 'normal' | 'elevated' | 'critical-surge';
  lastCrawlerAudit?: string;
  recommendation: string;
}

export interface ShortLink {
  id: string;
  slug: string;
  title: string;
  targetUrl: string; // The real money/offer page (sales, adsterra, etc.)
  safePageType: SafePageTemplateType;
  customSafeUrl?: string;
  redirectMethod: RedirectMethod;
  sensitivity: BotSensitivity;
  enabled: boolean;
  allowedCountries?: string[]; // Empty means all
  allowedDevices?: ('mobile' | 'desktop' | 'tablet')[];
  requireFbclid?: boolean; // If true, only visitors with fbclid or valid FB headers get through
  preserveUtms: boolean;
  notes?: string;
  createdAt: string;
  health: LinkHealth;
  clicks: {
    total: number;
    human: number;
    bot: number;
  };
}

export interface TrafficLog {
  id: string;
  linkId: string;
  slug: string;
  timestamp: string;
  ip: string;
  country: string;
  device: 'mobile' | 'desktop' | 'tablet' | 'bot';
  browser: string;
  os: string;
  referrer: string;
  userAgent: string;
  isBot: boolean;
  detectionReasons: string[];
  actionTaken: 'redirected-to-target' | 'served-safe-page';
  urlParams: Record<string, string>;
}

export interface DetectionResult {
  isBot: boolean;
  reasons: string[];
  device: 'mobile' | 'desktop' | 'tablet' | 'bot';
  browser: string;
  os: string;
}
