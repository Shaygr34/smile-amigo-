"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import PackageCard from "@/components/ui/PackageCard";
import PackageComparisonTable from "@/components/ui/PackageComparisonTable";
import ViewToggle from "@/components/ui/ViewToggle";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface Package {
  _id: string;
  title: string;
  priceDisplay: string;
  inclusions: string[];
  ctaText?: string;
  featured?: boolean;
}

interface PackagesSectionProps {
  packages: Package[];
}

export default function PackagesSection({ packages }: PackagesSectionProps) {
  const [view, setView] = useState<"cards" | "table">("cards");
  const t = useTranslations("Events");

  if (!packages || packages.length === 0) return null;

  return (
    <section id="packages" className="py-section">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-h2 font-heading font-bold text-black text-center mb-4">
            {t("packagesTitle")}
          </h2>
          <p className="text-body text-gray-mid text-center max-w-text mx-auto mb-8">
            {t("packagesSubtitle")}
          </p>
        </ScrollReveal>

        <ViewToggle view={view} onChange={setView} />

        {view === "cards" ? (
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
              <ScrollReveal key={pkg._id} delay={i * 100}>
                <PackageCard
                  title={pkg.title}
                  priceDisplay={pkg.priceDisplay}
                  inclusions={pkg.inclusions}
                  ctaText={pkg.ctaText}
                  featured={pkg.featured}
                />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal>
            <PackageComparisonTable packages={packages} />
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
