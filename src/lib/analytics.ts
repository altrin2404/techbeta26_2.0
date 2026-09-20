// Consent-Aware Analytics Module for TechBETA 2026 2.0

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const COOKIE_CONSENT_KEY = "techbeta_cookie_consent";

export type ConsentStatus = "accepted" | "declined" | "undecided";

export function getCookieConsent(): ConsentStatus {
  if (typeof window === "undefined") return "undecided";
  try {
    const val = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (val === "accepted" || val === "declined") return val;
  } catch (e) {
    console.warn("Could not read cookie consent from storage:", e);
  }
  return "undecided";
}

export function setCookieConsent(status: "accepted" | "declined") {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, status);
    window.dispatchEvent(
      new CustomEvent("techbeta-cookie-consent-changed", { detail: status })
    );
  } catch (e) {
    console.warn("Could not save cookie consent:", e);
  }
}

export function initGA(measurementId: string) {
  if (typeof window === "undefined" || !measurementId) return;
  if (getCookieConsent() !== "accepted") return;

  // Prevent duplicate script injection
  if (document.getElementById("ga-script")) return;

  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    send_page_view: true,
  });
}

export function trackEvent(
  eventName: string,
  params: Record<string, string | number | boolean> = {}
) {
  if (typeof window === "undefined") return;
  if (getCookieConsent() !== "accepted") {
    return;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  } else {
    // Development / fallback logging
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Analytics Event] ${eventName}:`, params);
    }
  }
}

export function trackPageView(url: string) {
  trackEvent("page_view", { page_path: url });
}
