"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initGA, trackPageView } from "@/lib/analytics";

interface AnalyticsProps {
  measurementId?: string;
}

export function Analytics({ measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID }: AnalyticsProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (measurementId) {
      initGA(measurementId);
    }

    const handleConsentChange = () => {
      if (measurementId) {
        initGA(measurementId);
      }
    };

    window.addEventListener("techbeta-cookie-consent-changed", handleConsentChange);
    return () => {
      window.removeEventListener("techbeta-cookie-consent-changed", handleConsentChange);
    };
  }, [measurementId]);

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return null;
}
