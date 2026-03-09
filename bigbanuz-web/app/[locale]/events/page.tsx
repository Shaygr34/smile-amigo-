import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { client } from "@/lib/sanity/client";
import { packagesQuery, galleryByLaneQuery } from "@/lib/sanity/queries";
import { urlFor, getBlurDataURL } from "@/lib/sanity/image";
import Hero from "@/components/sections/Hero";
import PackagesSection from "@/components/sections/PackagesSection";
import TrustSection from "@/components/sections/TrustSection";
import GalleryGrid from "@/components/ui/GalleryGrid";
import CtaSection from "@/components/sections/CtaSection";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { GalleryImage } from "@/components/ui/GalleryGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Events" });

  let ogImage: string | undefined;
  try {
    const galleries = await client.fetch<GalleryDoc[]>(
      galleryByLaneQuery,
      { lane: "events", locale },
      { next: { tags: ["sanity"] } }
    );
    const firstImage = galleries?.[0]?.images?.[0]?.image;
    if (firstImage?.asset?._ref) {
      ogImage = urlFor(firstImage).width(1200).height(630).quality(80).auto("format").url();
    }
  } catch {
    // fallback to default
  }

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      images: [{ url: ogImage || "/og-events.jpg", width: 1200, height: 630 }],
    },
    alternates: {
      languages: { en: "/en/events", he: "/he/events" },
    },
  };
}

interface SanityImage {
  asset?: { _ref?: string };
}

interface Package {
  _id: string;
  title: string;
  priceDisplay: string;
  priceILS: number;
  inclusions: string[];
  ctaText?: string;
  featured?: boolean;
  sortOrder: number;
}

interface GalleryDoc {
  _id: string;
  title: string;
  images?: Array<{
    image: SanityImage;
    alt: string;
    caption?: string;
    location?: string;
  }>;
}

function getImageUrl(image?: SanityImage, width = 800): string {
  if (!image?.asset?._ref) return "";
  try {
    return urlFor(image).width(width).quality(80).auto("format").url();
  } catch {
    return "";
  }
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Events");

  let packages: Package[] = [];
  let galleries: GalleryDoc[] = [];
  try {
    [packages, galleries] = await Promise.all([
      client.fetch<Package[]>(packagesQuery, { locale }, { next: { tags: ["sanity"] } }),
      client.fetch<GalleryDoc[]>(galleryByLaneQuery, { lane: "events", locale }, { next: { tags: ["sanity"] } }),
    ]);
  } catch {
    // CMS not configured yet
  }

  const displayPackages = packages;

  const galleryEntries: { galleryImage: GalleryImage; source: SanityImage }[] = [];
  for (const gallery of galleries) {
    if (gallery.images) {
      for (const img of gallery.images) {
        const url = getImageUrl(img.image);
        if (url) {
          galleryEntries.push({
            galleryImage: {
              url,
              alt: img.alt || "Event photography",
              caption: img.caption,
              location: img.location,
            },
            source: img.image,
          });
        }
      }
    }
  }

  const heroSource = galleries[0]?.images?.[0]?.image;
  const eventsHeroUrl = galleryEntries.length > 0 ? getImageUrl(heroSource, 1920) : "";

  const [heroBlur] = await Promise.all([
    heroSource?.asset?._ref ? getBlurDataURL(heroSource) : Promise.resolve(""),
    ...galleryEntries.map(async (entry) => {
      entry.galleryImage.blurDataURL = await getBlurDataURL(entry.source);
    }),
  ]);

  const galleryImages = galleryEntries.map((e) => e.galleryImage);

  const packageJsonLd = displayPackages.map((pkg) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${pkg.title} Event Photography Package`,
    description: pkg.inclusions.join(", "),
    brand: { "@type": "Brand", name: "Smile Amigo" },
    offers: {
      "@type": "Offer",
      price: pkg.priceILS,
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(new Date().getFullYear() + 1, 0, 1).toISOString().split("T")[0],
    },
  }));

  return (
    <>
      {packageJsonLd.map((jsonLd, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}
      <Hero
        imageUrl={eventsHeroUrl}
        imageAlt={t("heroImageAlt")}
        blurDataURL={heroBlur}
        headline={t("heroHeadline")}
        subline={t("heroSubline")}
        ctas={[
          { label: t("checkAvailability"), href: "#packages" },
        ]}
      />

      <PackagesSection packages={displayPackages} />

      <TrustSection />

      {galleryImages.length > 0 && (
        <section className="py-section">
          <div className="max-w-wide mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-h2 font-heading font-bold text-black text-center mb-8">
                {t("portfolioTitle")}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <GalleryGrid images={galleryImages} columns={3} gap="tight" />
            </ScrollReveal>
          </div>
        </section>
      )}

      <CtaSection
        headline={t("ctaHeadline")}
        whatsappLabel={t("whatsappMe")}
        emailLabel={t("sendEmail")}
        emailHref="/contact"
      />
    </>
  );
}
